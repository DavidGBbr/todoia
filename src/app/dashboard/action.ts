"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
