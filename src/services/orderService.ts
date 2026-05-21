import { supabase } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types';
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
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      order_code: order.orderCode,
      user_id: order.userId,
      customer_info: order.customer,
      items: order.items,
      totals: order.totals,
      payment_method: order.paymentMethod,
      status: order.status,
      notes: order.notes,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
    });

    if (error) {
      console.error('Error adding order:', error);
      return false;
    }
    return true;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<boolean> => {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

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
  payment_method: 'COD';
  status: OrderStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

// Helper to convert DB snake_case back to camelCase Order type
const parseOrder = (data: OrderRow): Order => ({
  id: data.id,
  orderCode: data.order_code,
  userId: data.user_id,
  customer: data.customer_info,
  items: data.items,
  totals: data.totals,
  paymentMethod: data.payment_method,
  status: data.status,
  notes: data.notes,
  createdAt: new Date(data.created_at),
  updatedAt: new Date(data.updated_at),
});
