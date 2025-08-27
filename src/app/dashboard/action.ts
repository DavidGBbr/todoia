"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

interface ImproveDescriptionResult {
  description: string;
  success: boolean;
  error?: string;
}

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured in environment variables"
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
    return { error: "Task title is required" };
  }

  const { error } = await supabase.from("todos").insert({
    task: data.task.trim(),
    description: data.description?.trim() || "",
    is_complete: false,
    user_id: session.user.id,
  });

  if (error) {
    console.error("Error creating todo:", error);
    return { error: "Error creating task" };
  }

  revalidatePath("/dashboard");
  return { success: true };
};

export const improveTaskDescription = async (
  task: string,
  currentDescription?: string
): Promise<ImproveDescriptionResult> => {
  try {
    const openai = getOpenAIClient();

    const prompt = currentDescription
      ? `Current description: "${currentDescription}"
         
         Improve and add more detail to this description, keeping the focus on content without repeating the task title.`
      : `Create a detailed and useful description for the mentioned activity. Don't repeat the title, just elaborate on how to execute it, necessary steps and relevant tips.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant specialized in organization and productivity. 
          When you receive information about a task, you should:
          1. Create or improve the description focusing ONLY on content and execution
          2. DO NOT repeat or mention the task title in the description
          3. Suggest subtasks or specific steps to complete it
          4. Give practical tips and relevant details
          5. Maintain a professional but accessible tone
          
          IMPORTANT: Go straight to the point about HOW to do it, not WHAT the task is about.
          Respond in English, be concise but informative (maximum 300 words).
          Use markdown to format the response clearly and organized.`,
        },
        {
          role: "user",
          content: `Task: "${task}"\n\n${prompt}`,
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
        error: "Empty response from AI",
      };
    }

    return {
      description: improvedDescription,
      success: true,
    };
  } catch (error) {
    console.error("Error improving description with AI:", error);
    return {
      description: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
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
    return { error: "Error updating task" };
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
    return { error: "Error deleting task" };
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
    return { error: "Error updating task status" };
  }

  revalidatePath("/dashboard");

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
    return { error: "Error loading tasks" };
  }

  return { data };
};
