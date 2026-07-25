import { supabase } from '@/lib/supabase';
import { Order, OrderStatus, PaymentMethod, PaymentStatus, StatusHistoryEntry } from '@/types';
import { orderStorage } from '@/utils/orderStorage';

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

    return data.map(parseOrder);
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

    return data.map(parseOrder);
  },

  addOrder: async (order: Order): Promise<boolean> => {
    const initialHistory: StatusHistoryEntry[] = [
      {
        status: order.status,
        timestamp: order.createdAt.toISOString(),
        note: order.currentLocation || 'Khởi tạo đơn hàng tại Kho B-ECO',
      },
    ];

    const orderData: Record<string, any> = {
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
      current_location: order.currentLocation || 'Kho B-ECO (Phú Yên)',
      notes: order.notes,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
    };

    let { error } = await supabase.from('orders').insert(orderData);

    // Fallback if status_history or current_location columns don't exist yet on DB
    if (error && (error.message?.includes('status_history') || error.message?.includes('current_location'))) {
      delete orderData.status_history;
      delete orderData.current_location;
      const retry = await supabase.from('orders').insert(orderData);
      error = retry.error;
    }

    if (error) {
      console.error('Error adding order:', error);
      return false;
    }
    return true;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
    locationNote?: string
  ): Promise<boolean> => {
    const nowIso = new Date().toISOString();

    const { data: currentOrder } = await supabase
      .from('orders')
      .select('created_at, status_history, status, current_location')
      .eq('id', orderId)
      .maybeSingle();

    let history: StatusHistoryEntry[] = Array.isArray(currentOrder?.status_history)
      ? [...currentOrder.status_history]
      : [];

    if (history.length === 0) {
      history.push({
        status: currentOrder?.status || 'pending',
        timestamp: currentOrder?.created_at || nowIso,
        note: currentOrder?.current_location,
      });
    }

    const note = locationNote || (
      status === 'confirmed' ? 'Đã xác nhận & đang đóng gói tại Kho Phú Yên' :
      status === 'shipped' ? 'Đã bàn giao đơn vị vận chuyển' :
      status === 'delivered' ? 'Đã giao tới địa chỉ khách hàng' :
      status === 'cancelled' ? 'Đã hủy đơn hàng' : 'Đang xử lý'
    );

    history.push({
      status,
      timestamp: nowIso,
      note,
    });

    const updatePayload: Record<string, any> = {
      status,
      status_history: history,
      current_location: note,
      updated_at: nowIso,
    };

    let { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error && (error.message?.includes('status_history') || error.message?.includes('current_location'))) {
      delete updatePayload.status_history;
      delete updatePayload.current_location;
      const retry = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);
      error = retry.error;
    }

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
      .select('created_at, status_history, status')
      .eq('id', orderId)
      .maybeSingle();

    const currentStatus = currentOrder?.status || 'shipped';

    let history: StatusHistoryEntry[] = Array.isArray(currentOrder?.status_history)
      ? [...currentOrder.status_history]
      : [];

    history.push({
      status: currentStatus,
      timestamp: nowIso,
      note: locationNote,
    });

    const updatePayload: Record<string, any> = {
      status_history: history,
      current_location: locationNote,
      updated_at: nowIso,
    };

    let { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error && (error.message?.includes('status_history') || error.message?.includes('current_location'))) {
      delete updatePayload.status_history;
      delete updatePayload.current_location;
      const retry = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);
      error = retry.error;
    }

    if (error) {
      console.error('Error updating order location:', error);
      return false;
    }
    return true;
  },

  deleteOrder: async (orderId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }
    return true;
  },

  getOrderByCodeAndPhone: async (orderCode: string, phone: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_code', orderCode)
        .maybeSingle();

      if (!error && data) {
        const order = parseOrder(data);
        const cleanPhoneInput = phone.replace(/[^0-9]/g, '');
        const cleanOrderPhone = order.customer.phone.replace(/[^0-9]/g, '');
        if (cleanPhoneInput === cleanOrderPhone) {
          return order;
        }
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to localStorage:', e);
    }

    const localOrders = orderStorage.getOrders();
    const cleanPhoneInput = phone.replace(/[^0-9]/g, '');
    const foundLocal = localOrders.find(
      (o) => o.orderCode.toLowerCase() === orderCode.toLowerCase()
    );
    if (foundLocal) {
      const cleanLocalPhone = foundLocal.customer.phone.replace(/[^0-9]/g, '');
      if (cleanLocalPhone === cleanPhoneInput) {
        return foundLocal;
      }
    }

    return null;
  }
};

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

const parseOrder = (data: OrderRow): Order => {
  const createdAtDate = new Date(data.created_at);
  const updatedAtDate = new Date(data.updated_at);

  let statusHistory: StatusHistoryEntry[] = Array.isArray(data.status_history)
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
