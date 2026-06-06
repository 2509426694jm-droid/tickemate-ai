"use client";

import { motion } from "framer-motion";
import { UserState } from "@/lib/types";
import { STEPS } from "@/lib/data";
import { RotateCcw, Trophy, BookOpen, ExternalLink } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onRestart: () => void;
}

const RESOURCES = [
  { name: "Weverse Shop",            desc: "HYBE artists official shop" },
  { name: "Melon Ticket (멜론티켓)", desc: "Major Korean ticketing platform" },
  { name: "Interpark Ticket",        desc: "Popular concert tickets in Korea" },
  { name: "YES24 Live",              desc: "Concerts and events in Korea" },
];

export default function CompletionScreen({ userState, onRestart }: Props) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg space-y-6"
      >
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl"
          >
            🏆
          </motion.div>
          <div>
            <h1 className="text-3xl font-black gradient-text">{t.completion.title}</h1>
            <p className="text-white/50 text-sm mt-1">{t.completion.subtitle}</p>
          </div>
        </div>

        {/* Completed steps */}
        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="text-xs text-white/40 uppercase tracking-widest mb-3">{t.completion.completedSteps}</div>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-sm flex-shrink-0`}>
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{t.steps[i].title}</div>
                <div className="text-xs text-white/40 truncate">{t.steps[i].subtitle}</div>
              </div>
              <div className="text-emerald-400 text-sm font-bold">✓</div>
            </motion.div>
          ))}
        </div>

        {/* Concert */}
        {userState.selectedConcert && (
          <div className="glass rounded-2xl p-5">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-3">{t.completion.yourTarget}</div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{userState.selectedConcert.image}</span>
              <div>
                <div className="font-bold text-white">{userState.selectedConcert.artist}</div>
                <div className="text-xs text-white/50">{userState.selectedConcert.tour}</div>
                <div className="text-xs text-violet-400 mt-1">📍 {userState.selectedConcert.venue}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pro tips */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t.completion.proTips}</span>
          </div>
          {t.completion.tips.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-base flex-shrink-0">{item.emoji}</span>
              <span className="text-white/60 leading-relaxed text-xs">{item.tip}</span>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{t.completion.resources}</span>
          </div>
          {RESOURCES.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <div>
                <div className="text-sm text-white">{r.name}</div>
                <div className="text-xs text-white/40">{r.desc}</div>
              </div>
              <ExternalLink size={12} className="text-white/20" />
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          {t.completion.practiceAgain}
        </motion.button>
      </motion.div>
    </div>
  );
}
