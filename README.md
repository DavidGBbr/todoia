# 📋 Todo-IA - Lista de Tarefas Inteligente

Uma aplicação moderna de gerenciamento de tarefas construída com Next.js 15, Supabase e TypeScript. Interface elegante, autenticação segura e operações CRUD completas com enriquecimento automático por IA.

## 🚀 Visão Geral

**Todo-IA** é uma aplicação web full-stack para gerenciamento de tarefas pessoais que oferece:

- ✅ **Sistema de autenticação** completo com Supabase Auth
- ✅ **CRUD completo** de tarefas com Server Actions
- ✅ **Interface moderna** e responsiva com Tailwind CSS 4
- ✅ **Segurança avançada** com Row Level Security (RLS)
- ✅ **Performance otimizada** com Next.js 15 e App Router
- ✅ **Experiência do usuário** intuitiva com estados de loading
- 🤖 **Enriquecimento automático com IA** usando OpenAI GPT-4o-mini
- 💬 **Chat inteligente** com assistente virtual integrado
- 📱 **Design responsivo** mobile-first com Tailwind CSS 4
- 📝 **Suporte a Markdown** com React Markdown e remark-gfm

## 🛠️ Stack Tecnológica

### **Frontend**

- **[Next.js 15.5.0](https://nextjs.org/)** - Framework React com App Router
- **[React 19.1.0](https://react.dev/)** - Biblioteca de interface do usuário
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4.1.12](https://tailwindcss.com/)** - Framework de estilização moderna
- **[@tailwindcss/typography](https://github.com/tailwindcss/typography)** - Plugin para tipografia

### **Backend & Banco de Dados**

- **[Supabase](https://supabase.com/)** - Backend como serviço (BaaS)
- **PostgreSQL** - Banco de dados relacional
- **Supabase Auth** - Sistema de autenticação
- **Row Level Security (RLS)** - Segurança em nível de linha

### **Inteligência Artificial**

- **[OpenAI API](https://openai.com/)** - GPT-4o-mini para enriquecimento automático
- **Server Actions** - Processamento assíncrono no servidor
- **Prompt Engineering** - Sistema otimizado para gerar descrições úteis

### **Ferramentas de Desenvolvimento**

- **ESLint 9** - Linter para qualidade de código
- **PostCSS** - Processador de CSS com Tailwind CSS 4
- **React Markdown** - Renderização de conteúdo Markdown
- **remark-gfm** - Suporte a GitHub Flavored Markdown

## 📁 Estrutura do Projeto

```
todo-ia/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── action.ts          # Server Actions para CRUD e IA
│   │   │   ├── layout.tsx         # Layout do dashboard
│   │   │   └── page.tsx           # Página principal do dashboard
│   │   ├── chat/
│   │   │   ├── action.ts          # Server Actions para chat com IA
│   │   │   ├── layout.tsx         # Layout da página de chat
│   │   │   └── page.tsx           # Página de chat inteligente
│   │   ├── login/
│   │   │   ├── action.ts          # Server Action de autenticação
│   │   │   ├── layout.tsx         # Layout da página de login
│   │   │   └── page.tsx           # Página de login
│   │   ├── layout.tsx             # Layout raiz da aplicação
│   │   ├── page.tsx               # Página inicial/landing
│   │   ├── globals.css            # Estilos globais com Tailwind CSS 4
│   │   └── favicon.ico            # Ícone da aplicação
│   ├── utils/
│   │   └── supabase/
│   │       ├── client.ts          # Cliente Supabase (browser)
│   │       ├── server.ts          # Cliente Supabase (servidor)
│   │       └── middleware.ts      # Middleware de autenticação
│   └── middleware.ts              # Middleware global do Next.js
├── src/
│   └── components/                # Componentes reutilizáveis
│       └── ChatWidget.tsx         # Widget de chat flutuante
├── public/                        # Arquivos estáticos
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # Configuração TypeScript
├── postcss.config.mjs             # Configuração PostCSS com Tailwind
├── eslint.config.mjs              # Configuração ESLint
├── next.config.ts                 # Configuração Next.js
└── README.md                      # Documentação do projeto
```

## 🎯 Funcionalidades

### **🔐 Autenticação**

- Login seguro com email e senha via Supabase Auth
- Sessões persistentes com cookies httpOnly
- Redirecionamento automático baseado no estado de autenticação
- Middleware de proteção de rotas

### **📝 Gerenciamento de Tarefas**

- **Criar**: Adicionar novas tarefas com título e descrição
- **Visualizar**: Lista organizada com filtros (todas, pendentes, concluídas)
- **Editar**: Modificar tarefas existentes inline
- **Deletar**: Remover tarefas com confirmação
- **Alternar Status**: Marcar como concluída/pendente
- **Expansão**: Visualizar descrições completas ou truncadas

### **🤖 Enriquecimento com IA**

- **Botão de melhoria**: Botão "🤖 Melhorar com IA" nos formulários
- **Descrição inteligente**: IA analisa título e descrição para criar versão melhorada
- **Controle manual**: Usuário decide quando usar a IA
- **Feedback visual**: Estados de carregamento durante processamento
- **Pré-visualização**: Usuário vê descrição gerada antes de salvar
- **Suporte a Markdown**: Descrições geradas incluem formatação rica

### **💬 Chat Inteligente**

- **Assistente virtual**: Chat completo com IA para dúvidas sobre a aplicação
- **Contexto inteligente**: IA entende o histórico da conversa
- **Respostas personalizadas**: Explicações detalhadas sobre funcionalidades
- **Widget flutuante**: Chat rápido disponível em todas as páginas
- **Fallback inteligente**: Funciona mesmo sem IA configurada
- **Interface WhatsApp**: Design familiar e intuitivo

### **📊 Dashboard Inteligente**

- Estatísticas em tempo real
- Filtros visuais por status
- Interface responsiva (mobile-first)
- Estados de loading e feedback visual
- Design moderno com micro-interações
- Suporte a Markdown nas descrições

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
- Chave da API OpenAI (para funcionalidade de IA)

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
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sua-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica

# OpenAI (para enriquecimento com IA)
OPENAI_API_KEY=sua-chave-da-openai
```

> **Nota**: A funcionalidade de IA é opcional. Se a chave da OpenAI não estiver configurada, o sistema funcionará normalmente sem o enriquecimento automático.

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

- **Criar**:
  1. Preencha o título da tarefa
  2. Opcionalmente, digite uma descrição inicial
  3. Clique em "🤖 Melhorar com IA" para enriquecer a descrição
  4. Revise a descrição gerada
  5. Clique em "Adicionar Tarefa" para salvar
- **Filtrar**: Use os botões "Todas", "Pendentes", "Concluídas"
- **Editar**:
  1. Clique no ícone ✏️ da tarefa
  2. Modifique título ou descrição
  3. Use "🤖 Melhorar com IA" para aprimorar
  4. Clique em "💾 Salvar" para confirmar
- **Completar**: Clique no círculo ao lado da tarefa
- **Deletar**: Clique no ícone 🗑️ (com confirmação)
- **Expandir**: Clique para ver descrição completa

### **3. Enriquecimento com IA**

- **Ativação manual**: Clique no botão "🤖 Melhorar com IA"
- **Disponível em**: Formulário de criação e modo de edição
- **Processo**:
  1. IA analisa título e descrição atual
  2. Gera versão melhorada e mais detalhada
  3. Usuário revisa antes de salvar
- **Requisitos**: Título obrigatório para usar a IA
- **Formato**: Descrições geradas incluem Markdown para melhor organização

### **4. Chat Inteligente**

- **Chat completo**: Acesse `/chat` para conversa completa com IA
- **Widget flutuante**: Botão flutuante no dashboard para chat rápido
- **Contexto inteligente**: IA lembra do histórico da conversa
- **Respostas personalizadas**: Explicações sobre funcionalidades da aplicação
- **Fallback inteligente**: Funciona mesmo sem IA configurada

### **5. Dashboard**

- Visualize estatísticas em tempo real
- Acompanhe progresso das tarefas
- Interface otimizada para produtividade
- Descrições enriquecidas pela IA para melhor contexto
- Suporte completo a Markdown nas descrições

## 🤖 Exemplos de Enriquecimento com IA

### **Entrada do Usuário:**
```
Título: "Estudar React"
Descrição atual: "Revisar conceitos básicos"
```

### **Depois de clicar em "🤖 Melhorar com IA" (com suporte a Markdown):**

```markdown
## Objetivo
Aprofundar conhecimentos em **React** para desenvolvimento web moderno, partindo da revisão de conceitos fundamentais.

### Plano de estudo estruturado:

#### 1. Conceitos Básicos (Revisão)
- Components funcionais e de classe
- Props e PropTypes  
- State management básico
- Event handling

#### 2. Hooks Essenciais
- `useState` para gerenciamento de estado
- `useEffect` para efeitos colaterais
- `useContext` para compartilhamento de dados
- Custom hooks para lógica reutilizável

#### 3. Prática Aplicada
1. Criar um projeto todo-list simples
2. Implementar CRUD operations
3. Adicionar validação de formulários

> **Dica**: Pratique codificando junto com tutoriais para fixar melhor o aprendizado.

**Recursos recomendados:**
- [Documentação oficial do React](https://react.dev)
- React Developer Tools
- Projetos práticos no CodeSandbox

**Tempo estimado:** 2-3 semanas (1-2h/dia)
```

### **Funcionalidades de Markdown Suportadas:**
- ✅ **Títulos** (`#`, `##`, `###`)
- ✅ **Texto em negrito** (`**texto**`)
- ✅ **Texto em itálico** (`*texto*`)  
- ✅ **Listas ordenadas** (`1. item`)
- ✅ **Listas não ordenadas** (`- item`)
- ✅ **Código inline** (`código`)
- ✅ **Blocos de código** (```código```)
- ✅ **Citações** (`> texto`)
- ✅ **Links** (`[texto](url)`)
- ✅ **Tabelas** (GitHub Flavored Markdown)

## 📝 Scripts Disponíveis

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

## 🔧 Troubleshooting

### **Problema: IA não está funcionando**

1. **Verifique a chave da API:**

   ```bash
   # No arquivo .env.local
   OPENAI_API_KEY=sk-proj-...
   ```

2. **Verifique os logs do servidor:**

   - Abra o terminal de desenvolvimento
   - Procure por erros relacionados à OpenAI

3. **Teste a conectividade:**
   - Verifique se a chave tem créditos disponíveis
   - Confirme que a chave tem permissões para o modelo GPT-4o-mini

### **Problema: Descrições não aparecem**

- A IA processa em background, aguarde alguns segundos
- Recarregue a página se necessário
- Verifique o console do navegador para erros

### **Fallback sem IA**

Se a IA não estiver disponível:

- Use o toggle para desabilitar
- Sistema funcionará normalmente sem enriquecimento
- Descrições manuais continuam funcionando

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
- Processamento assíncrono de IA em background

### **Middleware de Autenticação**

- Proteção de rotas sensíveis
- Gerenciamento de sessões
- Redirecionamento inteligente

### **Componentes Reutilizáveis**

- Interface modular e escalável
- TypeScript para tipagem segura
- Tailwind CSS 4 para estilização consistente
- Integração inteligente com IA

### **Inteligência Artificial**

- **OpenAI GPT-4o-mini**: Modelo otimizado para velocidade e custo
- **Prompt Engineering**: Sistema otimizado para gerar descrições úteis
- **Processamento Assíncrono**: Não bloqueia a interface do usuário
- **Fallback Gracioso**: Sistema funciona mesmo sem IA configurada
- **Suporte a Markdown**: Descrições geradas incluem formatação rica
- **Chat Inteligente**: Assistente virtual com contexto de conversa
- **Respostas Contextuais**: IA entende o histórico da conversa

### **Tailwind CSS 4**

- **Configuração moderna**: Usando PostCSS e configuração nativa
- **Typography plugin**: Suporte avançado para tipografia
- **Design system**: Componentes consistentes e responsivos
- **Mobile-first**: Interface otimizada para dispositivos móveis

## 📞 Suporte

Para dúvidas, problemas ou sugestões:

- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido por David Brigido**
