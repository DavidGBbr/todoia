import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createApiResponse, createErrorResponse, requireAuth, ApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new ApiError(500, 'Erro ao fazer logout');
    }

    return createApiResponse(null, 'Logout realizado com sucesso');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}
