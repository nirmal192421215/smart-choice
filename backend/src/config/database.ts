import { supabaseAdmin } from './supabase';

if (!supabaseAdmin) {
  throw new Error('Supabase admin client not configured');
}

// Database functions for products
export const products = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async getByCategory(category: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category', category)
      .order('price');

    if (error) throw error;
    return data || [];
  },

  async create(data: any) {
    const { data: newProduct, error } = await supabaseAdmin
      .from('products')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newProduct;
  },

  async update(id: string, data: Partial<any>) {
    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedProduct;
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

// Database functions for categories
export const categories = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getByName(name: string) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('name', name)
      .single();

    if (error) throw error;
    return data;
  },
};

// Database functions for orders
export const orders = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        profiles:profiles!orders_user_id_fkey(*),
        order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        profiles:profiles!orders_user_id_fkey(*),
        order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(data: any) {
    const { data: newOrder, error } = await supabaseAdmin
      .from('orders')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newOrder;
  },

  async update(id: string, data: Partial<any>) {
    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedOrder;
  },

  async updateStatus(id: string, status: string, paymentStatus?: string) {
    const updateData: any = { status };
    if (paymentStatus) updateData.payment_status = paymentStatus;
    if (status === 'Confirmed' && !paymentStatus) {
      updateData.payment_status = 'authorized';
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Database functions for order items
export const orderItems = {
  async create(data: any) {
    const { data: newOrderItem, error } = await supabaseAdmin
      .from('order_items')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newOrderItem;
  },

  async createBulk(items: any[]) {
    const { data, error } = await supabaseAdmin
      .from('order_items')
      .insert(items)
      .select();

    if (error) throw error;
    return data || [];
  },

  async getByOrderId(orderId: string) {
    const { data, error } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw error;
    return data || [];
  },
};

// Database functions for payments
export const payments = {
  async create(data: any) {
    const { data: newPayment, error } = await supabaseAdmin
      .from('payments')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newPayment;
  },

  async update(id: string, data: Partial<any>) {
    const { data: updatedPayment, error } = await supabaseAdmin
      .from('payments')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedPayment;
  },

  async getByOrderId(orderId: string) {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Database functions for users (profiles)
export const profiles = {
  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  async create(data: any) {
    const { data: newProfile, error } = await supabaseAdmin
      .from('profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newProfile;
  },

  async update(id: string, data: Partial<any>) {
    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedProfile;
  },
};

// Database functions for coupons
export const coupons = {
  async validate(code: string) {
    const { data, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { valid: false, reason: 'Coupon not found or inactive' };
      }
      throw error;
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, reason: 'Coupon has expired' };
    }

    return { valid: true, coupon: data };
  },
};

// Database functions for customer enquiries
export const enquiries = {
  async create(data: any) {
    const { data: newEnquiry, error } = await supabaseAdmin
      .from('customer_enquiries')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newEnquiry;
  },

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('customer_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('customer_enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export default {
  products,
  categories,
  orders,
  orderItems,
  payments,
  profiles,
  coupons,
  enquiries,
};