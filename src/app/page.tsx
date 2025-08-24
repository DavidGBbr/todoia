import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📋</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Todo-IA
            </span>
          </div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Entrar
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Suas Tarefas,
            <br />
            <span className="text-purple-600">Inteligentemente</span>{" "}
            Organizadas
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Uma aplicação moderna de gerenciamento de tarefas que combina
            produtividade com inteligência artificial para transformar suas
            listas de afazeres em experiências verdadeiramente eficientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Começar Agora
            </Link>
            <a
              href="#features"
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200"
            >
              Saiba Mais
            </a>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher o Todo-IA?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Combinação perfeita de simplicidade, funcionalidade e inteligência
              artificial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                IA Inteligente
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enriquecimento automático de descrições usando OpenAI GPT-4.
                Transforme títulos simples em descrições detalhadas e
                estruturadas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-700">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Segurança Avançada
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Autenticação robusta com Supabase, Row Level Security (RLS) e
                proteção CSRF. Suas tarefas ficam seguras e privadas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-2xl border border-green-200 dark:border-green-700">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Performance Otimizada
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Construído com Next.js 15, React 19 e TypeScript. Interface
                responsiva e operações CRUD ultra-rápidas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-700">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Design Responsivo
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Interface mobile-first com Tailwind CSS. Funciona perfeitamente
                em qualquer dispositivo.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-8 rounded-2xl border border-red-200 dark:border-red-700">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                CRUD Completo
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Criar, visualizar, editar e deletar tarefas com facilidade.
                Filtros inteligentes e organização automática.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-700">
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dashboard Inteligente
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Estatísticas em tempo real, progresso visual e insights sobre
                sua produtividade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar sua produtividade?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já transformaram suas listas de
            tarefas com a ajuda da inteligência artificial.
          </p>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
          >
            Começar Gratuitamente
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📋</span>
            </div>
            <span className="text-xl font-bold">Todo-IA</span>
          </div>
          <p className="text-gray-400 mb-6">
            Lista de Tarefas Inteligente - Transformando produtividade com IA
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>Next.js 15</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Supabase</span>
            <span>•</span>
            <span>OpenAI</span>
          </div>
          <div className="mt-6 text-gray-500 text-sm">
            © 2024 Todo-IA. Desenvolvido por David Brigido.
          </div>
        </div>
      </footer>
    </div>
  );
}
