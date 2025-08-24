import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createApiResponse, createErrorResponse, validateRequest, ApiError } from '@/lib/api-utils';
import { LoginRequest, AuthResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await validateRequest<LoginRequest>(request);
    
    if (!body.email || !body.password) {
      throw new ApiError(400, 'Email e senha são obrigatórios');
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      throw new ApiError(401, 'Credenciais inválidas');
    }

    if (!data.user || !data.session) {
      throw new ApiError(401, 'Falha na autenticação');
    }

    const authResponse: AuthResponse = {
      user: {
        id: data.user.id,
        email: data.user.email || '',
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    };

    return createApiResponse(authResponse, 'Login realizado com sucesso');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}
