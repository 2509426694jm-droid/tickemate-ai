"use client";

import React, { createContext, useContext, useState } from "react";
import { translations, Language, T } from "@/lib/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: T;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

/** Interpolate {key} placeholders in a string */
export function tt(str: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, "g"), v),
    str
  );
}
