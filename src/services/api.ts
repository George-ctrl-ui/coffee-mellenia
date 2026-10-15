import { Product, Order, CreateOrderDto, ContactMessageDto, OrderStatus } from '../types';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const api = {
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());

    const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Failed to fetch products', res.status);
    }
    return res.json();
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Product not found', res.status);
    }
    return res.json();
  },

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Failed to place order', res.status);
    }
    return res.json();
  },

  async getOrderByReference(reference: string): Promise<Order> {
    const res = await fetch(`/api/orders/${encodeURIComponent(reference.trim())}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Order reference not found', res.status);
    }
    return res.json();
  },

  async getAdminOrders(adminToken: string): Promise<Order[]> {
    const res = await fetch('/api/admin/orders', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Unauthorized', res.status);
    }
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus, adminToken: string): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Failed to update order status', res.status);
    }
    return res.json();
  },

  async simulateAdminOrder(adminToken: string): Promise<Order> {
    const res = await fetch('/api/admin/orders/simulate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Failed to simulate live order', res.status);
    }
    return res.json();
  },

  async submitContact(data: ContactMessageDto): Promise<{ success: boolean; message: string; id: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.message || 'Failed to send message', res.status);
    }
    return res.json();
  },
};
