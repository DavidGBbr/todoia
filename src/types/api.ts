export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Todo {
  id: number;
  task: string;
  description: string;
  is_complete: boolean;
  user_id: string;
  inserted_at: string;
  updated_at?: string;
}

export interface CreateTodoRequest {
  task: string;
  description?: string;
}

export interface UpdateTodoRequest {
  task?: string;
  description?: string;
  is_complete?: boolean;
}

export interface ImproveDescriptionRequest {
  task: string;
  currentDescription?: string;
}

export interface ImproveDescriptionResponse {
  description: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
