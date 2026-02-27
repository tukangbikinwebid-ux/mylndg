import { getCookie } from "@/composables/utils";

const API_BASE = "https://cms.mysolutionlending.com/api";

interface Conversation {
  id: number;
  brand_id: number;
  anggota_id: number;
  subject: string | null;
  status: "open" | "closed";
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  latest_message?: ChatMessage | null;
}

interface ChatMessage {
  id: number;
  chat_conversation_id: number;
  user_id: number;
  sender_type: "customer" | "admin";
  body: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  attachments: string[];
  sender?: {
    id: number;
    name: string;
  };
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = getCookie("token");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

export const useChat = () => {
  // Create or get open conversation
  const createConversation = async (
    subject?: string
  ): Promise<ApiResponse<Conversation>> => {
    const response = await fetch(`${API_BASE}/v1/chat/conversations`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  // Get messages in a conversation
  const getMessages = async (
    conversationId: number,
    page = 1,
    paginate = 20
  ): Promise<ApiResponse<PaginatedData<ChatMessage>>> => {
    const params = new URLSearchParams({
      page: String(page),
      paginate: String(paginate),
    });

    const response = await fetch(
      `${API_BASE}/v1/chat/conversations/${conversationId}/messages?${params}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  // Send text message
  const sendTextMessage = async (
    conversationId: number,
    body: string
  ): Promise<ApiResponse<ChatMessage>> => {
    const response = await fetch(
      `${API_BASE}/v1/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  // Send message with image (and optional text)
  const sendImageMessage = async (
    conversationId: number,
    image: File,
    body?: string
  ): Promise<ApiResponse<ChatMessage>> => {
    const formData = new FormData();
    formData.append("image", image);
    if (body) formData.append("body", body);

    const token = getCookie("token");
    const response = await fetch(
      `${API_BASE}/v1/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  // Get unread count
  const getUnreadCount = async (): Promise<
    ApiResponse<{ unread_count: number }>
  > => {
    const response = await fetch(`${API_BASE}/v1/chat/unread-count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  };

  return {
    createConversation,
    getMessages,
    sendTextMessage,
    sendImageMessage,
    getUnreadCount,
  };
};
