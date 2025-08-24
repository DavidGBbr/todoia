import { NextRequest } from 'next/server';
import { createApiResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    return createApiResponse(healthData, 'API funcionando normalmente');
  } catch (error) {
    return createApiResponse(
      { status: 'unhealthy', timestamp: new Date().toISOString() },
      'Erro na verificação de saúde da API',
      500
    );
  }
}
