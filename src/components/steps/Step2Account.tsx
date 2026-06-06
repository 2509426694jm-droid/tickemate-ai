"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserState } from "@/lib/types";
import AiMessage from "@/components/ui/AiMessage";
import { User, Phone, ShieldCheck, Globe, CreditCard, AlertCircle } from "lucide-react";
import { useTranslation, tt } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

const PLATFORMS = [
  { id: "weverse",  name: "Weverse Shop",      flag: "🌐", desc: "Global K-POP platform by HYBE" },
  { id: "melon",    name: "Melon Ticket",       flag: "🍈", desc: "Korea's largest music platform" },
  { id: "interpark",name: "Interpark Ticket",   flag: "🎫", desc: "Major Korean ticketing site" },
  { id: "yes24",    name: "YES24 Live",          flag: "🎵", desc: "Popular Korean online store & tickets" },
];

type Stage = "platform" | "signup" | "phone" | "identity" | "complete";

export default function Step2Account({ userState, onUpdate, onNext }: Props) {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>("platform");
  const [platform, setPlatform] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const concert = userState.selectedConcert;
  const simulate = (fn: () => void, ms = 1500) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); fn(); }, ms);
  };
  const validateSignup = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.s2.nameRequired;
    if (!email.includes("@")) e.email = t.s2.emailRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const aiMain = concert
    ? tt(t.ai.s2main, { artist: concert.artist, platform: concert.platform })
    : t.ai.s2main.replace("{artist}", "this concert").replace("{platform}", "the ticketing platform");

  const stageContent: Record<Stage, React.ReactNode> = {
    platform: (
      <div className="space-y-3">
        <AiMessage message={aiMain} tips={t.ai.s2tips.slice(0, 2)} />
        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mt-4">{t.s2.choosePlatform}</h3>
        {PLATFORMS.map((p) => (
          <motion.button
            key={p.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => setPlatform(p.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              platform === p.id
                ? "border-blue-500 bg-blue-500/10 glow-purple"
                : "border-white/8 bg-white/[0.03] hover:border-blue-500/25 hover:bg-blue-500/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{p.flag}</span>
              <div>
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-xs text-white/35">{p.desc}</div>
              </div>
            </div>
          </motion.button>
        ))}
        <button
          onClick={() => platform && setStage("signup")}
          disabled={!platform}
          className={`w-full py-4 rounded-2xl font-bold transition-all ${
            platform
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90"
              : "bg-white/8 text-white/25 cursor-not-allowed"
          }`}
        >
          {t.common.continue}
        </button>
      </div>
    ),

    signup: (
      <div className="space-y-4">
        <AiMessage message={t.ai.s2verify} variant="warning" />
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t.s2.fullName}</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.s2.namePlaceholder}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pl-9 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t.s2.email}</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
            <AlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300">{t.s2.phoneWarning}</p>
          </div>
        </div>
        <button
          onClick={() => { if (validateSignup()) simulate(() => setStage("phone")); }}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? t.common.processing : t.s2.createAccount}
        </button>
      </div>
    ),

    phone: (
      <div className="space-y-4">
        <AiMessage message={t.ai.s2phone} />
        <div className="glass rounded-2xl p-5 text-center space-y-4">
          <Phone size={32} className="mx-auto text-blue-400" />
          <p className="text-sm text-white/55">{t.s2.smsSent}</p>
          <div className="flex gap-2 justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  i < phoneCode.length
                    ? "border-blue-500 bg-blue-500/15 text-white"
                    : "border-white/15 bg-white/[0.03] text-white/20"
                }`}
              >
                {phoneCode[i] || "·"}
              </div>
            ))}
          </div>
          <input
            value={phoneCode}
            onChange={e => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={t.s2.enterCode}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-center text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => phoneCode.length === 6 && simulate(() => setStage("identity"))}
          disabled={phoneCode.length !== 6 || loading}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? t.common.verifying : t.s2.verifyCode}
        </button>
      </div>
    ),

    identity: (
      <div className="space-y-4">
        <AiMessage message={t.ai.s2identity} tips={t.ai.s2tips.slice(2)} />
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-blue-400" />
            <span className="text-sm font-semibold text-white">{t.s2.foreignerVerify}</span>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t.s2.nationality}</label>
            <select className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option value="" className="bg-[#0a1628]">{t.s2.selectCountry}</option>
              <option value="us" className="bg-[#0a1628]">🇺🇸 United States</option>
              <option value="gb" className="bg-[#0a1628]">🇬🇧 United Kingdom</option>
              <option value="jp" className="bg-[#0a1628]">🇯🇵 Japan</option>
              <option value="cn" className="bg-[#0a1628]">🇨🇳 China</option>
              <option value="kr" className="bg-[#0a1628]">🇰🇷 Korea</option>
              <option value="other" className="bg-[#0a1628]">🌍 Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">{t.s2.passportNum}</label>
            <div className="relative">
              <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                placeholder={t.s2.passportPlaceholder}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pl-9 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => simulate(() => setStage("complete"), 2000)}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? t.s2.verifyingIdentity : t.s2.completeVerify}
        </button>
      </div>
    ),

    complete: (
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-8 text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto"
          >
            <ShieldCheck size={32} className="text-emerald-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">{t.s2.accountReady}</h3>
          <p className="text-sm text-white/55">
            {tt(t.s2.accountReadyDesc, { platform: PLATFORMS.find(p => p.id === platform)?.name || "the platform" })}
          </p>
          <div className="bg-white/[0.04] rounded-xl p-3 text-left space-y-1.5 mt-2">
            <div className="flex items-center gap-2 text-xs text-white/65">
              <span className="text-emerald-400">✓</span>
              {tt(t.s2.emailVerified, { email: email || "user@example.com" })}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/65">
              <span className="text-emerald-400">✓</span> {t.s2.phoneVerified}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/65">
              <span className="text-emerald-400">✓</span> {t.s2.identityVerified}
            </div>
          </div>
        </motion.div>
        <AiMessage message={t.ai.s2complete} variant="success" />
        <button
          onClick={() => { onUpdate({ accountVerified: true }); onNext(); }}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 transition-all"
        >
          {t.s2.proceedFanClub}
        </button>
      </div>
    ),
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
          {stageContent[stage]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
