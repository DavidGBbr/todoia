"use client";

import React, { useState, useEffect } from "react";
import {
  createTodo,
  improveTaskDescription,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  getTodos,
} from "./action";

interface Todo {
  id: number;
  task: string;
  description?: string;
  is_complete: boolean;
  inserted_at: string;
  user_id: string;
}

const DashboardPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [isCreating, setIsCreating] = useState(false);

  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isImprovingNew, setIsImprovingNew] = useState(false);

  const [isImprovingEdit, setIsImprovingEdit] = useState(false);
  const [expandedTodos, setExpandedTodos] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const getFilterMessage = (filterType: "completed" | "pending") => {
    return `Nenhuma tarefa ${
      filterType === "completed" ? "concluída" : "pendente"
    } encontrada.`;
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
      alert("Digite um título para a tarefa primeiro");
      return;
    }

    setIsImprovingNew(true);
    try {
      const result = await improveTaskDescription(newTask, newDescription);
      if (result.success) {
        setNewDescription(result.description);
      } else {
        alert(
          "Erro ao melhorar descrição: " + (result.error || "Erro desconhecido")
        );
      }
    } catch (error) {
      console.error("Erro ao melhorar descrição:", error);
      alert("Erro ao melhorar descrição");
    }
    setIsImprovingNew(false);
  };

  const handleImproveEdit = async () => {
    if (!editingTodo?.task.trim()) {
      return;
    }

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
          "Erro ao melhorar descrição: " + (result.error || "Erro desconhecido")
        );
      }
    } catch (error) {
      console.error("Erro ao melhorar descrição:", error);
      alert("Erro ao melhorar descrição");
    }
    setIsImprovingEdit(false);
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
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              <span>+</span>
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showAddForm && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Adicionar Nova Tarefa
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Título da tarefa..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Descrição (opcional)
                  </span>
                  <button
                    type="button"
                    onClick={handleImproveNewTask}
                    disabled={!newTask.trim() || isImprovingNew}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span>🤖</span>
                    <span>
                      {isImprovingNew ? "Melhorando..." : "Melhorar com IA"}
                    </span>
                  </button>
                </div>
                <textarea
                  name="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Digite uma descrição ou use o botão 'Melhorar com IA'..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isCreating || !newTask.trim()}
                  className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-200 font-medium disabled:opacity-50"
                >
                  {isCreating ? "Adicionando..." : "Adicionar Tarefa"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTask("");
                    setNewDescription("");
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-center space-x-1 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "To Do" },
            { key: "completed", label: "Done" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as "all" | "completed" | "pending")}
              className={`px-4 py-2 rounded-lg font-medium transition duration-200 text-sm ${
                filter === key
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-500 text-sm">
                {filter === "all"
                  ? "Comece adicionando sua primeira tarefa!"
                  : getFilterMessage(filter)}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {editingTodo?.id === todo.id ? (
                  <div className="p-4 space-y-4">
                    <input
                      type="text"
                      value={editingTodo.task}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          task: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Descrição
                        </span>
                        <button
                          type="button"
                          onClick={handleImproveEdit}
                          disabled={!editingTodo.task.trim() || isImprovingEdit}
                          className="flex items-center space-x-1 px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <span>🤖</span>
                          <span>
                            {isImprovingEdit
                              ? "Melhorando..."
                              : "Melhorar com IA"}
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
                        placeholder="Digite uma descrição ou use o botão 'Melhorar com IA'..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingTodo(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() =>
                            handleToggleCompleted(todo.id, todo.is_complete)
                          }
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition duration-200 ${
                            todo.is_complete
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-red-500"
                          }`}
                        >
                          {todo.is_complete && (
                            <svg
                              className="w-3 h-3"
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
                            className={`text-lg font-medium ${
                              todo.is_complete
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {todo.task}
                          </h3>

                          {todo.description && (
                            <div className="mt-2">
                              <p
                                className={`text-sm leading-relaxed ${
                                  todo.is_complete
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {expandedTodos.has(todo.id)
                                  ? todo.description
                                  : truncateText(todo.description, 150)}
                              </p>

                              {todo.description.length > 150 && (
                                <button
                                  onClick={() => toggleExpanded(todo.id)}
                                  className="mt-1 text-red-500 hover:text-red-600 text-sm font-medium"
                                >
                                  {expandedTodos.has(todo.id)
                                    ? "Ver menos"
                                    : "Ver mais"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-1 ml-4">
                        <button
                          onClick={() => setEditingTodo(todo)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
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
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                          title="Deletar"
                        >
                          <svg
                            className="w-4 h-4"
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

        {todos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estatísticas
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {todos.length}
                </div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {todos.filter((t) => !t.is_complete).length}
                </div>
                <div className="text-sm text-yellow-700">Pendentes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {todos.filter((t) => t.is_complete).length}
                </div>
                <div className="text-sm text-green-700">Concluídas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
