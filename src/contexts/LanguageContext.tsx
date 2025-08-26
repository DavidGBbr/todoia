"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

export type Language = "en" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = useMemo(
    () =>
      (key: string): string => {
        const translation = translations[language] as Record<string, string>;
        return translation[key] || key;
      },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      t,
    }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Translations object
const translations = {
  en: {
    // Header/Navigation
    "nav.enter": "Sign In",
    "nav.start": "Get Started",
    "nav.learn_more": "Learn More",

    // Home Page
    "home.title": "Your Tasks,",
    "home.title_highlight": "Intelligently",
    "home.title_end": "Organized",
    "home.subtitle":
      "A modern task management application that combines productivity with artificial intelligence to transform your to-do lists into truly efficient experiences.",
    "home.get_started": "Get Started",
    "home.learn_more": "Learn More",

    // Features Section
    "features.title": "Powerful Features",
    "features.subtitle": "Everything you need for intelligent task management",

    "features.ai.title": " AI Enhancement",
    "features.ai.description":
      "Transform simple tasks into detailed, structured descriptions with OpenAI GPT-4o-mini. Get intelligent suggestions and automatic improvements.",

    "features.security.title": "Advanced Security",
    "features.security.description":
      "Complete authentication with Supabase Auth and Row Level Security (RLS). Your data is protected at every level.",

    "features.chat.title": "Smart Chat",
    "features.chat.description":
      "Intelligent virtual assistant integrated into the application. Get help, tips, and personalized explanations about features.",

    "features.responsive.title": "Responsive Design",
    "features.responsive.description":
      "Modern, mobile-first interface with Tailwind CSS 4. Perfect experience on any device, from smartphone to desktop.",

    "features.markdown.title": "Markdown Support",
    "features.markdown.description":
      "Rich descriptions with full Markdown support. Format your tasks with lists, links, code, and advanced typography.",

    "features.realtime.title": "Real-time Updates",
    "features.realtime.description":
      "Instant synchronization with Supabase. Changes appear immediately across all your devices without page refresh.",

    // Technology Section
    "tech.title": "Modern Technology",
    "tech.subtitle": "Built with the latest and most powerful tools",

    "tech.nextjs.title": "Next.js 15",
    "tech.nextjs.description":
      "React framework with App Router, Server Actions, and optimized performance.",

    "tech.supabase.title": "Supabase",
    "tech.supabase.description":
      "Backend as a Service with PostgreSQL, authentication, and real-time updates.",

    "tech.openai.title": "OpenAI GPT-4o",
    "tech.openai.description":
      "Advanced artificial intelligence for task enhancement and intelligent chat.",

    "tech.tailwind.title": "Tailwind CSS 4",
    "tech.tailwind.description":
      "Modern styling framework with typography support and responsive design.",

    // Call to Action
    "cta.title": "Ready to Transform Your Productivity?",
    "cta.subtitle":
      "Join thousands of users who have already revolutionized their task management with artificial intelligence.",
    "cta.button": "Start for Free",

    // Footer
    "footer.description":
      "Transform your task lists with artificial intelligence. Modern, secure, and efficient interface.",
    "footer.features": "Features",
    "footer.technology": "Technology",
    "footer.support": "Support",
    "footer.rights": "All rights reserved.",
    "footer.developed_by": "Developed by",

    // Login Page
    "login.title": "Welcome Back",
    "login.subtitle": "Sign in to your account to continue",
    "login.email": "Email",
    "login.email_placeholder": "Enter your email",
    "login.password": "Password",
    "login.password_placeholder": "Enter your password",
    "login.signin": "Sign In",
    "login.signing_in": "Signing in...",
    "login.no_account": "Don't have an account?",
    "login.signup": "Sign up here",
    "login.back_home": "← Back to Home",

    // Dashboard
    "dashboard.title": "Smart Dashboard",
    "dashboard.welcome": "Welcome back! Here are your tasks.",
    "dashboard.all_tasks": "All Tasks",
    "dashboard.pending": "Pending",
    "dashboard.completed": "Completed",
    "dashboard.no_tasks": "No tasks found",
    "dashboard.no_tasks_subtitle": "Start by creating your first task!",
    "dashboard.add_task": "Add Task",
    "dashboard.task_title": "Task Title",
    "dashboard.task_title_placeholder": "Enter task title",
    "dashboard.task_description": "Description (optional)",
    "dashboard.task_description_placeholder": "Enter task description",
    "dashboard.improve_ai": " Improve with AI",
    "dashboard.improving": "Improving...",
    "dashboard.save": "Save",
    "dashboard.saving": "Saving...",
    "dashboard.cancel": "Cancel",
    "dashboard.edit": "Edit",
    "dashboard.delete": "Delete",
    "dashboard.confirm_delete": "Are you sure you want to delete this task?",
    "dashboard.expand": "Expand",
    "dashboard.collapse": "Collapse",
    "dashboard.mark_complete": "Mark as complete",
    "dashboard.mark_pending": "Mark as pending",
    "dashboard.logout": "Sign Out",
    "dashboard.chat": "Chat",

    // Chat
    "chat.title": "Smart Assistant",
    "chat.subtitle": "Ask anything about the application",
    "chat.placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.thinking": "Assistant is thinking...",
    "chat.back_dashboard": "← Back to Dashboard",

    // Errors and Messages
    "error.general": "An error occurred. Please try again.",
    "error.login": "Invalid credentials. Please check your email and password.",
    "error.network": "Network error. Please check your connection.",
    "success.task_created": "Task created successfully!",
    "success.task_updated": "Task updated successfully!",
    "success.task_deleted": "Task deleted successfully!",
    "success.login": "Login successful!",

    // Stats
    "stats.total": "Total",
    "stats.pending": "Pending",
    "stats.completed": "Completed",
    "stats.completion_rate": "Completion Rate",

    // Language Toggle
    "language.portuguese": "Português",
    "language.english": "English",
  },
  pt: {
    // Header/Navigation
    "nav.enter": "Entrar",
    "nav.start": "Começar Agora",
    "nav.learn_more": "Saiba Mais",

    // Home Page
    "home.title": "Suas Tarefas,",
    "home.title_highlight": "Inteligentemente",
    "home.title_end": "Organizadas",
    "home.subtitle":
      "Uma aplicação moderna de gerenciamento de tarefas que combina produtividade com inteligência artificial para transformar suas listas de afazeres em experiências verdadeiramente eficientes.",
    "home.get_started": "Começar Agora",
    "home.learn_more": "Saiba Mais",

    // Features Section
    "features.title": "Recursos Poderosos",
    "features.subtitle":
      "Tudo que você precisa para gerenciamento inteligente de tarefas",

    "features.ai.title": " Enriquecimento com IA",
    "features.ai.description":
      "Transforme tarefas simples em descrições detalhadas e estruturadas com OpenAI GPT-4o-mini. Obtenha sugestões inteligentes e melhorias automáticas.",

    "features.security.title": "Segurança Avançada",
    "features.security.description":
      "Autenticação completa com Supabase Auth e Row Level Security (RLS). Seus dados estão protegidos em todos os níveis.",

    "features.chat.title": "Chat Inteligente",
    "features.chat.description":
      "Assistente virtual inteligente integrado à aplicação. Obtenha ajuda, dicas e explicações personalizadas sobre funcionalidades.",

    "features.responsive.title": "Design Responsivo",
    "features.responsive.description":
      "Interface moderna mobile-first com Tailwind CSS 4. Experiência perfeita em qualquer dispositivo, do smartphone ao desktop.",

    "features.markdown.title": "Suporte a Markdown",
    "features.markdown.description":
      "Descrições ricas com suporte completo a Markdown. Formate suas tarefas com listas, links, código e tipografia avançada.",

    "features.realtime.title": "Atualizações em Tempo Real",
    "features.realtime.description":
      "Sincronização instantânea com Supabase. Mudanças aparecem imediatamente em todos os seus dispositivos sem recarregar a página.",

    // Technology Section
    "tech.title": "Tecnologia Moderna",
    "tech.subtitle": "Construído com as ferramentas mais atuais e poderosas",

    "tech.nextjs.title": "Next.js 15",
    "tech.nextjs.description":
      "Framework React com App Router, Server Actions e performance otimizada.",

    "tech.supabase.title": "Supabase",
    "tech.supabase.description":
      "Backend como Serviço com PostgreSQL, autenticação e atualizações em tempo real.",

    "tech.openai.title": "OpenAI GPT-4o",
    "tech.openai.description":
      "Inteligência artificial avançada para enriquecimento de tarefas e chat inteligente.",

    "tech.tailwind.title": "Tailwind CSS 4",
    "tech.tailwind.description":
      "Framework de estilização moderno com suporte a tipografia e design responsivo.",

    // Call to Action
    "cta.title": "Pronto para Transformar sua Produtividade?",
    "cta.subtitle":
      "Junte-se a milhares de usuários que já revolucionaram seu gerenciamento de tarefas com inteligência artificial.",
    "cta.button": "Começar Gratuitamente",

    // Footer
    "footer.description":
      "Transforme suas listas de tarefas com inteligência artificial. Interface moderna, segura e eficiente.",
    "footer.features": "Funcionalidades",
    "footer.technology": "Tecnologia",
    "footer.support": "Suporte",
    "footer.rights": "Todos os direitos reservados.",
    "footer.developed_by": "Desenvolvido por",

    // Login Page
    "login.title": "Bem-vindo de Volta",
    "login.subtitle": "Entre na sua conta para continuar",
    "login.email": "Email",
    "login.email_placeholder": "Digite seu email",
    "login.password": "Senha",
    "login.password_placeholder": "Digite sua senha",
    "login.signin": "Entrar",
    "login.signing_in": "Entrando...",
    "login.no_account": "Não tem uma conta?",
    "login.signup": "Cadastre-se aqui",
    "login.back_home": "← Voltar ao Início",

    // Dashboard
    "dashboard.title": "Dashboard Inteligente",
    "dashboard.welcome": "Bem-vindo de volta! Aqui estão suas tarefas.",
    "dashboard.all_tasks": "Todas as Tarefas",
    "dashboard.pending": "Pendentes",
    "dashboard.completed": "Concluídas",
    "dashboard.no_tasks": "Nenhuma tarefa encontrada",
    "dashboard.no_tasks_subtitle": "Comece criando sua primeira tarefa!",
    "dashboard.add_task": "Adicionar Tarefa",
    "dashboard.task_title": "Título da Tarefa",
    "dashboard.task_title_placeholder": "Digite o título da tarefa",
    "dashboard.task_description": "Descrição (opcional)",
    "dashboard.task_description_placeholder": "Digite a descrição da tarefa",
    "dashboard.improve_ai": " Melhorar com IA",
    "dashboard.improving": "Melhorando...",
    "dashboard.save": "Salvar",
    "dashboard.saving": "Salvando...",
    "dashboard.cancel": "Cancelar",
    "dashboard.edit": "Editar",
    "dashboard.delete": "Deletar",
    "dashboard.confirm_delete": "Tem certeza que deseja deletar esta tarefa?",
    "dashboard.expand": "Expandir",
    "dashboard.collapse": "Recolher",
    "dashboard.mark_complete": "Marcar como concluída",
    "dashboard.mark_pending": "Marcar como pendente",
    "dashboard.logout": "Sair",
    "dashboard.chat": "Chat",

    // Chat
    "chat.title": "Assistente Inteligente",
    "chat.subtitle": "Pergunte qualquer coisa sobre a aplicação",
    "chat.placeholder": "Digite sua mensagem...",
    "chat.send": "Enviar",
    "chat.thinking": "Assistente está pensando...",
    "chat.back_dashboard": "← Voltar ao Dashboard",

    // Errors and Messages
    "error.general": "Ocorreu um erro. Tente novamente.",
    "error.login": "Credenciais inválidas. Verifique seu email e senha.",
    "error.network": "Erro de rede. Verifique sua conexão.",
    "success.task_created": "Tarefa criada com sucesso!",
    "success.task_updated": "Tarefa atualizada com sucesso!",
    "success.task_deleted": "Tarefa deletada com sucesso!",
    "success.login": "Login realizado com sucesso!",

    // Stats
    "stats.total": "Total",
    "stats.pending": "Pendentes",
    "stats.completed": "Concluídas",
    "stats.completion_rate": "Taxa de Conclusão",

    // Language Toggle
    "language.portuguese": "Português",
    "language.english": "English",
  },
};
