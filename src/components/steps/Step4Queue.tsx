"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserState } from "@/lib/types";
import AiMessage from "@/components/ui/AiMessage";
import { Timer, Users, Wifi, AlertTriangle } from "lucide-react";
import { useTranslation, tt } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

type Stage = "ready" | "waiting" | "entering" | "entered";

export default function Step4Queue({ userState, onUpdate, onNext }: Props) {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>("ready");
  const [countdown, setCountdown] = useState(10);
  const [queuePos, setQueuePos] = useState(0);
  const [totalInQueue, setTotalInQueue] = useState(0);
  const [queueProgress, setQueueProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialPosRef = useRef(0);

  useEffect(() => {
    if (stage !== "waiting") return;
    let tick = 10;
    const id = setInterval(() => {
      tick--;
      setCountdown(tick);
      if (tick <= 0) { clearInterval(id); startQueue(); }
    }, 500);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const startQueue = () => {
    const pos = Math.floor(Math.random() * 8000) + (userState.fanClubJoined ? 1000 : 5000);
    const total = Math.floor(Math.random() * 50000) + 80000;
    initialPosRef.current = pos;
    setQueuePos(pos);
    setTotalInQueue(total);
    setTimeLeft(Math.ceil(pos / 200));
    setStage("entering");
  };

  useEffect(() => {
    if (stage !== "entering") return;
    let pos = queuePos;
    intervalRef.current = setInterval(() => {
      const decrease = Math.floor(Math.random() * 300) + 100;
      pos = Math.max(0, pos - decrease);
      setQueuePos(pos);
      setQueueProgress(((initialPosRef.current - pos) / initialPosRef.current) * 100);
      setTimeLeft(Math.max(0, Math.ceil(pos / 200)));
      if (pos <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStage("entered");
        onUpdate({ queuePosition: 1 });
      }
    }, 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `~${m}m ${s}s` : `~${s}s`;
  };

  const concert = userState.selectedConcert;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          {stage === "ready" && (
            <>
              <AiMessage message={t.ai.s4main} tips={t.ai.s4tips} />
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="text-center space-y-1">
                  <div className="text-4xl">⏳</div>
                  <div className="font-bold text-white text-lg">{t.s4.queueOpensSoon}</div>
                  <div className="text-xs text-white/40">{concert?.artist} — {concert?.tour}</div>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: "🎯", text: userState.fanClubJoined ? t.s4.fanClubQueue : t.s4.generalQueue, warn: !userState.fanClubJoined },
                    { icon: "📶", text: t.s4.stableNet,    warn: false },
                    { icon: "🚫", text: t.s4.noRefresh,    warn: false },
                    { icon: "💳", text: t.s4.paymentReady, warn: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 text-sm p-3 rounded-xl ${item.warn ? "bg-amber-500/10" : "bg-white/[0.04]"}`}>
                      <span>{item.icon}</span>
                      <span className={item.warn ? "text-amber-300" : "text-white/65"}>{item.text}</span>
                    </div>
                  ))}
                </div>
                {!userState.fanClubJoined && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl">
                    <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-300">{t.s4.generalWarning}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setStage("waiting")}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:opacity-90 transition-all pulse-glow"
              >
                {t.s4.enterQueueBtn}
              </button>
            </>
          )}

          {stage === "waiting" && (
            <div className="text-center space-y-6 py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-blue-500/30 border-t-blue-500 mx-auto"
              />
              <div>
                <div className="text-6xl font-bold text-blue-300 tabular-nums">{countdown}</div>
                <div className="text-white/45 text-sm mt-2">{t.s4.queueOpensIn}</div>
              </div>
              <div className="text-xs text-white/25">{t.s4.assigningPos}</div>
            </div>
          )}

          {stage === "entering" && (
            <div className="space-y-4">
              <AiMessage
                message={tt(t.ai.s4inqueue, {
                  pos: queuePos.toLocaleString(),
                  total: totalInQueue.toLocaleString(),
                  extra: userState.fanClubJoined ? t.ai.s4fanExtra : t.ai.s4generalExtra,
                })}
                variant="warning"
              />
              <div className="glass rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/35 uppercase tracking-wider">{t.s4.queuePos}</div>
                  <motion.div
                    key={queuePos}
                    initial={{ scale: 1.2, color: "#93c5fd" }}
                    animate={{ scale: 1, color: "#ffffff" }}
                    className="text-2xl font-bold tabular-nums"
                  >
                    #{queuePos.toLocaleString()}
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>{t.s4.progress}</span>
                    <span>{Math.round(queueProgress)}%</span>
                  </div>
                  <div className="h-3 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      animate={{ width: `${queueProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                    <Users size={16} className="mx-auto text-blue-400 mb-1" />
                    <div className="text-xs text-white/35">{t.s4.inQueue}</div>
                    <div className="text-sm font-bold text-white">{totalInQueue.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                    <Timer size={16} className="mx-auto text-cyan-400 mb-1" />
                    <div className="text-xs text-white/35">{t.s4.estWait}</div>
                    <div className="text-sm font-bold text-white">{formatTime(timeLeft)}</div>
                  </div>
                  <div className="bg-white/[0.04] rounded-xl p-3 text-center">
                    <Wifi size={16} className="mx-auto text-emerald-400 mb-1" />
                    <div className="text-xs text-white/35">{t.s4.status}</div>
                    <div className="text-sm font-bold text-emerald-400">● ON</div>
                  </div>
                </div>
                <div className="flex gap-2 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.15, 0.8, 0.15] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      className="flex-1 h-8 bg-blue-500/20 rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {stage === "entered" && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-8 text-center space-y-4"
              >
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-6xl">
                  🎉
                </motion.div>
                <h3 className="text-xl font-bold text-white">{t.s4.youreThrough}</h3>
                <p className="text-sm text-white/55">{t.s4.throughDesc}</p>
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3">
                  <p className="text-xs text-red-300 font-semibold">{t.s4.moveFast}</p>
                </div>
              </motion.div>
              <AiMessage message={t.ai.s4through} variant="success" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all pulse-glow"
              >
                {t.s4.selectSeatsNow}
              </motion.button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
