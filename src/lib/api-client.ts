import { 
  ApiResponse, 
  Todo, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  ImproveDescriptionRequest,
  ImproveDescriptionResponse,
  LoginRequest,
  AuthResponse,
  PaginationParams,
  PaginatedResponse
} from '@/types/api';

class ApiClient {
  private baseUrl: string;
  private accessToken?: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede desconhecido',
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    return this.request<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Todo endpoints
  async getTodos(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Todo>>> {
    const queryParams = params ? new URLSearchParams({
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '10',
    }).toString() : '';
    
    return this.request<PaginatedResponse<Todo>>(`/todos${queryParams ? `?${queryParams}` : ''}`);
  }

  async getTodo(id: number): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`);
  }

  async createTodo(todo: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  async updateTodo(id: number, updates: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTodo(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTodoComplete(id: number, currentStatus: boolean): Promise<ApiResponse<Todo>> {
    return this.updateTodo(id, { is_complete: !currentStatus });
  }

  // AI endpoints
  async improveDescription(request: ImproveDescriptionRequest): Promise<ApiResponse<ImproveDescriptionResponse>> {
    return this.request<ImproveDescriptionResponse>('/ai/improve-description', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };
