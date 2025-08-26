import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo-IA - Smart Task List",
  description:
    "A modern task management application built with Next.js 15, Supabase and TypeScript. Elegant interface, secure authentication and complete CRUD operations with automatic AI enhancement.",
  keywords: [
    "todo",
    "tasks",
    "productivity",
    "AI",
    "artificial intelligence",
    "next.js",
    "supabase",
    "typescript",
  ],
  authors: [{ name: "David Brigido" }],
  creator: "David Brigido",
  publisher: "Todo-IA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://todo-ia.vercel.app"),
  openGraph: {
    title: "Todo-IA - Smart Task List",
    description:
      "Transform your task lists with artificial intelligence. Modern, secure and efficient interface.",
    url: "https://todo-ia.vercel.app",
    siteName: "Todo-IA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Todo-IA - Smart Task Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo-IA - Smart Task List",
    description:
      "Transform your task lists with artificial intelligence. Modern, secure and efficient interface.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen`}
        suppressHydrationWarning={true}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
