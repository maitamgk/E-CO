import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Order, OrderStatus, PaymentMethod, PaymentStatus, StatusHistoryEntry } from '@/types';

interface OrderRow {
  id: string;
  order_code: string;
  user_id: string;
  customer_info: Order['customer'];
  items: Order['items'];
  totals: Order['totals'];
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  status_history?: StatusHistoryEntry[];
  current_location?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

type OrderPayload = Record<string, unknown>;

const DEFAULT_LOCATION = 'Kho B-ECO (Phú Yên)';

const STATUS_NOTES: Record<OrderStatus, string> = {
  pending: 'Đang xử lý',
  confirmed: 'Đã xác nhận & đang đóng gói tại Kho Phú Yên',
  shipped: 'Đã bàn giao đơn vị vận chuyển',
  delivered: 'Đã giao tới địa chỉ khách hàng',
  cancelled: 'Đã hủy đơn hàng',
};

const digitsOnly = (value: string): string => value.replace(/[^0-9]/g, '');

/**
 * Tên cột mà Postgres/PostgREST báo là không tồn tại.
 *
 * Dự án từng chạy trên schema thiếu payment_status/status_history/
 * current_location. Thay vì hardcode từng cột như trước, ta bóc tên cột từ
 * thông báo lỗi để bản deploy cũ vẫn ghi được đơn khi migration chưa chạy.
 * Sau khi chạy supabase_migration_orders_v2.sql thì nhánh này không còn dùng tới.
 */
const missingColumnFrom = (error: PostgrestError | null, payload: OrderPayload): string | null => {
  if (!error) return null;
  const haystack = `${error.message ?? ''} ${error.details ?? ''} ${error.hint ?? ''}`;
  const match = haystack.match(/column "?([a-z_]+)"?/i);
  const column = match?.[1];
  if (column && column in payload) return column;

  // Một số lỗi chỉ nêu tên cột trong message mà không có từ khóa "column".
  return Object.keys(payload).find(key => haystack.includes(key)) ?? null;
};

/** Ghi payload, tự bỏ cột schema chưa có rồi thử lại. */
const writeWithSchemaFallback = async (
  payload: OrderPayload,
  write: (data: OrderPayload) => Promise<{ error: PostgrestError | null }>,
): Promise<PostgrestError | null> => {
  const data = { ...payload };

  for (let attempt = 0; attempt <= Object.keys(payload).length; attempt += 1) {
    const { error } = await write(data);
    if (!error) return null;

    const missing = missingColumnFrom(error, data);
    if (!missing) return error;

    console.warn(`Cột "${missing}" chưa có trên DB — bỏ qua và thử lại. Hãy chạy supabase_migration_orders_v2.sql.`);
    delete data[missing];
  }

  return null;
};

/** Lịch sử trạng thái hiện tại của đơn, tự dựng lại nếu DB chưa có dữ liệu. */
const loadHistory = (
  row: Pick<OrderRow, 'status_history' | 'status' | 'created_at' | 'current_location'> | null,
  fallbackTimestamp: string,
): StatusHistoryEntry[] => {
  if (Array.isArray(row?.status_history) && row.status_history.length > 0) {
    return [...row.status_history];
  }

  return [
    {
      status: row?.status ?? 'pending',
      timestamp: row?.created_at ?? fallbackTimestamp,
      note: row?.current_location,
    },
  ];
};

const parseOrder = (data: OrderRow): Order => {
  const createdAtDate = new Date(data.created_at);
  const updatedAtDate = new Date(data.updated_at);

  const statusHistory: StatusHistoryEntry[] = Array.isArray(data.status_history) && data.status_history.length > 0
    ? data.status_history
    : [
        { status: 'pending', timestamp: createdAtDate.toISOString() },
        ...(data.status !== 'pending'
          ? [{ status: data.status, timestamp: updatedAtDate.toISOString() }]
          : []),
      ];

  const lastNote = statusHistory[statusHistory.length - 1]?.note;

  return {
    id: data.id,
    orderCode: data.order_code,
    userId: data.user_id,
    customer: data.customer_info,
    items: data.items,
    totals: data.totals,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    status: data.status,
    statusHistory,
    currentLocation: data.current_location || lastNote,
    notes: data.notes,
    createdAt: createdAtDate,
    updatedAt: updatedAtDate,
  };
};

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return (data as OrderRow[]).map(parseOrder);
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    return (data as OrderRow[]).map(parseOrder);
  },

  addOrder: async (order: Order): Promise<boolean> => {
    const initialHistory: StatusHistoryEntry[] = [
      {
        status: order.status,
        timestamp: order.createdAt.toISOString(),
        note: order.currentLocation || 'Khởi tạo đơn hàng tại Kho B-ECO',
      },
    ];

    const payload: OrderPayload = {
      id: order.id,
      order_code: order.orderCode,
      user_id: order.userId,
      customer_info: order.customer,
      items: order.items,
      totals: order.totals,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      status: order.status,
      status_history: initialHistory,
      current_location: order.currentLocation || DEFAULT_LOCATION,
      notes: order.notes,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
    };

    const error = await writeWithSchemaFallback(payload, async data => {
      const { error: err } = await supabase.from('orders').insert(data);
      return { error: err };
    });

    if (error) {
      console.error('Error adding order:', error);
      return false;
    }
    return true;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
    locationNote?: string,
  ): Promise<boolean> => {
    const nowIso = new Date().toISOString();

    const { data: currentOrder } = await supabase
      .from('orders')
      .select('created_at, status_history, status, current_location')
      .eq('id', orderId)
      .maybeSingle();

    const history = loadHistory(currentOrder, nowIso);
    const note = locationNote?.trim() || STATUS_NOTES[status];

    history.push({ status, timestamp: nowIso, note });

    const payload: OrderPayload = {
      status,
      status_history: history,
      current_location: note,
      updated_at: nowIso,
    };

    const error = await writeWithSchemaFallback(payload, async data => {
      const { error: err } = await supabase.from('orders').update(data).eq('id', orderId);
      return { error: err };
    });

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }
    return true;
  },

  updateOrderLocation: async (orderId: string, locationNote: string): Promise<boolean> => {
    const nowIso = new Date().toISOString();

    const { data: currentOrder } = await supabase
      .from('orders')
      .select('created_at, status_history, status, current_location')
      .eq('id', orderId)
      .maybeSingle();

    const history = loadHistory(currentOrder, nowIso);

    history.push({
      status: currentOrder?.status ?? 'shipped',
      timestamp: nowIso,
      note: locationNote,
    });

    const payload: OrderPayload = {
      status_history: history,
      current_location: locationNote,
      updated_at: nowIso,
    };

    const error = await writeWithSchemaFallback(payload, async data => {
      const { error: err } = await supabase.from('orders').update(data).eq('id', orderId);
      return { error: err };
    });

    if (error) {
      console.error('Error updating order location:', error);
      return false;
    }
    return true;
  },

  deleteOrder: async (orderId: string): Promise<boolean> => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }
    return true;
  },

  /**
   * Tra cứu đơn bằng mã đơn + số điện thoại.
   *
   * Ưu tiên RPC `lookup_order` (so khớp số điện thoại ngay trong DB, không cần
   * mở quyền đọc toàn bảng). Nếu project chưa chạy migration thì lùi về cách
   * cũ: đọc theo mã đơn rồi đối chiếu số điện thoại ở client.
   */
  getOrderByCodeAndPhone: async (orderCode: string, phone: string): Promise<Order | null> => {
    const code = orderCode.trim();
    const inputPhone = digitsOnly(phone);
    if (!code || inputPhone.length < 9) return null;

    const { data, error } = await supabase.rpc('lookup_order', {
      p_order_code: code,
      p_phone: inputPhone,
    });

    if (!error) {
      const rows = (data ?? []) as OrderRow[];
      return rows.length > 0 ? parseOrder(rows[0]) : null;
    }

    console.warn('RPC lookup_order chưa sẵn sàng, dùng truy vấn trực tiếp. Hãy chạy supabase_migration_orders_v2.sql.');

    const { data: row, error: queryError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', code)
      .maybeSingle();

    if (queryError || !row) return null;

    const order = parseOrder(row as OrderRow);
    return digitsOnly(order.customer.phone) === inputPhone ? order : null;
  },
};
