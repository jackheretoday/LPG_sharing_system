import { API_ROOT } from "@/lib/apiBase";
import { getToken } from "@/lib/trustAuth";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const parse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
  }
  return data;
};

export const emergencyApi = {
  listRequests: async () =>
    parse(await fetch(`${API_ROOT}/emergency/requests`, { headers: authHeaders() })),
  createRequest: async (payload: unknown) =>
    parse(
      await fetch(`${API_ROOT}/emergency/requests`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
    ),
  getRequest: async (id: string) =>
    parse(await fetch(`${API_ROOT}/emergency/requests/${id}`, { headers: authHeaders() })),
};
