"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/data";
import { StepId } from "@/lib/types";
import { Check } from "lucide-react";
import { useTranslation, tt } from "@/contexts/LanguageContext";

interface StepProgressProps {
  currentStep: StepId;
  completedSteps: Set<number>;
}

export default function StepProgress({ currentStep, completedSteps }: StepProgressProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">
            {tt(t.common.stepOf, { n: String(currentStep) })}
          </span>
          <span className="text-xs font-medium text-blue-300">
            {t.steps[currentStep - 1].title}
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 6) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    border-2 transition-all duration-300
                    ${isCompleted || isPast
                      ? "bg-blue-600 border-blue-400 text-white"
                      : isCurrent
                        ? "bg-blue-600/20 border-blue-400 text-blue-200 pulse-glow"
                        : "bg-white/5 border-white/15 text-white/30"
                    }
                  `}
                >
                  {isCompleted || (isPast && !isCurrent)
                    ? <Check size={16} />
                    : isCurrent
                      ? <span className="text-lg">{step.icon}</span>
                      : <span className="text-xs">{step.id}</span>
                  }
                </motion.div>
                <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
                  isCurrent ? "text-blue-300" : isPast || isCompleted ? "text-white/60" : "text-white/25"
                }`}>
                  {t.steps[step.id - 1].title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="w-12 h-0.5 mb-5 mx-1">
                  <div className="relative h-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-blue-500"
                      animate={{ width: isPast || isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
