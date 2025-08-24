import { apiClient } from '@/lib/api-client';

// Exemplo 1: Autenticação
export async function exampleAuthentication() {
  try {
    // Login
    const loginResponse = await apiClient.login({
      email: 'usuario@exemplo.com',
      password: 'senha123'
    });

    if (loginResponse.success && loginResponse.data) {
      // Configurar token para futuras requisições
      apiClient.setAccessToken(loginResponse.data.session.access_token);
      console.log('Login realizado com sucesso:', loginResponse.data.user.email);
    } else {
      console.error('Erro no login:', loginResponse.error);
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
  }
}

// Exemplo 2: Gerenciamento de Todos
export async function exampleTodoManagement() {
  try {
    // Criar nova tarefa
    const createResponse = await apiClient.createTodo({
      task: 'Implementar nova funcionalidade',
      description: 'Desenvolver sistema de notificações'
    });

    if (createResponse.success && createResponse.data) {
      console.log('Tarefa criada:', createResponse.data);
      
      // Buscar todas as tarefas
      const todosResponse = await apiClient.getTodos({ page: 1, limit: 10 });
      
      if (todosResponse.success && todosResponse.data) {
        console.log('Tarefas carregadas:', todosResponse.data.data);
        console.log('Total de tarefas:', todosResponse.data.pagination.total);
      }
      
      // Atualizar tarefa
      const updateResponse = await apiClient.updateTodo(createResponse.data.id, {
        description: 'Desenvolver sistema de notificações com prioridade alta'
      });
      
      if (updateResponse.success) {
        console.log('Tarefa atualizada com sucesso');
      }
      
      // Marcar como completa
      const toggleResponse = await apiClient.toggleTodoComplete(
        createResponse.data.id, 
        false
      );
      
      if (toggleResponse.success) {
        console.log('Status da tarefa alterado');
      }
    }
  } catch (error) {
    console.error('Erro no gerenciamento de tarefas:', error);
  }
}

// Exemplo 3: Uso da IA para melhorar descrições
export async function exampleAIUsage() {
  try {
    const aiResponse = await apiClient.improveDescription({
      task: 'Organizar arquivos do projeto',
      currentDescription: 'Preciso organizar os arquivos'
    });

    if (aiResponse.success && aiResponse.data) {
      console.log('Descrição melhorada pela IA:', aiResponse.data.description);
    } else {
      console.error('Erro na IA:', aiResponse.error);
    }
  } catch (error) {
    console.error('Erro no uso da IA:', error);
  }
}

// Exemplo 4: Tratamento de erros
export async function exampleErrorHandling() {
  try {
    // Tentar acessar endpoint sem autenticação
    const response = await apiClient.getTodos();
    
    if (!response.success) {
      console.log('Status do erro:', response.error);
      
      // Verificar se é erro de autenticação
      if (response.error?.includes('401')) {
        console.log('Usuário não autenticado');
        // Redirecionar para login
      } else if (response.error?.includes('500')) {
        console.log('Erro interno do servidor');
        // Mostrar mensagem de erro genérica
      }
    }
  } catch (error) {
    console.error('Erro de rede:', error);
  }
}

// Exemplo 5: Health Check
export async function exampleHealthCheck() {
  try {
    const healthResponse = await apiClient.healthCheck();
    
    if (healthResponse.success && healthResponse.data) {
      console.log('Status da API:', healthResponse.data.status);
      console.log('Timestamp:', healthResponse.data.timestamp);
      console.log('Uptime:', healthResponse.data.uptime);
    }
  } catch (error) {
    console.error('Erro no health check:', error);
  }
}

// Exemplo 6: Uso em componentes React (com hooks)
export function exampleReactUsage() {
  // Este é um exemplo conceitual - os hooks reais estão em useApi.ts
  
  // const { todos, loading, error, fetchTodos, createTodo } = useTodos();
  // const { login, logout, isAuthenticated } = useAuth();
  
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchTodos();
  //   }
  // }, [isAuthenticated, fetchTodos]);
  
  // const handleCreateTodo = async (task: string) => {
  //   const result = await createTodo(task);
  //   if (result?.success) {
  //     // Mostrar mensagem de sucesso
  //   }
  // };
  
  return null; // Componente de exemplo
}
