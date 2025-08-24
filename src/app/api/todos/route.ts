import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createApiResponse, createErrorResponse, validateRequest, requireAuth, ApiError, paginateResults } from '@/lib/api-utils';
import { CreateTodoRequest, Todo, PaginationParams } from '@/types/api';

// GET /api/todos - Listar todos com paginação
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const supabase = await createClient();
    
    // Primeiro, vamos pegar o usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new ApiError(401, 'Usuário não autenticado');
    }

    // Buscar todos do usuário
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('inserted_at', { ascending: false });

    if (error) {
      throw new ApiError(500, 'Erro ao buscar tarefas');
    }

    const paginatedResults = paginateResults(data || [], page, limit);
    
    return createApiResponse(paginatedResults, 'Tarefas carregadas com sucesso');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}

// POST /api/todos - Criar nova tarefa
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const body = await validateRequest<CreateTodoRequest>(request);
    
    if (!body.task?.trim()) {
      throw new ApiError(400, 'Título da tarefa é obrigatório');
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new ApiError(401, 'Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({
        task: body.task.trim(),
        description: body.description?.trim() || '',
        is_complete: false,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(500, 'Erro ao criar tarefa');
    }

    return createApiResponse(data, 'Tarefa criada com sucesso', 201);
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}
