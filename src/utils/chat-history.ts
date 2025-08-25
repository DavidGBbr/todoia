import { createClient } from "@/utils/supabase/client";
import { N8NChatHistory, N8NChatMessage, ChatMessage } from "@/types/chat";

export async function loadChatHistory(
  sessionId: string
): Promise<ChatMessage[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("n8n_chat_histories")
      .select("*")
      .eq("session_id", sessionId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao carregar histórico de chat:", error);
      return [];
    }

    const messages: ChatMessage[] = data.map((item: N8NChatHistory) => ({
      id: item.id.toString(),
      content: item.message.content,
      isUser: item.message.type === "human",
      timestamp: new Date(item.created_at || Date.now()),
    }));

    return messages;
  } catch (error) {
    console.error("Erro ao carregar histórico de chat:", error);
    return [];
  }
}

export async function saveChatMessage(
  sessionId: string,
  content: string,
  isUser: boolean
): Promise<boolean> {
  const supabase = createClient();

  try {
    const n8nMessage: N8NChatMessage = {
      type: isUser ? "human" : "ai",
      content: isUser ? `Mensagem do usuário: ${content}` : content,
      additional_kwargs: {},
      response_metadata: {},
      ...(isUser ? {} : { tool_calls: [], invalid_tool_calls: [] }),
    };

    const { error } = await supabase.from("n8n_chat_histories").insert({
      session_id: sessionId,
      message: n8nMessage,
    });

    if (error) {
      console.error("Erro ao salvar mensagem:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    return false;
  }
}

export async function clearChatHistory(sessionId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("n8n_chat_histories")
      .delete()
      .eq("session_id", sessionId);

    if (error) {
      console.error("Erro ao limpar histórico:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao limpar histórico:", error);
    return false;
  }
}

export async function getChatStats(sessionId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("n8n_chat_histories")
      .select("message")
      .eq("session_id", sessionId);

    if (error) {
      console.error("Erro ao obter estatísticas:", error);
      return { totalMessages: 0, userMessages: 0, aiMessages: 0 };
    }

    const userMessages = data.filter(
      (item) => item.message.type === "human"
    ).length;
    const aiMessages = data.filter((item) => item.message.type === "ai").length;

    return {
      totalMessages: data.length,
      userMessages,
      aiMessages,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return { totalMessages: 0, userMessages: 0, aiMessages: 0 };
  }
}
