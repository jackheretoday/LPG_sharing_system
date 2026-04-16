import { API_BASE_URL } from '@/lib/apiBase';

export interface ResourceItem {
  id?: string;
  title: string;
  description: string;
  location: string;
  resource_type: string;
  price: number;
}

export const resourceApi = {
  addResource: async (data: ResourceItem, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/resources/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  listResources: async () => {
    const response = await fetch(`${API_BASE_URL}/api/resources/list`);
    return response.json();
  },

  requestResource: async (resourceId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/resources/request/${resourceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  myRequests: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/resources/my-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },
};
