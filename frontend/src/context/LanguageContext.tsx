"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  toggleLanguage: () => void;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  dir: "rtl",
  toggleLanguage: () => {},
  setLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    // Check localStorage or browser preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_lang") as Language;
      if (saved === "ar" || saved === "en") {
        setLangState(saved);
        applyLanguageToDoc(saved);
      }
    }
  }, []);

  const applyLanguageToDoc = (targetLang: Language) => {
    if (typeof document !== "undefined") {
      const targetDir = targetLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = targetLang;
      document.documentElement.dir = targetDir;
    }
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_lang", newLang);
      document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    }
    applyLanguageToDoc(newLang);
  };

  const toggleLanguage = () => {
    const nextLang = lang === "ar" ? "en" : "ar";
    setLang(nextLang);
  };

  const dir: Direction = lang === "ar" ? "rtl" : "ltr";

  const t = (key: string, fallback?: string): string => {
    const dict = translations[lang] || translations.ar;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, setLang, t }}>
      <div dir={dir} className={lang === "en" ? "font-sans" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
