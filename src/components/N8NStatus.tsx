"use client";

import React, { useState, useEffect } from "react";
import { testN8NConnection } from "@/services/n8n-chat";

interface N8NStatusProps {
  readonly showDetails?: boolean;
}

export default function N8NStatus({ showDetails = false }: N8NStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        const connected = await testN8NConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error("Erro ao testar conexão N8N:", error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();

    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showDetails && isLoading) {
    return null;
  }

  const getStatusIcon = () => {
    if (isLoading) return "⏳";
    if (isConnected) return "🟢";
    return "🔴";
  };

  const getStatusText = () => {
    if (isLoading) return "Verificando...";
    if (isConnected) return "N8N Conectado";
    return "N8N Desconectado";
  };

  const getStatusColor = () => {
    if (isLoading) return "text-yellow-600 dark:text-yellow-400";
    if (isConnected) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  if (showDetails) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Status do N8N
            </h3>
            <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
          </div>
        </div>

        {!isConnected && !isLoading && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Verifique a configuração do webhook no arquivo .env
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-lg">{getStatusIcon()}</span>
      <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
    </div>
  );
}
