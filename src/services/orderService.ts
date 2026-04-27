import { supabase } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types';

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
