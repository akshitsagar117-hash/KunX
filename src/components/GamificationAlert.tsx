import { useState, useEffect } from "react";
import { Sparkles, Trophy, Award, Flame, Zap } from "lucide-react";

interface ToastAlert {
  id: string;
  type: "reward" | "achievement" | "level_up" | "challenge";
  title: string;
  message: string;
  xp?: number;
  coins?: number;
}

export default function GamificationAlert() {
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // Synthesize custom retro space frequencies using Web Audio API (Zero dependencies, Zero assets needed)
  const playSynthesizedSound = (type: "reward" | "achievement" | "level_up") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;

      if (type === "reward") {
        // Fast ascending clean sine tones (classic scientific chime)
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.3); // E6
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "achievement") {
        // Futuristic double-oscillator sweeping chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.setValueAtTime(523.25, now + 0.1); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35); // C6
        
        // Add a second harmonic oscillator for richness
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.35); // E6
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        gain2.gain.setValueAtTime(0.08, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc2.start(now);
        osc2.stop(now + 0.5);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "level_up") {
        // Glorious arpeggiated fanfare
        const freqs = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.5]; // E4, G4, C5, E5, G5, C6
        osc.type = "sine";
        gain.gain.setValueAtTime(0.12, now);
        
        freqs.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        });
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      console.warn("Web Audio API was blocked or unsupported:", e);
    }
  };

  useEffect(() => {
    // Listen to global custom events
    const handleRewards = (e: Event) => {
      const { xp, coins, reason, leveledUp, level } = (e as CustomEvent).detail;
      const id = Math.random().toString();
      
      if (leveledUp) {
        playSynthesizedSound("level_up");
        setToasts((prev) => [
          ...prev,
          {
            id: id + "_lvl",
            type: "level_up",
            title: "RESEARCH COMMAND ASCENSION!",
            message: `Scientific Credentials elevated to Rank ${level}!`,
            xp: 0,
            coins: 100 
          }
        ]);
      } else {
        playSynthesizedSound("reward");
        setToasts((prev) => [
          ...prev,
          {
            id,
            type: "reward",
            title: "TELEMETRY SYNCHRONIZED",
            message: reason || "Research action committed to secure vault",
            xp,
            coins
          }
        ]);
      }
    };

    const handleAchievement = (e: Event) => {
      const { achievement } = (e as CustomEvent).detail;
      const id = Math.random().toString();
      playSynthesizedSound("achievement");
      setToasts((prev) => [
        ...prev,
        {
          id,
          type: "achievement",
          title: "COSMIC DISCOVERY DETECTED",
          message: achievement.title + " - " + achievement.description,
          xp: achievement.xpReward,
          coins: achievement.coinReward
        }
      ]);
    };

    window.addEventListener("physics-rewards-earned", handleRewards);
    window.addEventListener("achievement-unlocked", handleAchievement);

    return () => {
      window.removeEventListener("physics-rewards-earned", handleRewards);
      window.removeEventListener("achievement-unlocked", handleAchievement);
    };
  }, []);

  // Auto-expire toasts
  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4500);
    return () => clearTimeout(interval);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-2xl border bg-slate-950/95 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-slide-in flex items-start gap-3.5 pointer-events-auto ${
            t.type === "level_up"
              ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              : t.type === "achievement"
              ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              : "border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          }`}
        >
          {/* Glowing Icon indicator */}
          <div className="mt-0.5">
            {t.type === "level_up" ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                <Trophy className="w-5 h-5" />
              </div>
            ) : t.type === "achievement" ? (
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                <Award className="w-5 h-5 animate-bounce" />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
            )}
          </div>

          {/* Description details */}
          <div className="flex-1 space-y-1">
            <h4
              className={`text-xs font-mono font-extrabold uppercase tracking-widest ${
                t.type === "level_up"
                  ? "text-emerald-400"
                  : t.type === "achievement"
                  ? "text-purple-400"
                  : "text-cyan-400"
              }`}
            >
              {t.title}
            </h4>
            <p className="text-xs text-slate-200 font-sans leading-snug">
              {t.message}
            </p>

            {/* Micro badge indicator */}
            <div className="flex gap-2.5 pt-1.5">
              {t.xp !== undefined && t.xp > 0 && (
                <span className="text-[9px] font-mono font-bold bg-cyan-950/50 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>+{t.xp} GeV Grid</span>
                </span>
              )}
              {t.coins !== undefined && t.coins > 0 && (
                <span className="text-[9px] font-mono font-bold bg-amber-950/50 text-amber-400 border border-amber-500/10 px-2 py-0.5 rounded flex items-center space-x-1">
                  <span className="text-xs">📡</span>
                  <span>+{t.coins} Telemetry Units</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
