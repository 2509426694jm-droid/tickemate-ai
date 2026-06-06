"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserState, StepId } from "@/lib/types";
import { STEPS } from "@/lib/data";
import StepProgress from "@/components/ui/StepProgress";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Step1Concert from "@/components/steps/Step1Concert";
import Step2Account from "@/components/steps/Step2Account";
import Step3FanClub from "@/components/steps/Step3FanClub";
import Step4Queue from "@/components/steps/Step4Queue";
import Step5Seats from "@/components/steps/Step5Seats";
import Step6Payment from "@/components/steps/Step6Payment";
import CompletionScreen from "@/components/CompletionScreen";
import { useTranslation, tt } from "@/contexts/LanguageContext";

const INITIAL_STATE: UserState = {
  selectedConcert: null,
  accountVerified: false,
  fanClubJoined: false,
  queuePosition: null,
  selectedSeat: null,
  paymentComplete: false,
  currentStep: 1,
};

export default function HomePage() {
  const { t } = useTranslation();
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showIntro, setShowIntro] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentStep = userState.currentStep;

  const updateState = (updates: Partial<UserState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep === 6) {
      setShowCompletion(true);
    } else {
      updateState({ currentStep: (currentStep + 1) as StepId });
    }
  };

  const restart = () => {
    setUserState(INITIAL_STATE);
    setCompletedSteps(new Set());
    setShowCompletion(false);
    setShowIntro(false);
  };

  if (showCompletion) {
    return <CompletionScreen userState={userState} onRestart={restart} />;
  }

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Language switcher top right */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center space-y-8"
        >
          <div className="space-y-3">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-7xl"
            >
              🎫
            </motion.div>
            <h1 className="text-4xl font-black">
              <span className="gradient-text">TickeMate</span>
              <span className="text-white"> AI</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              {t.intro.tagline}<br />
              {t.intro.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            {t.intro.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-4"
              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-sm font-bold text-white">{f.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{f.desc}</div>
              </motion.div>
            ))}
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-3">{t.intro.theSteps}</div>
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((step, i) => (
                <div key={step.id} className="text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl mx-auto mb-1`}>
                    {step.icon}
                  </div>
                  <div className="text-[10px] text-white/50">{t.steps[i].title}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowIntro(false)}
            className="w-full py-5 rounded-2xl font-black text-lg bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white hover:opacity-90 transition-all pulse-glow"
          >
            {t.intro.startBtn}
          </motion.button>

          <p className="text-xs text-white/20">{t.intro.disclaimer}</p>
        </motion.div>
      </div>
    );
  }

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1Concert userState={userState} onUpdate={updateState} onNext={goNext} />,
    2: <Step2Account userState={userState} onUpdate={updateState} onNext={goNext} />,
    3: <Step3FanClub userState={userState} onUpdate={updateState} onNext={goNext} />,
    4: <Step4Queue userState={userState} onUpdate={updateState} onNext={goNext} />,
    5: <Step5Seats userState={userState} onUpdate={updateState} onNext={goNext} />,
    6: <Step6Payment userState={userState} onUpdate={updateState} onNext={goNext} />,
  };

  const step = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎫</span>
              <span className="font-black text-white">TickeMate <span className="gradient-text">AI</span></span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={restart}
                className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded"
              >
                {t.common.restart}
              </button>
            </div>
          </div>
          <StepProgress currentStep={currentStep} completedSteps={completedSteps} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-20">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl`}>
              {step.icon}
            </div>
            <div>
              <div className="text-xs text-white/40 uppercase tracking-widest">
                {tt(t.common.stepOf, { n: String(currentStep) })}
              </div>
              <h2 className="text-xl font-black text-white">{t.steps[currentStep - 1].title}</h2>
            </div>
          </div>
          <p className="text-sm text-white/50 ml-[52px]">{t.steps[currentStep - 1].subtitle}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep}>
            {stepComponents[currentStep]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
