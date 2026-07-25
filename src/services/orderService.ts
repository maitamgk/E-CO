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
      notes: order.notes,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
    };

    let { error } = await supabase.from('orders').insert(orderData);

    // Fallback if status_history column doesn't exist yet on DB
    if (error && error.message?.includes('status_history')) {
      delete orderData.status_history;
      const retry = await supabase.from('orders').insert(orderData);
      error = retry.error;
    }

    if (error) {
      console.error('Error adding order:', error);
      return false;
    }
    return true;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<boolean> => {
    const nowIso = new Date().toISOString();

    // 1. Fetch current order to get existing status_history
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('created_at, status_history, status')
      .eq('id', orderId)
      .maybeSingle();

    let history: StatusHistoryEntry[] = Array.isArray(currentOrder?.status_history)
      ? [...currentOrder.status_history]
      : [];

    if (history.length === 0) {
      history.push({
        status: currentOrder?.status || 'pending',
        timestamp: currentOrder?.created_at || nowIso,
      });
    }

    // Add new status entry if not last
    if (history[history.length - 1]?.status !== status) {
      history.push({
        status,
        timestamp: nowIso,
      });
    }

    // Update DB
    const updatePayload: Record<string, any> = {
      status,
      status_history: history,
      updated_at: nowIso,
    };

    let { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    // Fallback if column missing
    if (error && error.message?.includes('status_history')) {
      delete updatePayload.status_history;
      const retry = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId);
      error = retry.error;
    }

    if (error) {
      console.error('Error updating order:', error);
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
    // 1. Try fetching from Supabase
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

    // 2. Fallback to localStorage mock/local database
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
  notes: string;
  created_at: string;
  updated_at: string;
}

// Helper to convert DB snake_case back to camelCase Order type
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
    notes: data.notes,
    createdAt: createdAtDate,
    updatedAt: updatedAtDate,
  };
};
