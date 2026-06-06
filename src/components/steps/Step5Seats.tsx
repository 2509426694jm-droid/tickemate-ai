"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserState, Seat } from "@/lib/types";
import AiMessage from "@/components/ui/AiMessage";
import { Timer, MapPin, Star } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

interface Props {
  userState: UserState;
  onUpdate: (updates: Partial<UserState>) => void;
  onNext: () => void;
}

const ZONES = [
  { id: "pit",   name: "GA Pit",     nameKr: "스탠딩", color: "bg-red-500",    textColor: "text-red-300",    price: 165000, capacity: 20, emoji: "🔥" },
  { id: "floor", name: "Floor A",    nameKr: "플로어A",color: "bg-sky-500",    textColor: "text-sky-300",    price: 143000, capacity: 32, emoji: "⭐" },
  { id: "lower", name: "Lower Bowl", nameKr: "하단",   color: "bg-blue-500",   textColor: "text-blue-300",   price: 121000, capacity: 48, emoji: "💺" },
  { id: "upper", name: "Upper Bowl", nameKr: "상단",   color: "bg-indigo-500", textColor: "text-indigo-300", price: 99000,  capacity: 60, emoji: "🎵" },
];

function generateSeats(zone: typeof ZONES[0]): Seat[] {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F"];
  for (let r = 0; r < 4; r++) {
    for (let n = 1; n <= Math.floor(zone.capacity / 4); n++) {
      seats.push({
        id: `${zone.id}-${rows[r]}${n}`, row: rows[r], number: n, zone: zone.name,
        price: zone.price, available: Math.random() > (zone.id === "pit" ? 0.75 : 0.45),
        type: zone.id as Seat["type"],
      });
    }
  }
  return seats;
}

export default function Step5Seats({ userState, onUpdate, onNext }: Props) {
  const { t } = useTranslation();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [timer, setTimer] = useState(600);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTimer(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!selectedZone) return;
    const id = setInterval(() => {
      setSeats(prev =>
        prev.map(s => s.available && Math.random() > 0.92 && s.id !== selectedSeat?.id
          ? { ...s, available: false } : s)
      );
    }, 2000);
    return () => clearInterval(id);
  }, [selectedZone, selectedSeat]);

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    setSelectedSeat(null);
    setSeats(generateSeats(ZONES.find(z => z.id === zoneId)!));
  };

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timerUrgent = timer < 120;
  const total = Math.round((selectedSeat?.price || 0) * 1.05);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-4"
    >
      {/* Timer */}
      <div className={`flex items-center justify-between p-3 rounded-xl border ${
        timerUrgent ? "bg-red-500/10 border-red-500/30" : "bg-white/[0.04] border-white/10"
      }`}>
        <div className="flex items-center gap-2">
          <Timer size={14} className={timerUrgent ? "text-red-400" : "text-blue-400"} />
          <span className="text-xs text-white/50">{t.s5.sessionExpires}</span>
        </div>
        <motion.span
          key={timer}
          animate={timerUrgent ? { scale: [1, 1.1, 1] } : {}}
          className={`font-bold tabular-nums text-sm ${timerUrgent ? "text-red-400" : "text-cyan-300"}`}
        >
          {formatTimer(timer)}
        </motion.span>
      </div>

      {!selectedZone ? (
        <>
          <AiMessage message={t.ai.s5main} tips={t.ai.s5tips} />
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-blue-400" />
              <span className="text-sm font-semibold text-white">
                {userState.selectedConcert?.venueKr || "서울올림픽주경기장"}
              </span>
              <span className="text-xs text-white/35 ml-auto">{userState.selectedConcert?.venue}</span>
            </div>
            <div className="w-full h-8 bg-white/8 rounded-t-full mb-3 flex items-center justify-center">
              <span className="text-xs text-white/40 font-semibold tracking-wider">{t.common.stage}</span>
            </div>
            <div className="space-y-2">
              {ZONES.map(zone => (
                <motion.button
                  key={zone.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleZoneSelect(zone.id)}
                  className="w-full p-3 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-blue-500/8 hover:border-blue-500/25 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{zone.emoji}</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white">{zone.name}</div>
                        <div className="text-xs text-white/35">{zone.nameKr}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${zone.textColor}`}>₩{zone.price.toLocaleString()}</div>
                      <div className="text-xs text-white/25">{t.common.perTicket}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => { setSelectedZone(null); setSelectedSeat(null); }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              {t.s5.backToZones}
            </button>
            <span className="text-white/15">|</span>
            <span className="text-xs text-white/40">{ZONES.find(z => z.id === selectedZone)?.name}</span>
          </div>

          {!confirming ? (
            <>
              <AiMessage message={t.ai.s5main} variant="warning" />
              <div className="glass rounded-2xl p-4">
                <div className="flex gap-3 text-xs text-white/40 mb-3">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded inline-block" />{t.common.available}</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white/15 rounded inline-block" />{t.common.taken}</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded inline-block" />{t.common.selected}</span>
                </div>
                <div className="w-full h-4 bg-white/8 rounded mb-4 flex items-center justify-center">
                  <span className="text-[9px] text-white/25 uppercase tracking-widest">{t.common.stage}</span>
                </div>
                <div className="space-y-1.5">
                  {["A", "B", "C", "D"].map(row => (
                    <div key={row} className="flex items-center gap-1.5">
                      <span className="text-xs text-white/25 w-4 text-center">{row}</span>
                      <div className="flex gap-1 flex-wrap">
                        {seats.filter(s => s.row === row).map(seat => (
                          <motion.button
                            key={seat.id}
                            whileHover={seat.available ? { scale: 1.15 } : {}}
                            onClick={() => seat.available && setSelectedSeat(
                              selectedSeat?.id === seat.id ? null : seat
                            )}
                            className={`
                              w-6 h-6 rounded-sm text-[10px] font-bold transition-all
                              ${!seat.available
                                ? "bg-white/8 text-white/15 cursor-not-allowed"
                                : selectedSeat?.id === seat.id
                                  ? "bg-blue-500 text-white glow-purple scale-110"
                                  : "bg-emerald-500/70 hover:bg-emerald-500 text-white cursor-pointer"
                              }
                            `}
                          >
                            {seat.number}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {selectedSeat && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="glass rounded-2xl p-4 border border-blue-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <Star size={14} className="text-amber-400" />
                          {selectedSeat.zone} — Row {selectedSeat.row}, Seat {selectedSeat.number}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">{t.s5.oneTicket}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-cyan-300">₩{selectedSeat.price.toLocaleString()}</div>
                        <div className="text-xs text-white/25">~${Math.round(selectedSeat.price / 1350)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setConfirming(true)}
                      className="mt-3 w-full py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all text-sm"
                    >
                      {t.s5.holdSeat}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <AiMessage message={t.ai.s5hold} variant="warning" />
              <div className="glass rounded-2xl p-5 space-y-3">
                <div className="text-sm font-bold text-white mb-3">{t.s5.orderSummary}</div>
                {[
                  [t.s5.concert, userState.selectedConcert?.artist],
                  [t.s5.date, userState.selectedConcert?.date],
                  [t.s5.venue, userState.selectedConcert?.venueKr],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/50">{label}</span>
                    <span className="text-white">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-t border-white/8 pt-3">
                  <span className="text-white/50">{t.s5.seat}</span>
                  <span className="text-cyan-300 font-medium">
                    {selectedSeat?.zone} Row {selectedSeat?.row}-{selectedSeat?.number}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">{t.s5.ticketPrice}</span>
                  <span className="text-white">₩{selectedSeat?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">{t.common.serviceFee}</span>
                  <span className="text-white">₩{Math.round((selectedSeat?.price || 0) * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-white/8 pt-3">
                  <span className="text-white">{t.common.total}</span>
                  <span className="text-cyan-300">₩{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => { onUpdate({ selectedSeat }); onNext(); }}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:opacity-90 transition-all"
              >
                {t.s5.proceedPayment}
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
