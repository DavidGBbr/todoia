# Documentação da API - Todo IA

Esta documentação descreve a camada de API criada para o projeto Todo IA, baseada nas actions existentes.

## Visão Geral

A API foi criada para fornecer uma interface RESTful para todas as operações do sistema, incluindo:
- Autenticação de usuários
- Gerenciamento de tarefas (CRUD)
- Integração com IA para melhorar descrições
- Health check do sistema

## Estrutura da API

### Base URL
```
/api
```

### Autenticação
A API utiliza autenticação baseada em JWT tokens. Inclua o token no header:
```
Authorization: Bearer <seu_token>
```

## Endpoints

### 1. Health Check

#### GET /api/health
Verifica o status da API.

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 1234.56,
    "environment": "development"
  },
  "message": "API funcionando normalmente"
}
```

### 2. Autenticação

#### POST /api/auth/login
Realiza login do usuário.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "usuario@exemplo.com"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  },
  "message": "Login realizado com sucesso"
}
```

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": "Credenciais inválidas"
}
```

#### POST /api/auth/logout
Realiza logout do usuário.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Logout realizado com sucesso"
}
```

#### POST /api/auth/refresh
Renova o token de acesso.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "novo-jwt-token"
  },
  "message": "Token válido"
}
```

### 3. Gerenciamento de Tarefas

#### GET /api/todos
Lista todas as tarefas do usuário com paginação.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "task": "Implementar funcionalidade",
        "description": "Desenvolver sistema de notificações",
        "is_complete": false,
        "user_id": "user-uuid",
        "inserted_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "message": "Tarefas carregadas com sucesso"
}
```

#### POST /api/todos
Cria uma nova tarefa.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "task": "Nova tarefa",
  "description": "Descrição opcional da tarefa"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "task": "Nova tarefa",
    "description": "Descrição opcional da tarefa",
    "is_complete": false,
    "user_id": "user-uuid",
    "inserted_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tarefa criada com sucesso"
}
```

#### GET /api/todos/[id]
Busca uma tarefa específica.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "task": "Implementar funcionalidade",
    "description": "Desenvolver sistema de notificações",
    "is_complete": false,
    "user_id": "user-uuid",
    "inserted_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tarefa encontrada"
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Tarefa não encontrada"
}
```

#### PUT /api/todos/[id]
Atualiza uma tarefa existente.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "task": "Tarefa atualizada",
  "description": "Nova descrição",
  "is_complete": true
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "task": "Tarefa atualizada",
    "description": "Nova descrição",
    "is_complete": true,
    "user_id": "user-uuid",
    "inserted_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tarefa atualizada com sucesso"
}
```

#### DELETE /api/todos/[id]
Remove uma tarefa.

**Headers:** `Authorization: Bearer <token>`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Tarefa deletada com sucesso"
}
```

### 4. Integração com IA

#### POST /api/ai/improve-description
Usa IA para melhorar a descrição de uma tarefa.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "task": "Organizar arquivos",
  "currentDescription": "Preciso organizar os arquivos"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "description": "## Passos para organização:\n\n1. **Criar estrutura de pastas**\n   - Projetos\n   - Documentos\n   - Imagens\n\n2. **Classificar por tipo**\n   - Por extensão\n   - Por data\n   - Por projeto\n\n3. **Remover duplicatas**\n4. **Backup antes de mover**"
  },
  "message": "Descrição melhorada com sucesso"
}
```

## Códigos de Status HTTP

### Sucesso
- **200 OK**: Requisição processada com sucesso
- **201 Created**: Recurso criado com sucesso

### Erro do Cliente
- **400 Bad Request**: Dados inválidos ou malformados
- **401 Unauthorized**: Token de autenticação inválido ou ausente
- **404 Not Found**: Recurso não encontrado

### Erro do Servidor
- **500 Internal Server Error**: Erro interno do servidor

## Cliente HTTP

A API inclui um cliente HTTP TypeScript para facilitar o consumo:

```typescript
import { apiClient } from '@/lib/api-client';

// Configurar token de autenticação
apiClient.setAccessToken('seu-token');

// Fazer requisições
const response = await apiClient.getTodos();
if (response.success) {
  console.log(response.data);
}
```

## Hooks React

Hooks personalizados para facilitar o uso em componentes React:

```typescript
import { useTodos, useAuth } from '@/hooks/useApi';

function TodoComponent() {
  const { todos, loading, createTodo } = useTodos();
  const { isAuthenticated, login } = useAuth();
  
  // Usar as funções da API
}
```

## Tratamento de Erros

A API retorna erros padronizados com:
- Código de status HTTP apropriado
- Mensagem de erro descritiva
- Estrutura consistente de resposta

```typescript
try {
  const response = await apiClient.createTodo(data);
  if (!response.success) {
    console.error('Erro:', response.error);
    // Tratar erro específico
  }
} catch (error) {
  console.error('Erro de rede:', error);
}
```

## Validação

- Todos os endpoints validam dados de entrada
- Autenticação é verificada em endpoints protegidos
- Validação de propriedade de recursos (usuário só acessa seus próprios dados)

## Segurança

- Autenticação JWT obrigatória para endpoints protegidos
- Validação de propriedade de recursos
- Sanitização de dados de entrada
- Headers de segurança apropriados

## Exemplos de Uso

Veja o arquivo `src/examples/api-usage.ts` para exemplos completos de como usar cada endpoint da API.

## Configuração

Certifique-se de que as seguintes variáveis de ambiente estão configuradas:
- `OPENAI_API_KEY`: Chave da API OpenAI para funcionalidades de IA
- Configurações do Supabase para autenticação e banco de dados
