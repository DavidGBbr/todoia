"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  createTodo,
  improveTaskDescription,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  getTodos,
} from "./action";

const MarkdownDescription = ({
  content,
  isCompleted,
  isExpanded,
  maxLength = 150,
}: {
  content: string;
  isCompleted: boolean;
  isExpanded: boolean;
  maxLength?: number;
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const displayContent = isExpanded
    ? content
    : truncateText(content, maxLength);

  return (
    <div
      className={`max-w-none text-sm leading-relaxed markdown-content ${
        isCompleted ? "text-gray-400" : "text-gray-600"
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayContent}
      </ReactMarkdown>
    </div>
  );
};

interface Todo {
  id: number;
  task: string;
  description?: string;
  is_complete: boolean;
  inserted_at: string;
  user_id: string;
}

const DashboardPage = () => {
  const { t } = useLanguage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [isCreating, setIsCreating] = useState(false);

  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isImprovingNew, setIsImprovingNew] = useState(false);
  const [newTaskAbortController, setNewTaskAbortController] =
    useState<AbortController | null>(null);

  const [isImprovingEdit, setIsImprovingEdit] = useState(false);
  const [editAbortController, setEditAbortController] =
    useState<AbortController | null>(null);
  const [expandedTodos, setExpandedTodos] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const getFilterMessage = (filterType: "completed" | "pending") => {
    return filterType === "completed"
      ? t("dashboard.no_tasks_completed")
      : t("dashboard.no_tasks_pending");
  };

  const toggleExpanded = (todoId: number) => {
    const newExpanded = new Set(expandedTodos);
    if (newExpanded.has(todoId)) {
      newExpanded.delete(todoId);
    } else {
      newExpanded.add(todoId);
    }
    setExpandedTodos(newExpanded);
  };

  const fetchTodos = async () => {
    setLoading(true);
    const result = await getTodos();
    if (result?.data) {
      setTodos(result.data);
    }
    setLoading(false);
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await createTodo(formData);

    if (result?.success) {
      await fetchTodos();
      (e.target as HTMLFormElement).reset();
      setNewTask("");
      setNewDescription("");
      setShowAddForm(false);
    } else if (result?.error) {
      alert(result.error);
    }

    setIsCreating(false);
  };

  const handleImproveNewTask = async () => {
    if (!newTask.trim()) {
      alert(t("dashboard.error_title_required"));
      return;
    }

    // Cancela requisição anterior se existir
    if (newTaskAbortController) {
      newTaskAbortController.abort();
    }

    const abortController = new AbortController();
    setNewTaskAbortController(abortController);
    setIsImprovingNew(true);

    try {
      const result = await improveTaskDescription(newTask, newDescription);
      if (result.success) {
        setNewDescription(result.description);
      } else {
        alert(
          t("dashboard.error_improve") +
            (result.error || t("dashboard.error_unknown"))
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error improving description:", error);
        alert(t("dashboard.error_improve"));
      }
    } finally {
      setIsImprovingNew(false);
      setNewTaskAbortController(null);
    }
  };

  const cancelNewTaskImprovement = () => {
    if (newTaskAbortController) {
      newTaskAbortController.abort();
      setNewTaskAbortController(null);
      setIsImprovingNew(false);
    }
  };

  const handleImproveEdit = async () => {
    if (!editingTodo?.task.trim()) {
      return;
    }

    // Cancela requisição anterior se existir
    if (editAbortController) {
      editAbortController.abort();
    }

    const abortController = new AbortController();
    setEditAbortController(abortController);
    setIsImprovingEdit(true);

    try {
      const result = await improveTaskDescription(
        editingTodo.task,
        editingTodo.description
      );
      if (result.success) {
        setEditingTodo({
          ...editingTodo,
          description: result.description,
        });
      } else {
        alert(
          t("dashboard.error_improve") +
            (result.error || t("dashboard.error_unknown"))
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error improving description:", error);
        alert(t("dashboard.error_improve"));
      }
    } finally {
      setIsImprovingEdit(false);
      setEditAbortController(null);
    }
  };

  const cancelEditImprovement = () => {
    if (editAbortController) {
      editAbortController.abort();
      setEditAbortController(null);
      setIsImprovingEdit(false);
    }
  };

  const handleUpdateTodo = async (
    id: number,
    updates: { task?: string; description?: string; is_complete?: boolean }
  ) => {
    const result = await updateTodo(id, updates);
    if (result?.success) {
      await fetchTodos();
    } else if (result?.error) {
      alert(result.error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm(t("dashboard.confirm_delete"))) {
      const result = await deleteTodo(id);
      if (result?.success) {
        await fetchTodos();
      } else if (result?.error) {
        alert(result.error);
      }
    }
  };

  const handleToggleCompleted = async (id: number, currentStatus: boolean) => {
    const result = await toggleTodoComplete(id, currentStatus);
    if (result?.success) {
      await fetchTodos();
    } else if (result?.error) {
      alert(result.error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTodo) return;

    await handleUpdateTodo(editingTodo.id, {
      task: editingTodo.task,
      description: editingTodo.description,
    });

    setEditingTodo(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.is_complete;
    if (filter === "pending") return !todo.is_complete;
    return true;
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">📋</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Todo-IA
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t("dashboard.title")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <LanguageToggle />

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-sm sm:text-base"
              >
                <span className="text-lg">+</span>
                <span className="font-semibold hidden sm:inline">
                  {t("dashboard.add_task")}
                </span>
                <span className="font-semibold sm:hidden">Add</span>
              </button>

              <Link
                href="/chat"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm sm:text-base"
              >
                <span>🤖</span>
                <span className="hidden sm:inline">{t("dashboard.chat")}</span>
              </Link>

              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm sm:text-base"
              >
                <span className="sm:hidden">🏠</span>
                <span className="hidden sm:inline">🏠 Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Formulário de Nova Tarefa */}
        {showAddForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {t("dashboard.add_new_task")}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl sm:text-2xl hover:scale-110 transition duration-200 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateTodo}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <label
                  htmlFor="new-task-title"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  {t("dashboard.task_title")}
                </label>
                <input
                  type="text"
                  name="task"
                  id="new-task-title"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder={t("dashboard.task_title_placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label
                    htmlFor="new-task-description"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {t("dashboard.task_description")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={
                        isImprovingNew
                          ? cancelNewTaskImprovement
                          : handleImproveNewTask
                      }
                      disabled={!newTask.trim()}
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
                        isImprovingNew
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span>{isImprovingNew ? "❌" : "🤖"}</span>
                      <span>
                        {isImprovingNew
                          ? t("dashboard.cancel")
                          : t("dashboard.improve_ai")}
                      </span>
                    </button>
                  </div>
                </div>
                <textarea
                  name="description"
                  id="new-task-description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={t("dashboard.task_description_placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 resize-none transition duration-200"
                  rows={4}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  disabled={isCreating || !newTask.trim() || isImprovingNew}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition duration-200 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isCreating ? t("dashboard.saving") : t("dashboard.add_task")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTask("");
                    setNewDescription("");
                    cancelNewTaskImprovement();
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
          {[
            { key: "all", label: t("dashboard.all_tasks"), icon: "📋" },
            { key: "pending", label: t("dashboard.pending"), icon: "⏳" },
            { key: "completed", label: t("dashboard.completed"), icon: "✅" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as "all" | "completed" | "pending")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-200 text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 cursor-pointer ${
                filter === key
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t("dashboard.no_tasks")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {filter === "all"
                  ? t("dashboard.no_tasks_subtitle")
                  : getFilterMessage(filter)}
              </p>
              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  {t("dashboard.all_tasks")}
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {editingTodo?.id === todo.id ? (
                  <div className="p-4 sm:p-6 space-y-4">
                    <input
                      type="text"
                      value={editingTodo.task}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          task: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition duration-200"
                    />

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t("dashboard.task_description")}
                        </label>
                        <button
                          type="button"
                          onClick={
                            isImprovingEdit
                              ? cancelEditImprovement
                              : handleImproveEdit
                          }
                          disabled={!editingTodo.task.trim()}
                          className={`flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
                            isImprovingEdit
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <span>{isImprovingEdit ? "❌" : "🤖"}</span>
                          <span>
                            {isImprovingEdit
                              ? t("dashboard.improving")
                              : t("dashboard.improve_ai")}
                          </span>
                        </button>
                      </div>
                      <textarea
                        value={editingTodo.description || ""}
                        onChange={(e) =>
                          setEditingTodo({
                            ...editingTodo,
                            description: e.target.value,
                          })
                        }
                        placeholder={t(
                          "dashboard.task_description_edit_placeholder"
                        )}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 resize-none transition duration-200"
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isImprovingEdit}
                        className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition duration-200 text-sm font-semibold shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingTodo(null);
                          cancelEditImprovement();
                        }}
                        className="px-4 sm:px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition duration-200 text-sm font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <button
                          onClick={() =>
                            handleToggleCompleted(todo.id, todo.is_complete)
                          }
                          className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition duration-200 cursor-pointer flex-shrink-0 ${
                            todo.is_complete
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                          }`}
                        >
                          {todo.is_complete && (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-base sm:text-lg font-semibold break-words ${
                              todo.is_complete
                                ? "text-gray-500 line-through"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {todo.task}
                          </h3>

                          {todo.description && (
                            <div className="mt-3">
                              <MarkdownDescription
                                content={todo.description}
                                isCompleted={todo.is_complete}
                                isExpanded={expandedTodos.has(todo.id)}
                                maxLength={150}
                              />

                              {todo.description.length > 150 && (
                                <button
                                  onClick={() => toggleExpanded(todo.id)}
                                  className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
                                >
                                  {expandedTodos.has(todo.id)
                                    ? t("dashboard.see_less")
                                    : t("dashboard.see_more")}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 ml-3 sm:ml-4 flex-shrink-0">
                        <button
                          onClick={() => setEditingTodo(todo)}
                          className="p-2 sm:p-3 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition duration-200 cursor-pointer"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-2 sm:p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition duration-200 cursor-pointer"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Estatísticas */}
        {todos.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-4 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              📊 Tasks Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {todos.length}
                </div>
                <div className="text-blue-700 dark:text-blue-300 font-medium text-sm sm:text-base">
                  Total
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {todos.filter((t) => !t.is_complete).length}
                </div>
                <div className="text-yellow-700 dark:text-yellow-300 font-medium text-sm sm:text-base">
                  Pending
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {todos.filter((t) => t.is_complete).length}
                </div>
                <div className="text-green-700 dark:text-green-300 font-medium text-sm sm:text-base">
                  Concluded
                </div>
              </div>
            </div>

            {todos.length > 0 && (
              <div className="mt-4 sm:mt-6 text-center">
                <div className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Progress:{" "}
                    {Math.round(
                      (todos.filter((t) => t.is_complete).length /
                        todos.length) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botão WhatsApp Flutuante */}
      <WhatsAppButton />
    </div>
  );
};

export default DashboardPage;
