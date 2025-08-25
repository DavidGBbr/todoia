"use client";

import React, { useState, useEffect } from "react";
import { getChatStats } from "@/utils/chat-history";
import { createClient } from "@/utils/supabase/client";

interface ChatStatsProps {
  readonly sessionId?: string;
}

interface Stats {
  totalMessages: number;
  userMessages: number;
  aiMessages: number;
}

export default function ChatStats({ sessionId }: ChatStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    userMessages: 0,
    aiMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadStats = async () => {
      try {
        let userId = sessionId;

        if (!userId) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error || !user) return;
          userId = user.id;
        }

        if (userId) {
          const chatStats = await getChatStats(userId);
          setStats(chatStats);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [sessionId, supabase]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        📊 Estatísticas do Chat
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {stats.totalMessages}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total de mensagens
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {stats.userMessages}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Suas mensagens
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">
            {stats.aiMessages}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Respostas da IA
          </div>
        </div>
      </div>

      {stats.totalMessages > 0 && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Histórico sincronizado com N8N
        </div>
      )}
    </div>
  );
}
