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

export const chatApi = {
  bootstrap: async () =>
    parse(await fetch(`${API_ROOT}/chat/bootstrap`, { headers: authHeaders() })),
  sendMessage: async (conversationId: string, payload: { body: string; messageType?: string; metadata?: unknown }) =>
    parse(
      await fetch(`${API_ROOT}/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      })
    ),
};
