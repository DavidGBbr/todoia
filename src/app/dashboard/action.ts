"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

// Tipos para o enriquecimento da IA
interface ImproveDescriptionResult {
  description: string;
  success: boolean;
  error?: string;
}

// Configuração do cliente OpenAI
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não está configurada nas variáveis de ambiente"
    );
  }
  return new OpenAI({ apiKey });
};

export const createTodo = async (formData: FormData) => {
  const supabase = await createClient();

  const { data: session, error: authError } = await supabase.auth.getUser();

  if (authError || !session.user) {
    redirect("/login");
    return;
  }

  const data = {
    task: formData.get("task") as string,
    description: formData.get("description") as string,
  };

  if (!data.task?.trim()) {
    return { error: "Título da tarefa é obrigatório" };
  }

  const { error } = await supabase.from("todos").insert({
    task: data.task.trim(),
    description: data.description?.trim() || "",
    is_complete: false,
    user_id: session.user.id,
  });

  if (error) {
    console.error("Error creating todo:", error);
    return { error: "Erro ao criar tarefa" };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

// Função para melhorar a descrição de uma tarefa com IA
export const improveTaskDescription = async (
  task: string,
  currentDescription?: string
): Promise<ImproveDescriptionResult> => {
  try {
    const openai = getOpenAIClient();

    const prompt = currentDescription
      ? `Melhore esta tarefa:
         Título: "${task}"
         Descrição atual: "${currentDescription}"
         
         Crie uma versão melhorada e mais detalhada da descrição.`
      : `Crie uma descrição detalhada para esta tarefa: "${task}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um assistente especializado em organização e produtividade. 
          Quando receber informações sobre uma tarefa, você deve:
          1. Criar ou melhorar a descrição de forma detalhada e útil
          2. Sugerir subtarefas ou passos específicos para completá-la
          3. Dar dicas práticas se relevante
          4. Manter um tom profissional mas acessível
          
          Responda em português brasileiro, seja conciso mas informativo (máximo 300 palavras).
          Formate a resposta de forma clara e organizada.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const improvedDescription = completion.choices[0]?.message?.content?.trim();

    if (!improvedDescription) {
      return {
        description: "",
        success: false,
        error: "Resposta vazia da IA",
      };
    }

    return {
      description: improvedDescription,
      success: true,
    };
  } catch (error) {
    console.error("Erro ao melhorar descrição com IA:", error);
    return {
      description: "",
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

export const updateTodo = async (
  id: number,
  updates: { task?: string; description?: string; is_complete?: boolean }
) => {
  const supabase = await createClient();

  const { data: session, error: authError } = await supabase.auth.getUser();

  if (authError || !session.user) {
    redirect("/login");
    return;
  }

  const { error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error updating todo:", error);
    return { error: "Erro ao atualizar tarefa" };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

export const deleteTodo = async (id: number) => {
  const supabase = await createClient();

  const { data: session, error: authError } = await supabase.auth.getUser();

  if (authError || !session.user) {
    redirect("/login");
    return;
  }

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error deleting todo:", error);
    return { error: "Erro ao deletar tarefa" };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

export const toggleTodoComplete = async (
  id: number,
  currentStatus: boolean
) => {
  const supabase = await createClient();

  const { data: session, error: authError } = await supabase.auth.getUser();

  if (authError || !session.user) {
    redirect("/login");
    return;
  }

  const { error } = await supabase
    .from("todos")
    .update({ is_complete: !currentStatus })
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error toggling todo:", error);
    return { error: "Erro ao atualizar status da tarefa" };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

export const getTodos = async () => {
  const supabase = await createClient();

  const { data: session, error: authError } = await supabase.auth.getUser();

  if (authError || !session.user) {
    redirect("/login");
    return;
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", session.user.id)
    .order("inserted_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error);
    return { error: "Erro ao carregar tarefas" };
  }

  return { data };
};
