interface ApiResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export async function sendMessageToN8N(
  message: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      console.error(
        "Erro na resposta da API:",
        response.status,
        response.statusText
      );
      return {
        success: false,
        error: `Erro ${response.status}: ${response.statusText}`,
      };
    }

    const data: ApiResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Erro desconhecido",
      };
    }

    return {
      success: true,
      response: data.response,
    };
  } catch (error) {
    console.error("Erro ao comunicar com N8N:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro de conexão",
    };
  }
}

export async function testN8NConnection(): Promise<boolean> {
  try {
    const response = await fetch("/api/chat");
    const data = await response.json();
    return data.configured && response.ok;
  } catch (error) {
    console.error("Teste de conexão N8N falhou:", error);
    return false;
  }
}
