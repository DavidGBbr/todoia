export interface N8NChatMessage {
  type: "human" | "ai";
  content: string;
  additional_kwargs: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
  tool_calls?: unknown[];
  invalid_tool_calls?: unknown[];
}

export interface N8NChatHistory {
  id: number;
  session_id: string;
  message: N8NChatMessage;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}
