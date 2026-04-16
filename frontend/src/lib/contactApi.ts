import { API_ROOT } from '@/lib/apiBase';

const parse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
  }
  return data;
};

export const contactApi = {
  submit: async (payload: { name: string; email: string; message: string; phone?: string }) =>
    parse(
      await fetch(`${API_ROOT}/contact/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    ),
};
