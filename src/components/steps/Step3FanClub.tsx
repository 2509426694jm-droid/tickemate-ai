"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserState } from "@/lib/types";
import AiMessage from "@/components/ui/AiMessage";
import { Heart, Crown, Zap, Check, Gift } from "lucide-react";
import { useTranslation, tt } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

const FAN_CLUBS: Record<string, {
  name: string; fandom: string; fandomShort: string; emoji: string;
  color: string; price: string; perks: string[]; preSaleAdvance: string;
}> = {
  "bts-2025": {
    name: "ARMY Membership", fandom: "BTS ARMY", fandomShort: "ARMY",
    emoji: "💜", color: "from-indigo-600 to-violet-700", price: "₩30,000 / year (~$22)",
    perks: ["Pre-sale tickets 2 days early","Exclusive merchandise","Birthday event access","Fan café access","Member exclusive photocard"],
    preSaleAdvance: "2 days",
  },
  "blackpink-2025": {
    name: "BLINK Membership", fandom: "BLACKPINK BLINK", fandomShort: "BLINK",
    emoji: "🌸", color: "from-pink-600 to-rose-600", price: "₩25,000 / year (~$18)",
    perks: ["Pre-sale 1 day early","Exclusive lightstick discount","Fan event access","Digital content","Member card"],
    preSaleAdvance: "1 day",
  },
  "aespa-2025": {
    name: "MY Membership", fandom: "aespa MY", fandomShort: "MY",
    emoji: "⚡", color: "from-cyan-600 to-blue-600", price: "₩28,000 / year (~$20)",
    perks: ["Pre-sale 1 day early","Virtual fan meeting access","Exclusive digital content","Member badge","Early album pre-order"],
    preSaleAdvance: "1 day",
  },
  "seventeen-2025": {
    name: "CARAT Membership", fandom: "SEVENTEEN CARAT", fandomShort: "CARAT",
    emoji: "💎", color: "from-sky-500 to-blue-600", price: "₩30,000 / year (~$22)",
    perks: ["Pre-sale 2 days early","Exclusive merchandise shop","Fan café access","Fansign event eligibility","Member kit"],
    preSaleAdvance: "2 days",
  },
};

type Stage = "info" | "join" | "payment" | "complete";

export default function Step3FanClub({ userState, onUpdate, onNext }: Props) {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>("info");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const concert = userState.selectedConcert;
  const club = concert ? (FAN_CLUBS[concert.id] ?? FAN_CLUBS["bts-2025"]) : FAN_CLUBS["bts-2025"];

  const simulate = (fn: () => void, ms = 1800) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); fn(); }, ms);
  };

  const aiMain = tt(t.ai.s3main, { fandom: club.fandom, days: club.preSaleAdvance });

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
          {stage === "info" && (
            <>
              <AiMessage message={aiMain} tips={t.ai.s3tips} />
              {/* Fan club card — keep brand-specific colors */}
              <div className={`rounded-2xl bg-gradient-to-br ${club.color} p-[2px]`}>
                <div className="bg-[#080e1f] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{club.emoji}</span>
                    <div>
                      <div className="font-bold text-white text-lg">{club.name}</div>
                      <div className="text-xs text-white/40">{club.fandom}</div>
                    </div>
                    <div className="ml-auto"><Crown size={20} className="text-amber-400" /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-white/35 uppercase tracking-wider">{t.s3.memberBenefits}</div>
                    {club.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <Check size={13} className="text-emerald-400 flex-shrink-0" />
                        {perk}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Zap size={14} className="text-amber-400" />
                      <span className="text-sm font-bold text-amber-400">
                        {tt(t.s3.earlyAccess, { n: club.preSaleAdvance })}
                      </span>
                    </div>
                    <div className="text-sm text-white/75 font-semibold">{club.price}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStage("join")}
                  className={`py-4 rounded-2xl font-bold text-sm bg-gradient-to-r ${club.color} text-white hover:opacity-90 transition-all`}
                >
                  {club.emoji} {t.s3.joinNow}
                </button>
                <button
                  onClick={() => { onUpdate({ fanClubJoined: false }); onNext(); }}
                  className="py-4 rounded-2xl font-bold text-sm bg-white/[0.06] text-white/50 hover:bg-white/10 transition-all"
                >
                  {t.s3.skipGeneral}
                </button>
              </div>
              <p className="text-xs text-center text-white/25">{t.s3.skipWarning}</p>
            </>
          )}

          {stage === "join" && (
            <>
              <AiMessage message={aiMain} />
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Heart size={16} className="text-cyan-400" />
                  {t.s3.regForm}
                </div>
                <div className="space-y-3 text-sm text-white/55">
                  {[
                    [t.s3.membershipType, club.name, "text-white"],
                    [t.s3.duration, t.s3.annual, "text-white"],
                    [t.s3.preSaleAccess, tt(t.s3.earlyCheck, { n: club.preSaleAdvance }), "text-emerald-400"],
                    [t.common.total, club.price, "text-white font-semibold"],
                  ].map(([label, val, cls], i) => (
                    <div key={i} className={`flex justify-between py-2 ${i < 3 ? "border-b border-white/8" : ""}`}>
                      <span>{label}</span>
                      <span className={cls}>{val}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => setAgreed(!agreed)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      agreed ? "bg-blue-600 border-blue-500" : "border-white/25 group-hover:border-white/40"
                    }`}
                  >
                    {agreed && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-xs text-white/40">{t.s3.agreeTerms}</span>
                </label>
              </div>
              <button
                onClick={() => agreed && setStage("payment")}
                disabled={!agreed}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  agreed
                    ? `bg-gradient-to-r ${club.color} text-white hover:opacity-90`
                    : "bg-white/8 text-white/25 cursor-not-allowed"
                }`}
              >
                {t.s3.proceedPayment}
              </button>
            </>
          )}

          {stage === "payment" && (
            <>
              <AiMessage message={aiMain} variant="warning" />
              <div className="glass rounded-2xl p-5 space-y-4">
                <div className="text-sm font-semibold text-white mb-2">{t.s3.paymentMethod}</div>
                {[
                  { id: "card",  label: "International Credit Card", sub: "Visa, Mastercard, Amex", icon: "💳" },
                  { id: "kakao", label: "KakaoPay",                  sub: "Korean mobile payment",  icon: "💛" },
                  { id: "naver", label: "Naver Pay",                 sub: "Korean internet payment", icon: "💚" },
                ].map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/8">
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <div className="text-sm text-white">{m.label}</div>
                      <div className="text-xs text-white/35">{m.sub}</div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-white/8">
                  <span className="text-sm text-white/55">{t.common.total}</span>
                  <span className="text-lg font-bold text-white">{club.price}</span>
                </div>
              </div>
              <button
                onClick={() => simulate(() => setStage("complete"))}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold bg-gradient-to-r ${club.color} text-white hover:opacity-90 transition-all disabled:opacity-50`}
              >
                {loading ? t.s3.processingPayment : tt(t.s3.payJoin, { emoji: club.emoji })}
              </button>
            </>
          )}

          {stage === "complete" && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-8 text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-6xl"
                >
                  {club.emoji}
                </motion.div>
                <h3 className="text-xl font-bold text-white">
                  {tt(t.s3.officialMember, { fandom: club.fandomShort })}
                </h3>
                <p className="text-sm text-white/55">
                  {tt(t.s3.memberActivated, { n: club.preSaleAdvance })}
                </p>
                <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                  <Gift size={14} className="text-amber-400" />
                  <p className="text-xs text-amber-300">{t.s3.checkEmail}</p>
                </div>
              </motion.div>
              <AiMessage message={t.s3.fanClubJoined} variant="success" />
              <button
                onClick={() => { onUpdate({ fanClubJoined: true }); onNext(); }}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 transition-all"
              >
                {t.s3.enterQueue}
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
