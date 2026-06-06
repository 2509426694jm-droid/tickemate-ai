"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";

interface AiMessageProps {
  message: string;
  tips?: string[];
  variant?: "info" | "warning" | "success" | "error";
}

const styles = {
  info:    { border: "border-blue-500/40",    bg: "bg-blue-500/10",    icon: "🤖", color: "text-blue-300" },
  warning: { border: "border-amber-500/40",   bg: "bg-amber-500/10",   icon: "⚠️", color: "text-amber-300" },
  success: { border: "border-emerald-500/40", bg: "bg-emerald-500/10", icon: "✅", color: "text-emerald-300" },
  error:   { border: "border-red-500/40",     bg: "bg-red-500/10",     icon: "❌", color: "text-red-300" },
};

export default function AiMessage({ message, tips, variant = "info" }: AiMessageProps) {
  const { t } = useTranslation();
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const s = styles[variant];

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) { clearInterval(id); setDone(true); }
    }, 15);
    return () => clearInterval(id);
  }, [message]);

  const label = t.aiLabels[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${s.border} ${s.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-0.5 float">{s.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${s.color}`}>{label}</div>
          <p className="text-sm text-white/80 leading-relaxed">
            {displayed}
            {!done && <span className="cursor-blink text-cyan-400">|</span>}
          </p>
          {done && tips && tips.length > 0 && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 space-y-1.5"
            >
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <span className="text-cyan-400 mt-0.5">›</span>
                  <span>{tip}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
