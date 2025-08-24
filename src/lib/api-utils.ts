import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createApiResponse = <T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
};

export const createErrorResponse = (
  error: string | Error,
  statusCode: number = 400,
  code?: string
): NextResponse<ApiResponse<never>> => {
  const message = error instanceof Error ? error.message : error;
  
  return NextResponse.json(
    {
      success: false,
      error: message,
      code,
    },
    { status: statusCode }
  );
};

export const handleApiError = (error: unknown): NextResponse<ApiResponse<never>> => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.statusCode, error.code);
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }

  return createErrorResponse('Erro interno do servidor', 500);
};

export const validateRequest = async <T>(
  request: NextRequest,
  schema?: any
): Promise<T> => {
  try {
    const body = await request.json();
    
    if (schema) {
      // Aqui você pode adicionar validação com Zod, Yup, ou similar
      // Por enquanto, apenas retornamos o body
      return body;
    }
    
    return body;
  } catch (error) {
    throw new ApiError(400, 'Corpo da requisição inválido');
  }
};

export const requireAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token de autenticação não fornecido');
  }
  
  const token = authHeader.substring(7);
  
  // Aqui você pode validar o token com Supabase
  // Por enquanto, apenas verificamos se existe
  if (!token) {
    throw new ApiError(401, 'Token inválido');
  }
  
  return token;
};

export const paginateResults = <T>(
  data: T[],
  page: number = 1,
  limit: number = 10
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  };
};
