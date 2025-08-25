"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OpenAI from "openai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não está configurada nas variáveis de ambiente"
    );
  }
  return new OpenAI({ apiKey });
};

export const processChatMessage = async (
  message: string,
  conversationHistory: ChatMessage[]
): Promise<ChatResponse> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
      return { message: "", success: false, error: "Usuário não autenticado" };
    }

    const openai = getOpenAIClient();

    const systemPrompt = `Você é o assistente virtual do Todo-IA, uma aplicação de gerenciamento de tarefas inteligente.

Sua função é ajudar usuários a:
1. Entender como usar a aplicação Todo-IA
2. Criar e gerenciar tarefas de forma eficiente
3. Aproveitar ao máximo as funcionalidades de IA
4. Resolver dúvidas sobre o sistema

Contexto da aplicação:
- É uma aplicação web com Next.js 15 e Supabase
- Possui dashboard para gerenciar tarefas (CRUD completo)
- Tem funcionalidade de IA para melhorar descrições automaticamente
- Usa OpenAI GPT-4o-mini para enriquecimento de tarefas
- Interface responsiva com Tailwind CSS 4
- Sistema de autenticação seguro

Instruções importantes:
- Seja amigável e prestativo
- Responda em português brasileiro
- Dê exemplos práticos quando possível
- Se perguntarem sobre funcionalidades específicas, explique detalhadamente
- Se não souber algo, seja honesto e sugira onde encontrar a informação
- Mantenha as respostas concisas mas informativas
- Use emojis ocasionalmente para tornar a conversa mais amigável

Histórico da conversa: ${conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n")}

Mensagem atual do usuário: ${message}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content?.trim();

    if (!assistantMessage) {
      return {
        message:
          "Desculpe, não consegui processar sua mensagem. Tente novamente.",
        success: false,
        error: "Resposta vazia da IA",
      };
    }

    return {
      message: assistantMessage,
      success: true,
    };
  } catch (error) {
    console.error("Erro ao processar mensagem do chat:", error);

    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
      return {
        message:
          "Desculpe, a funcionalidade de IA não está disponível no momento. Você pode me fazer perguntas sobre como usar o Todo-IA e eu tentarei ajudar com as informações que tenho!",
        success: false,
        error: "IA não configurada",
      };
    }

    return {
      message:
        "Ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.",
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

export const getFallbackResponse = async (message: string): string => {
  const lowerMessage = message.toLowerCase();

  // Respostas baseadas em palavras-chave quando IA não está disponível
  if (lowerMessage.includes("tarefa") || lowerMessage.includes("todo")) {
    return "Para criar uma nova tarefa, vá para o dashboard e use o formulário de criação. Você pode adicionar um título e descrição, e até usar o botão '🤖 Melhorar com IA' para enriquecer automaticamente a descrição!";
  }

  if (lowerMessage.includes("dashboard") || lowerMessage.includes("painel")) {
    return "O dashboard está disponível em /dashboard. Lá você pode ver todas suas tarefas, filtrar por status (pendentes/concluídas), editar e deletar tarefas.";
  }

  if (
    lowerMessage.includes("ia") ||
    lowerMessage.includes("inteligência artificial")
  ) {
    return "Nossa IA usa OpenAI GPT-4o-mini para melhorar automaticamente as descrições das suas tarefas. Basta clicar no botão '🤖 Melhorar com IA' ao criar ou editar uma tarefa!";
  }

  if (lowerMessage.includes("ajuda") || lowerMessage.includes("help")) {
    return "Posso te ajudar com:\n• Como criar e gerenciar tarefas\n• Como usar a funcionalidade de IA\n• Navegação pelo dashboard\n• Funcionalidades da aplicação\n\nO que você gostaria de saber?";
  }

  if (
    lowerMessage.includes("olá") ||
    lowerMessage.includes("oi") ||
    lowerMessage.includes("hello")
  ) {
    return "Olá! 😊 Como posso te ajudar hoje? Você pode me perguntar sobre como usar o Todo-IA, criar tarefas, ou qualquer outra dúvida sobre a aplicação.";
  }

  if (
    lowerMessage.includes("obrigado") ||
    lowerMessage.includes("valeu") ||
    lowerMessage.includes("thanks")
  ) {
    return "De nada! 😊 Fico feliz em ter ajudado. Se precisar de mais alguma coisa, é só perguntar!";
  }

  return "Interessante! 🤔 Para te ajudar melhor, você pode me perguntar sobre:\n• Como criar tarefas\n• Como usar a IA\n• Funcionalidades do dashboard\n• Ou qualquer outra dúvida sobre o Todo-IA!";
};
