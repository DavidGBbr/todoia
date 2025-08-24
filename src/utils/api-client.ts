/**
 * Cliente JavaScript para consumir a API Todo IA
 * Baseado nas actions existentes, agora expostas como endpoints REST
 */

export interface Todo {
  id: number;
  task: string;
  description: string;
  is_complete: boolean;
  user_id: string;
  inserted_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse extends ApiResponse {
  user: User;
  session: Session;
}

export interface TodosResponse extends ApiResponse {
  data: Todo[];
}

export interface TodoResponse extends ApiResponse {
  data: Todo;
}

export interface ImproveDescriptionResponse extends ApiResponse {
  description: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;

    // Tentar recuperar token do localStorage se estiver no browser
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("todo_ia_token");
    }
  }

  /**
   * Definir token de autenticação
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("todo_ia_token", token);
    }
  }

  /**
   * Remover token de autenticação
   */
  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("todo_ia_token");
    }
  }

  /**
   * Fazer requisição HTTP com tratamento de erros
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return data;
  }

  // ===== AUTENTICAÇÃO =====

  /**
   * Fazer login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.session) {
      this.setToken(response.session.access_token);
    }

    return response;
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request<ApiResponse>("/auth/logout", {
        method: "POST",
      });

      this.clearToken();
      return response;
    } catch (error) {
      // Mesmo se der erro, limpar o token local
      this.clearToken();
      throw error;
    }
  }

  /**
   * Obter informações do usuário autenticado
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>("/auth/me");
  }

  // ===== TAREFAS =====

  /**
   * Listar todas as tarefas
   */
  async getTodos(): Promise<TodosResponse> {
    return this.request<TodosResponse>("/todos");
  }

  /**
   * Obter uma tarefa específica
   */
  async getTodo(id: number): Promise<TodoResponse> {
    return this.request<TodoResponse>(`/todos/${id}`);
  }

  /**
   * Criar nova tarefa
   */
  async createTodo(task: string, description?: string): Promise<TodoResponse> {
    return this.request<TodoResponse>("/todos", {
      method: "POST",
      body: JSON.stringify({ task, description }),
    });
  }

  /**
   * Atualizar tarefa
   */
  async updateTodo(
    id: number,
    updates: Partial<Pick<Todo, "task" | "description" | "is_complete">>
  ): Promise<TodoResponse> {
    return this.request<TodoResponse>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Deletar tarefa
   */
  async deleteTodo(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/todos/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Alternar status de conclusão
   */
  async toggleTodoComplete(id: number): Promise<TodoResponse> {
    return this.request<TodoResponse>(`/todos/${id}/toggle`, {
      method: "PATCH",
    });
  }

  // ===== INTELIGÊNCIA ARTIFICIAL =====

  /**
   * Melhorar descrição de tarefa com IA
   */
  async improveDescription(
    task: string,
    currentDescription?: string
  ): Promise<ImproveDescriptionResponse> {
    return this.request<ImproveDescriptionResponse>("/ai/improve-description", {
      method: "POST",
      body: JSON.stringify({ task, currentDescription }),
    });
  }

  // ===== UTILIDADES =====

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Obter token atual
   */
  getToken(): string | null {
    return this.token;
  }
}

// Exportar instância singleton
export const apiClient = new ApiClient();

// Exportar classe para uso em múltiplas instâncias se necessário
export { ApiClient };
