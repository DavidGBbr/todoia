# 📋 Todo-IA - Lista de Tarefas Inteligente

Uma aplicação moderna de gerenciamento de tarefas construída com Next.js 15, Supabase e TypeScript. Interface elegante, autenticação segura e operações CRUD completas.

## 🚀 Visão Geral

**Todo-IA** é uma aplicação web full-stack para gerenciamento de tarefas pessoais que oferece:

- ✅ **Sistema de autenticação** completo com Supabase Auth
- ✅ **CRUD completo** de tarefas com Server Actions
- ✅ **Interface moderna** e responsiva com Tailwind CSS
- ✅ **Segurança avançada** com Row Level Security (RLS)
- ✅ **Performance otimizada** com Next.js 15 e App Router
- ✅ **Experiência do usuário** intuitiva com estados de loading

## 🛠️ Stack Tecnológica

### **Frontend**

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca de interface do usuário
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de estilização

### **Backend & Banco de Dados**

- **[Supabase](https://supabase.com/)** - Backend como serviço (BaaS)
- **PostgreSQL** - Banco de dados relacional
- **Supabase Auth** - Sistema de autenticação
- **Row Level Security (RLS)** - Segurança em nível de linha

### **Ferramentas de Desenvolvimento**

- **ESLint** - Linter para qualidade de código
- **PostCSS** - Processador de CSS
- **Geist Font** - Fonte otimizada da Vercel

## 📁 Estrutura do Projeto

```
todo-ia/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── action.ts          # Server Actions para CRUD
│   │   │   ├── layout.tsx         # Layout do dashboard
│   │   │   └── page.tsx           # Página principal do dashboard
│   │   ├── login/
│   │   │   ├── action.ts          # Server Action de autenticação
│   │   │   ├── layout.tsx         # Layout da página de login
│   │   │   └── page.tsx           # Página de login
│   │   ├── layout.tsx             # Layout raiz da aplicação
│   │   ├── page.tsx               # Página inicial
│   │   ├── globals.css            # Estilos globais
│   │   └── favicon.ico            # Ícone da aplicação
│   ├── utils/
│   │   └── supabase/
│   │       ├── client.ts          # Cliente Supabase (browser)
│   │       ├── server.ts          # Cliente Supabase (servidor)
│   │       └── middleware.ts      # Middleware de autenticação
│   └── middleware.ts              # Middleware global do Next.js
├── public/                        # Arquivos estáticos
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # Configuração TypeScript
├── tailwind.config.js             # Configuração Tailwind CSS
├── next.config.ts                 # Configuração Next.js
└── README.md                      # Documentação do projeto
```

## 🎯 Funcionalidades

### **🔐 Autenticação**

- Login seguro com email e senha
- Sessões persistentes com cookies httpOnly
- Redirecionamento automático baseado no estado de autenticação
- Middleware de proteção de rotas

### **📝 Gerenciamento de Tarefas**

- **Criar**: Adicionar novas tarefas com título e descrição
- **Visualizar**: Lista organizada com filtros (todas, pendentes, concluídas)
- **Editar**: Modificar tarefas existentes inline
- **Deletar**: Remover tarefas com confirmação
- **Alternar Status**: Marcar como concluída/pendente

### **📊 Dashboard Inteligente**

- Estatísticas em tempo real
- Filtros visuais por status
- Interface responsiva (mobile-first)
- Estados de loading e feedback visual
- Design moderno com micro-interações

### **🔒 Segurança**

- Row Level Security (RLS) no Supabase
- Verificação de autenticação em todas as operações
- Proteção CSRF com Server Actions
- Validação de dados no servidor

## ⚙️ Configuração do Ambiente

### **Pré-requisitos**

- Node.js 18+
- npm, yarn, pnpm ou bun
- Conta no Supabase

### **1. Clone o repositório**

```bash
git clone <url-do-repositorio>
cd todo-ia
```

### **2. Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

### **3. Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

### **4. Configure o banco de dados Supabase**

Execute o seguinte SQL no editor SQL do Supabase:

```sql
-- Criar tabela todos
CREATE TABLE todos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados
CREATE POLICY "Usuários podem gerenciar suas próprias tarefas"
ON todos
FOR ALL
USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_inserted_at ON todos(inserted_at DESC);
```

### **5. Execute o projeto**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📱 Como Usar

### **1. Acesso**

- Acesse a aplicação em `http://localhost:3000`
- Faça login com suas credenciais
- Será redirecionado para o dashboard

### **2. Gerenciar Tarefas**

- **Criar**: Preencha o formulário e clique em "Adicionar Tarefa"
- **Filtrar**: Use os botões "Todas", "Pendentes", "Concluídas"
- **Editar**: Clique no ícone ✏️ da tarefa
- **Completar**: Clique no círculo ao lado da tarefa
- **Deletar**: Clique no ícone 🗑️ (com confirmação)

### **3. Dashboard**

- Visualize estatísticas em tempo real
- Acompanhe progresso das tarefas
- Interface otimizada para produtividade

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar build de produção
npm run start

# Verificar qualidade do código
npm run lint
```

## 🌐 Deploy

### **Vercel (Recomendado)**

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático em cada commit

### **Outras Plataformas**

- Netlify
- Railway
- Render
- AWS Amplify

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📋 Estrutura do Banco de Dados

### **Tabela: todos**

| Campo         | Tipo      | Descrição                           |
| ------------- | --------- | ----------------------------------- |
| `id`          | BIGINT    | Chave primária (auto-incremento)    |
| `user_id`     | UUID      | Referência ao usuário autenticado   |
| `task`        | TEXT      | Título da tarefa (obrigatório)      |
| `description` | TEXT      | Descrição opcional da tarefa        |
| `is_complete` | BOOLEAN   | Status de conclusão (padrão: false) |
| `inserted_at` | TIMESTAMP | Data/hora de criação                |

## 🔧 Arquitetura

### **Server Actions**

- Todas as operações CRUD executam no servidor
- Segurança e performance otimizadas
- Revalidação automática de cache

### **Middleware de Autenticação**

- Proteção de rotas sensíveis
- Gerenciamento de sessões
- Redirecionamento inteligente

### **Componentes Reutilizáveis**

- Interface modular e escalável
- TypeScript para tipagem segura
- Tailwind para estilização consistente

## 📞 Suporte

Para dúvidas, problemas ou sugestões:

- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido por David Brigido**
