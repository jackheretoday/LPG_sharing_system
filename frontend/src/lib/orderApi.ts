import { API_BASE_URL } from '@/lib/apiBase';

export interface CreateOrderData {
  seller_name: string;
  fill_level: string;
  price: string;
  buyer_id: string;
}

export const orderApi = {
  createOrder: async (orderData: CreateOrderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  },

  getUserOrders: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  }
};
