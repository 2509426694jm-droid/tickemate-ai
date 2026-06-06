"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";

const LANGS: { code: Language; flag: string; label: string }[] = [
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "ja", flag: "🇯🇵", label: "JA" },
  { code: "zh", flag: "🇨🇳", label: "ZH" },
  { code: "ko", flag: "🇰🇷", label: "KO" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
      {LANGS.map((l) => (
        <motion.button
          key={l.code}
          whileTap={{ scale: 0.92 }}
          onClick={() => setLang(l.code)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all duration-200
            ${lang === l.code
              ? "bg-blue-600 text-white shadow-sm"
              : "text-white/40 hover:text-white/70 hover:bg-white/10"
            }
          `}
        >
          <span className="text-sm leading-none">{l.flag}</span>
          <span className="hidden xs:inline">{l.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
