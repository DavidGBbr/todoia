import { NextRequest } from 'next/server';
import { createApiResponse, createErrorResponse, validateRequest, requireAuth, ApiError } from '@/lib/api-utils';
import { ImproveDescriptionRequest, ImproveDescriptionResponse } from '@/types/api';
import OpenAI from 'openai';

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY não está configurada nas variáveis de ambiente"
    );
  }
  return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const body = await validateRequest<ImproveDescriptionRequest>(request);
    
    if (!body.task?.trim()) {
      throw new ApiError(400, 'Título da tarefa é obrigatório');
    }

    const openai = getOpenAIClient();

    const prompt = body.currentDescription
      ? `Descrição atual: "${body.currentDescription}"
         
         Melhore e detalhe mais esta descrição, mantendo o foco no conteúdo sem repetir o título da tarefa.`
      : `Crie uma descrição detalhada e útil para a atividade mencionada. Não repita o título, apenas elabore sobre como executar, passos necessários e dicas relevantes.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Você é um assistente especializado em organização e produtividade. 
          Quando receber informações sobre uma tarefa, você deve:
          1. Criar ou melhorar a descrição focando APENAS no conteúdo e execução
          2. NÃO repita ou mencione o título da tarefa na descrição
          3. Sugira subtarefas ou passos específicos para completá-la
          4. Dê dicas práticas e detalhes relevantes
          5. Mantenha um tom profissional mas acessível
          
          IMPORTANTE: Vá direto ao ponto sobre COMO fazer, não SOBRE O QUE é a tarefa.
          Responda em português brasileiro, seja conciso mas informativo (máximo 300 palavras).
          Use markdown para formatar a resposta de forma clara e organizada.`,
        },
        {
          role: "user",
          content: `Tarefa: "${body.task}"\n\n${prompt}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const improvedDescription = completion.choices[0]?.message?.content?.trim();

    if (!improvedDescription) {
      throw new ApiError(500, 'Resposta vazia da IA');
    }

    const response: ImproveDescriptionResponse = {
      description: improvedDescription,
    };

    return createApiResponse(response, 'Descrição melhorada com sucesso');
  } catch (error) {
    if (error instanceof ApiError) {
      return createErrorResponse(error.message, error.statusCode);
    }
    
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return createErrorResponse('Configuração da API de IA não encontrada', 500);
    }
    
    console.error('Erro ao melhorar descrição com IA:', error);
    return createErrorResponse('Erro interno do servidor', 500);
  }
}
