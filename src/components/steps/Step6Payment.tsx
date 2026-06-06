"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserState } from "@/lib/types";
import AiMessage from "@/components/ui/AiMessage";
import { CreditCard, Smartphone, Shield, Star, Share2 } from "lucide-react";
import { useTranslation, tt } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

type PayMethod = "card" | "kakao" | "naver" | "paypal";
type Stage = "method" | "details" | "complete";

const METHODS = [
  { id: "card"   as PayMethod, label: "International Credit Card", icon: "💳", sub: "Visa / Mastercard / Amex", success: 78 },
  { id: "kakao"  as PayMethod, label: "KakaoPay",                  icon: "💛", sub: "Korean mobile payment",    success: 99 },
  { id: "naver"  as PayMethod, label: "Naver Pay",                 icon: "💚", sub: "Korean internet payment",  success: 97 },
  { id: "paypal" as PayMethod, label: "PayPal",                    icon: "🔵", sub: "Available on select platforms", success: 85 },
];

export default function Step6Payment({ userState, onUpdate, onNext }: Props) {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>("method");
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const seat = userState.selectedSeat;
  const concert = userState.selectedConcert;
  const total = Math.round((seat?.price || 143000) * 1.05);

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handlePay = () => {
    setLoading(true);
    setFailed(false);
    const willSucceed = Math.random() * 100 < (METHODS.find(m => m.id === method)?.success || 80);
    setTimeout(() => {
      setLoading(false);
      if (willSucceed) { setStage("complete"); onUpdate({ paymentComplete: true }); }
      else setFailed(true);
    }, 2500);
  };

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
          {stage === "method" && (
            <>
              <AiMessage message={t.ai.s6main} tips={t.ai.s6tips} />
              <div className="space-y-2">
                {METHODS.map(m => (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setMethod(m.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      method === m.id ? "border-violet-500 bg-violet-500/15" : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-white">{m.label}</div>
                          <div className="text-xs text-white/40">{m.sub}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${m.success >= 95 ? "text-emerald-400" : m.success >= 85 ? "text-amber-400" : "text-red-400"}`}>
                          {m.success}%
                        </div>
                        <div className="text-[10px] text-white/30">{t.common.successRateLabel}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => method && setStage("details")}
                disabled={!method}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  method ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:opacity-90" : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {t.common.continue}
              </button>
            </>
          )}

          {stage === "details" && (
            <>
              <AiMessage message={t.ai.s6detail} variant="warning" />
              {/* Order summary */}
              <div className="glass rounded-2xl p-4 space-y-2 text-sm">
                <div className="font-semibold text-white text-xs uppercase tracking-wider mb-3">{t.s6.orderSummary}</div>
                <div className="flex justify-between text-white/60">
                  <span>{concert?.artist} — {seat?.zone || "Floor A"}</span>
                  <span>₩{seat?.price.toLocaleString() || "143,000"}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2">
                  <span className="text-white">{t.common.total}</span>
                  <span className="text-violet-300">₩{total.toLocaleString()}</span>
                </div>
              </div>

              {method === "card" ? (
                <div className="glass rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={16} className="text-violet-400" />
                    <span className="text-sm font-semibold text-white">{t.s6.cardDetails}</span>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">{t.s6.cardNumber}</label>
                    <input
                      value={cardNum}
                      onChange={e => setCardNum(formatCard(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500 tracking-widest"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">{t.s6.expiry}</label>
                      <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">{t.s6.cvv}</label>
                      <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="123" type="password"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-5 text-center space-y-3">
                  <Smartphone size={32} className="mx-auto text-violet-400" />
                  <div className="text-sm text-white/60">
                    {tt(t.s6.redirectTo, { method: METHODS.find(m => m.id === method)?.label || "" })}
                  </div>
                  <div className="text-xs text-white/30">{t.s6.otpNote}</div>
                </div>
              )}

              {failed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                  <span className="text-red-400">❌</span>
                  <p className="text-xs text-red-300">{t.s6.payFailed}</p>
                </motion.div>
              )}

              <div className="flex items-center gap-2 text-xs text-white/30">
                <Shield size={12} />
                <span>{t.common.ssl}</span>
              </div>

              <button
                onClick={handlePay}
                disabled={loading || (method === "card" && (cardNum.length < 19 || expiry.length < 5 || cvv.length < 3))}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    {t.s6.processingPayment}
                  </span>
                ) : tt(t.common.payBtn, { amount: total.toLocaleString() })}
              </button>
            </>
          )}

          {stage === "complete" && (
            <div className="space-y-4">
              {/* Ticket */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-xs text-violet-300/70 uppercase tracking-widest mb-1">TickeMate AI</div>
                      <div className="text-2xl font-black text-white">{concert?.artist}</div>
                      <div className="text-sm text-violet-300/80">{concert?.artistKr}</div>
                    </div>
                    <div className="text-4xl">{concert?.image}</div>
                  </div>
                  <div className="text-sm font-semibold text-white/90 mb-4">{concert?.tour}</div>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: "DATE", value: concert?.date || "" },
                      { label: "VENUE", value: concert?.venueKr || "" },
                      { label: "SEAT", value: `${seat?.zone} Row ${seat?.row}-${seat?.number}` },
                      { label: "TOTAL PAID", value: `₩${total.toLocaleString()}` },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="text-[10px] text-violet-300/50 uppercase tracking-widest">{item.label}</div>
                        <div className="text-sm font-semibold text-white mt-0.5">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="relative -mx-6 my-4">
                    <div className="border-t border-dashed border-white/20" />
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a0f] rounded-full" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a0f] rounded-full" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex justify-center gap-0.5">
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className="bg-white/80"
                          style={{ width: `${Math.random() > 0.5 ? 3 : 2}px`, height: `${Math.random() * 20 + 24}px` }} />
                      ))}
                    </div>
                    <div className="text-[10px] text-white/40 tracking-widest font-mono">
                      TM-{Math.random().toString(36).slice(2, 10).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute inset-0 shimmer pointer-events-none" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-1"
              >
                <div className="text-2xl font-black text-white">{t.s6.gotTicket}</div>
                <p className="text-sm text-white/50">{t.s6.simComplete}</p>
              </motion.div>

              <AiMessage message={t.ai.s6complete} variant="success" />

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Star size={16} className="text-amber-400" />, label: t.s6.score, value: "98/100" },
                  { icon: <Shield size={16} className="text-emerald-400" />, label: t.s6.stepsDone, value: "6/6" },
                  { icon: <CreditCard size={16} className="text-blue-400" />, label: t.s6.ready, value: "YES! ✓" },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">{item.icon}</div>
                    <div className="text-xs text-white/40">{item.label}</div>
                    <div className="text-sm font-bold text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onNext}
                  className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 transition-all text-sm"
                >
                  {t.s6.viewSummary}
                </button>
                <button className="px-4 py-3 rounded-2xl font-bold bg-white/10 text-white/60 hover:bg-white/15 transition-all">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
