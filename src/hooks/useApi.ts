import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<ApiResponse<T> | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<ApiResponse<T> | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);
        
        if (response.success && response.data) {
          setState(prev => ({
            ...prev,
            data: response.data,
            loading: false,
            error: null,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: response.error || 'Erro desconhecido',
          }));
        }
        
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook específico para autenticação
export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    
    if (response.success && response.data) {
      const accessToken = response.data.session.access_token;
      setToken(accessToken);
      apiClient.setAccessToken(accessToken);
      
      // Salvar token no localStorage (opcional)
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', accessToken);
      }
      
      return response;
    }
    
    return response;
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await apiClient.logout();
      setToken(null);
      apiClient.setAccessToken('');
      
      // Remover token do localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    }
  }, [token]);

  const initializeAuth = useCallback(() => {
    // Recuperar token do localStorage ao inicializar
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('access_token');
      if (savedToken) {
        setToken(savedToken);
        apiClient.setAccessToken(savedToken);
      }
    }
  }, []);

  return {
    token,
    login,
    logout,
    initializeAuth,
    isAuthenticated: !!token,
  };
}

// Hook para gerenciar todos
export function useTodos() {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getTodos({ page, limit });
      
      if (response.success && response.data) {
        setTodos(response.data.data);
        return response.data;
      } else {
        setError(response.error || 'Erro ao carregar tarefas');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (task: string, description?: string) => {
    try {
      const response = await apiClient.createTodo({ task, description });
      
      if (response.success && response.data) {
        setTodos(prev => [response.data, ...prev]);
        return response;
      } else {
        setError(response.error || 'Erro ao criar tarefa');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateTodo = useCallback(async (id: number, updates: any) => {
    try {
      const response = await apiClient.updateTodo(id, updates);
      
      if (response.success && response.data) {
        setTodos(prev => 
          prev.map(todo => 
            todo.id === id ? { ...todo, ...response.data } : todo
          )
        );
        return response;
      } else {
        setError(response.error || 'Erro ao atualizar tarefa');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      const response = await apiClient.deleteTodo(id);
      
      if (response.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        return response;
      } else {
        setError(response.error || 'Erro ao deletar tarefa');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    }
  }, []);

  const toggleComplete = useCallback(async (id: number, currentStatus: boolean) => {
    return updateTodo(id, { is_complete: !currentStatus });
  }, [updateTodo]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };
}
