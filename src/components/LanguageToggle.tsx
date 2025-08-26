"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pt" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
      title={
        language === "en" ? t("language.portuguese") : t("language.english")
      }
    >
      <span className="text-lg">{language === "en" ? "🇺🇸" : "🇧🇷"}</span>
      <span className="text-sm font-medium">
        {language === "en" ? "EN" : "PT"}
      </span>
    </button>
  );
}
