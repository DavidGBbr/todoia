import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createApiResponse, createErrorResponse, validateRequest, requireAuth, ApiError } from '@/lib/api-utils';
import { UpdateTodoRequest, Todo } from '@/types/api';

// GET /api/todos/[id] - Buscar tarefa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new ApiError(400, 'ID inválido');
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new ApiError(401, 'Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new ApiError(404, 'Tarefa não encontrada');
      }
      throw new ApiError(500, 'Erro ao buscar tarefa');
    }

    return createApiResponse(data, 'Tarefa encontrada');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}

// PUT /api/todos/[id] - Atualizar tarefa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new ApiError(400, 'ID inválido');
    }

    const body = await validateRequest<UpdateTodoRequest>(request);
    
    if (Object.keys(body).length === 0) {
      throw new ApiError(400, 'Nenhum campo para atualizar');
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new ApiError(401, 'Usuário não autenticado');
    }

    // Verificar se a tarefa existe e pertence ao usuário
    const { data: existingTodo, error: fetchError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingTodo) {
      throw new ApiError(404, 'Tarefa não encontrada');
    }

    const { data, error } = await supabase
      .from('todos')
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new ApiError(500, 'Erro ao atualizar tarefa');
    }

    return createApiResponse(data, 'Tarefa atualizada com sucesso');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}

// DELETE /api/todos/[id] - Deletar tarefa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request);
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      throw new ApiError(400, 'ID inválido');
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new ApiError(401, 'Usuário não autenticado');
    }

    // Verificar se a tarefa existe e pertence ao usuário
    const { data: existingTodo, error: fetchError } = await supabase
      .from('todos')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingTodo) {
      throw new ApiError(404, 'Tarefa não encontrada');
    }

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw new ApiError(500, 'Erro ao deletar tarefa');
    }

    return createApiResponse(null, 'Tarefa deletada com sucesso');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    return createErrorResponse('Erro interno do servidor', 500);
  }
}
