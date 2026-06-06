"use client";

import { motion } from "framer-motion";
import { CONCERTS } from "@/lib/data";
import { Concert, UserState } from "@/lib/types";
import AiMessage from "@/components/ui/AiMessage";
import { MapPin, Calendar, Ticket, Flame } from "lucide-react";
import { useTranslation, tt } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

const difficultyConfig = {
  Easy:    { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: "😊" },
  Hard:    { color: "text-sky-400",     bg: "bg-sky-400/10 border-sky-400/30",         icon: "😤" },
  Extreme: { color: "text-blue-300",    bg: "bg-blue-400/10 border-blue-400/30",       icon: "🔥" },
};

export default function Step1Concert({ userState, onUpdate, onNext }: Props) {
  const { t } = useTranslation();
  const selected = userState.selectedConcert;

  const handleSelect = (concert: Concert) => onUpdate({ selectedConcert: concert });

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <AiMessage message={t.ai.s1main} tips={t.ai.s1tips} />

      <div>
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">
          {t.s1.upcoming}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {CONCERTS.map((concert, i) => {
            const isSelected = selected?.id === concert.id;
            const diff = difficultyConfig[concert.difficulty];
            const diffLabel = t.s1[concert.difficulty.toLowerCase() as "easy" | "hard" | "extreme"] || concert.difficulty;
            return (
              <motion.button
                key={concert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSelect(concert)}
                className={`
                  w-full text-left rounded-2xl border-2 p-4 transition-all duration-200
                  ${isSelected
                    ? "border-blue-500 bg-blue-500/10 glow-purple"
                    : "border-white/8 bg-white/[0.03] hover:border-blue-500/30 hover:bg-blue-500/5"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl flex-shrink-0">
                    {concert.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-bold text-white text-base">{concert.artist}</div>
                        <div className="text-xs text-white/35">{concert.artistKr}</div>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold flex-shrink-0 ${diff.bg} ${diff.color}`}>
                        <span>{diff.icon}</span>
                        <span>{concert.difficulty}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-cyan-300 font-medium leading-tight">{concert.tour}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Calendar size={11} />{concert.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{concert.venue}</span>
                      <span className="flex items-center gap-1"><Ticket size={11} />{concert.platform}</span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-blue-500/20"
                  >
                    <div className="flex items-center gap-2 text-xs text-blue-300">
                      <Flame size={12} />
                      <span>{diffLabel}</span>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        disabled={!selected}
        className={`
          w-full py-4 rounded-2xl font-bold text-base transition-all duration-200
          ${selected
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white glow-purple hover:opacity-90"
            : "bg-white/8 text-white/25 cursor-not-allowed"
          }
        `}
      >
        {selected
          ? tt(t.s1.continueWith, { artist: selected.artist })
          : t.s1.selectFirst
        }
      </motion.button>
    </motion.div>
  );
}
