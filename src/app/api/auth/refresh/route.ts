import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createApiResponse, createErrorResponse, requireAuth, ApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const token = await requireAuth(request);
    
    const supabase = await createClient();
    
    // Aqui você pode implementar a lógica de refresh do token
    // Por enquanto, retornamos o token atual
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      throw new ApiError(401, 'Token inválido ou expirado');
    }

    return createApiResponse(
      { access_token: token },
      'Token válido'
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}
