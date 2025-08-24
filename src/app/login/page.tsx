import React from "react";
import { loginAction } from "./action";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Logo e Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">📋</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Todo-IA
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bem-vindo de volta
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Acesse seu painel de tarefas inteligente
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 dark:border-gray-700/50 p-8">
          <form action={loginAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Digite seu email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition duration-200"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Entrar na Conta
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">Ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition duration-200"
                >
                  Cadastre-se aqui
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Voltar para Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
