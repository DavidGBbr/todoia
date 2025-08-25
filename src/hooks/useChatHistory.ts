import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { loadChatHistory, clearChatHistory } from "@/utils/chat-history";
import { sendMessageToN8N } from "@/services/n8n-chat";
import { ChatMessage } from "@/types/chat";

interface UseChatHistoryReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  reloadHistory: () => Promise<void>;
}

export function useChatHistory(): UseChatHistoryReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const supabase = createClient();

  const loadHistory = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setIsLoading(false);
        return;
      }

      setUser(user);

      const history = await loadChatHistory(user.id);
      setMessages(history);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || isSending) return;

    setIsSending(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const n8nResult = await sendMessageToN8N(content);

      if (n8nResult.success && n8nResult.response) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: n8nResult.response,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);

        setTimeout(async () => {
          try {
            const updatedHistory = await loadChatHistory(user.id);
            if (updatedHistory.length > messages.length + 2) {
              setMessages(updatedHistory);
            }
          } catch (error) {
            console.log("Sincronização silenciosa falhou:", error);
          }
        }, 2000);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Desculpe, ocorreu um erro: ${
            n8nResult.error || "Erro desconhecido"
          }`,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      await clearChatHistory(user.id);
      setMessages([]);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  };

  const reloadHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const history = await loadChatHistory(user.id);
      setMessages(history);
    } catch (error) {
      console.error("Erro ao recarregar histórico:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    clearHistory,
    reloadHistory,
  };
}
