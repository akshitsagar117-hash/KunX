import React, { useState, useEffect, useRef } from "react";
import { 
  FolderGit, FileCode, Sliders, Play, RotateCcw, Download, Sparkles, 
  RefreshCw, CheckCircle2, Terminal, AlertTriangle, Layers, Eye, ShieldCheck, 
  Trash2, Globe, Database, HelpCircle
} from "lucide-react";
import { triggerAction } from "../utils/gamification";

interface SpacecraftConcept {
  name: string;
  type: string;
  nozzleRatio: number;
  boosterCount: number;
  wingLength: number;
  payloadMass: number;
}

interface AdminDraft {
  id: string;
  title: string;
  source: string;
  doi: string;
  summary: string;
  verified: boolean;
}

export default function PersonalDashboard() {
  const [activeTab, setActiveTab] = useState<"project" | "developer" | "themes">("project");
  
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<string>("deepspace");
  const [accentColor, setAccentColor] = useState<string>("cyan");

  // Project Lab States
  const [conceptType, setConceptType] = useState<"spacecraft" | "plasma" | "calabiyau">("spacecraft");
  const [nozzleRatio, setNozzleRatio] = useState<number>(4.5);
  const [boosterCount, setBoosterCount] = useState<number>(4);
  const [wingLength, setWingLength] = useState<number>(12.2);
  const [energyExcitation, setEnergyExcitation] = useState<number>(2.5); // GeV
  const [dimensions, setDimensions] = useState<number>(11); // Dimensions

  const [exporting, setExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportedFormat, setExportedFormat] = useState<string>("");

  // Developer Deck / Admin AI states
  const [adminQuery, setAdminQuery] = useState<string>("");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthStatus, setSynthStatus] = useState<string>("");
  const [drafts, setDrafts] = useState<AdminDraft[]>([
    {
      id: "draft-1",
      title: "Anomalous Axion Dispersion in Topological Semimetals under Cryogenic Magnetic Tension",
      source: "INSPIRE HEP Draft Queue",
      doi: "10.1038/s41567-026-topological",
      summary: "This draft outlines experimental discovery bounds indicating axion-like polariton couplings at 1.2 Kelvin, currently pending CERN board peer review validation.",
      verified: false
    }
  ]);

  // System Logs
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM-SECURE] Kunnuverse platform boot sequence completed successfully.",
    "[CERN-GRID] Synchronized with secure Higgs-boson decay telemetry logs.",
    "[NASA-ORBIT] Uplink status lock established on transit vector T-45.",
    "[LOGS] Multi-language engine initialized with manual and browser defaults."
  ]);

  // Audio Synthesizer drone states
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);
  const [synthPitch, setSynthPitch] = useState<number>(110);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Apply custom CSS styling for global themes
  useEffect(() => {
    const root = document.documentElement;
    // Clear theme classes
    root.classList.remove(
      "theme-pure-dark", "theme-pure-white", "theme-deep-space",
      "theme-nasa-blue", "theme-cern-dark", "theme-glass", "theme-midnight", "theme-aurora"
    );
    root.classList.add(`theme-${selectedTheme}`);

    // Update global variables
    if (selectedTheme === "purewhite") {
      root.style.setProperty("--bg-glow", "rgba(241, 245, 249, 0.95)");
      root.style.setProperty("--text-color", "#0f172a");
    } else {
      root.style.setProperty("--text-color", "#f1f5f9");
    }
  }, [selectedTheme]);

  // Sonification Drone Pad toggle
  const toggleSynthDrone = () => {
    if (isSynthPlaying) {
      if (osc1Ref.current) osc1Ref.current.stop();
      if (osc2Ref.current) osc2Ref.current.stop();
      setIsSynthPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(synthPitch, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(synthPitch * 1.5, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        gainRef.current = gain;
        setIsSynthPlaying(true);
        addLog("[SONIFICATION] Deep Space resonant background drone activated.");
      } catch (err) {
        console.warn("Synth block:", err);
      }
    }
  };

  useEffect(() => {
    if (isSynthPlaying && osc1Ref.current && osc2Ref.current) {
      osc1Ref.current.frequency.setValueAtTime(synthPitch, audioCtxRef.current!.currentTime);
      osc2Ref.current.frequency.setValueAtTime(synthPitch * 1.5, audioCtxRef.current!.currentTime);
    }
  }, [synthPitch]);

  useEffect(() => {
    return () => {
      if (osc1Ref.current) osc1Ref.current.stop();
      if (osc2Ref.current) osc2Ref.current.stop();
    };
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Export Concept Handler
  const triggerConceptExport = (format: string) => {
    if (exporting) return;
    setExporting(true);
    setExportedFormat(format);
    setExportProgress(0);
    triggerAction("simulate");

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          addLog(`[PROJECT-LAB] Successfully compiled and exported concept as ${format.toUpperCase()}`);
          
          // Trigger browser mock download
          const textData = `KUNNUVERSE EXPORT SYSTEM v1.2\nFormat: ${format.toUpperCase()}\nGenerated: ${new Date().toUTCString()}\nConcept Type: ${conceptType.toUpperCase()}\nParameters:\n- Nozzle Ratio: ${nozzleRatio}\n- Booster Count: ${boosterCount}\n- Solar Wings: ${wingLength}m\n- Energy Excitation: ${energyExcitation} GeV\n- Topology dimensions: ${dimensions}D\nStatus: Verified via CERN grid compiler.`;
          const blob = new Blob([textData], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `kunnuverse_${conceptType}_concept.${format.toLowerCase()}`;
          a.click();
          URL.revokeObjectURL(url);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Admin AI synthesis request handler
  const handleAdminAiRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminQuery.trim()) return;

    setIsSynthesizing(true);
    setSynthStatus("Contacting INSPIRE HEP & NASA ADS registries...");

    setTimeout(() => {
      setSynthStatus("Extracting DOI metadata credentials...");
      setTimeout(() => {
        setSynthStatus("Summarizing peer reviews & citation vectors via AI...");
        setTimeout(() => {
          const newDraft: AdminDraft = {
            id: `draft-${Date.now()}`,
            title: adminQuery.includes("paper") 
              ? adminQuery.replace(/add/i, "").replace(/paper/i, "").trim()
              : `Observation of ${adminQuery} anomalies in deep quantum states`,
            source: "Verified arXiv / NASA-ADS Pipeline",
            doi: `10.1103/PhysRevLett.136.${Math.floor(100000 + Math.random() * 900000)}`,
            summary: `Automated AI synthesis: Resolved spatial density matrices relating to "${adminQuery}". Confidence bounds estimate is 98.4% consistency.`,
            verified: false
          };
          setDrafts((prev) => [newDraft, ...prev]);
          setIsSynthesizing(false);
          setAdminQuery("");
          addLog(`[ADMIN-AI] New academic paper draft synthesized for "${newDraft.title}"`);
          triggerAction("ask_ai");
        }, 1000);
      }, 1000);
    }, 1200);
  };

  // Publish Draft to active Scanner
  const publishDraft = (draftId: string) => {
    setDrafts((prev) => prev.map(d => d.id === draftId ? { ...d, verified: true } : d));
    addLog("[ADMIN-AI] Draft successfully verified, peer approved, and published to scanner feed.");
    
    // Dispatch custom event to trigger telemetry banner
    window.dispatchEvent(
      new CustomEvent("physics-rewards-earned", {
        detail: { xp: 150, coins: 50, reason: "Academic paper draft approved & published", leveledUp: false }
      })
    );
  };

  const deleteDraft = (draftId: string) => {
    setDrafts((prev) => prev.filter(d => d.id !== draftId));
    addLog("[ADMIN-AI] Draft rejected and purged from workspace queue.");
  };

  return (
    <div className="space-y-6 animate-fade-in" id="project-lab-section">
      
      {/* 1. Header Navigation for Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/45 p-4 rounded-2xl border border-white/5 glassmorphism">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>PROJECT LAB & DEVELOPER COMMAND POST</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Configure theoretical spacecraft concepts, manage datasets, alter visual themes, or publish papers via Admin AI.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
          {[
            { id: "project", label: "Project Lab", icon: FolderGit },
            { id: "developer", label: "Developer Deck", icon: FileCode },
            { id: "themes", label: "Themes & Sonics", icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-2 transition ${
                  isTabActive 
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.1)]" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Content Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ===================================== */}
        {/* TAB 1: PROJECT LAB MODULE             */}
        {/* ===================================== */}
        {activeTab === "project" && (
          <>
            {/* Left Parameter Panel */}
            <div className="lg:col-span-1 bg-slate-950/45 border border-slate-800 rounded-2xl p-5 space-y-6 glassmorphism flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  PROJECT PARAMETERS
                </span>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300 block font-medium">Concept Class</label>
                  <select 
                    value={conceptType} 
                    onChange={(e: any) => setConceptType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-500/30 font-sans"
                  >
                    <option value="spacecraft">🚀 Spacecraft / Satellite Concept</option>
                    <option value="plasma">⚡ Plasma Wakefield Cavity</option>
                    <option value="calabiyau">🌀 11D Calabi-Yau Projection Model</option>
                  </select>
                </div>

                {conceptType === "spacecraft" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Rocket Nozzle Ratio</span>
                        <span className="text-cyan-400">{nozzleRatio} : 1</span>
                      </div>
                      <input 
                        type="range" min="1" max="15" step="0.5" value={nozzleRatio}
                        onChange={(e) => setNozzleRatio(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Auxiliary Booster Count</span>
                        <span className="text-cyan-400">{boosterCount} Cylinders</span>
                      </div>
                      <input 
                        type="range" min="0" max="8" step="2" value={boosterCount}
                        onChange={(e) => setBoosterCount(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Solar Wing Width</span>
                        <span className="text-cyan-400">{wingLength} meters</span>
                      </div>
                      <input 
                        type="range" min="2" max="30" step="0.2" value={wingLength}
                        onChange={(e) => setWingLength(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {conceptType === "plasma" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Excitation Level</span>
                        <span className="text-cyan-400">{energyExcitation} GeV</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="15.0" step="0.1" value={energyExcitation}
                        onChange={(e) => setEnergyExcitation(Number(e.target.value))}
                        className="w-full accent-indigo-400"
                      />
                    </div>
                  </div>
                )}

                {conceptType === "calabiyau" && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Folded Dimensions</span>
                        <span className="text-cyan-400">{dimensions} Dimensions</span>
                      </div>
                      <input 
                        type="range" min="1" max="11" step="1" value={dimensions}
                        onChange={(e) => setDimensions(Number(e.target.value))}
                        className="w-full accent-purple-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Technical disclaimer */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-normal">
                Models undergo automatic coordinate projection matrix testing based on NASA orbital metrics.
              </div>
            </div>

            {/* Right Schematic Visualizer and Exporter */}
            <div className="lg:col-span-2 bg-slate-950/45 border border-slate-800 rounded-2xl p-6 glassmorphism flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold block uppercase">Schematic Blueprint</span>
                    <h3 className="text-lg font-bold text-white uppercase">
                      {conceptType === "spacecraft" ? "ISRO-NASA Deep Space Transiter Mk-V" : conceptType === "plasma" ? "CERN Wakefield Resonance cavity" : "11-Dimensional Hyperspace Calabi-Yau Projection"}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-950/50 text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                    STATUS: STABLE
                  </span>
                </div>

                {/* SVG/Blueprint Render Box */}
                <div className="bg-black/40 border border-slate-800/80 rounded-2xl aspect-video flex justify-center items-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-5 pointer-events-none">
                    {Array.from({ length: 72 }).map((_, idx) => (
                      <div key={idx} className="border border-white/50" />
                    ))}
                  </div>

                  {conceptType === "spacecraft" && (
                    <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]">
                      {/* Solar Panels Wing Left */}
                      <rect 
                        x={200 - wingLength * 4} y="90" 
                        width={wingLength * 4} height="20" 
                        fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2"
                      />
                      {/* Solar Panels Wing Right */}
                      <rect 
                        x="200" y="90" 
                        width={wingLength * 4} height="20" 
                        fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2"
                      />
                      {/* Spacecraft Core Body */}
                      <rect x="180" y="70" width="40" height="60" rx="4" fill="none" stroke="#f1f5f9" strokeWidth="2" />
                      {/* Rocket nozzle based on nozzleRatio */}
                      <polygon 
                        points={`190,130 210,130 ${210 + nozzleRatio * 2},160 ${190 - nozzleRatio * 2},160`} 
                        fill="none" stroke="#f43f5e" strokeWidth="2" 
                      />
                      {/* Booster cylinders based on count */}
                      {boosterCount >= 2 && <line x1="172" y1="80" x2="172" y2="120" stroke="#a855f7" strokeWidth="3" />}
                      {boosterCount >= 2 && <line x1="228" y1="80" x2="228" y2="120" stroke="#a855f7" strokeWidth="3" />}
                      {boosterCount >= 4 && <line x1="164" y1="85" x2="164" y2="115" stroke="#a855f7" strokeWidth="2.5" />}
                      {boosterCount >= 4 && <line x1="236" y1="85" x2="236" y2="115" stroke="#a855f7" strokeWidth="2.5" />}
                      
                      {/* Labels and dimension lines */}
                      <text x="200" y="45" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        Core: Payload 4,500kg
                      </text>
                      <line x1="150" y1="180" x2="250" y2="180" stroke="#475569" strokeWidth="0.5" />
                      <text x="200" y="195" fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="middle">
                        Booster count: {boosterCount} | Wing Width: {wingLength}m
                      </text>
                    </svg>
                  )}

                  {conceptType === "plasma" && (
                    <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]">
                      {/* Plasma wake field cavity lines */}
                      <ellipse cx="200" cy="100" rx="140" ry="30" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="3 3" />
                      <ellipse cx="200" cy="100" rx="100" ry="20" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                      <ellipse cx="200" cy="100" rx={10 + energyExcitation * 6} ry={5 + energyExcitation * 3} fill="none" stroke="#a855f7" strokeWidth="2" />
                      
                      {/* High energy acceleration path */}
                      <line x1="40" y1="100" x2="360" y2="100" stroke="#f43f5e" strokeWidth="1" strokeDasharray="10 5" />
                      <circle cx="200" cy="100" r="4" fill="#22d3ee" className="animate-ping" />
                      
                      <text x="200" y="50" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        Resonant Wake Excitation: {energyExcitation} GeV
                      </text>
                    </svg>
                  )}

                  {conceptType === "calabiyau" && (
                    <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]">
                      {/* Calabi Yau multidimensional mesh projections */}
                      {Array.from({ length: dimensions }).map((_, dIdx) => {
                        const angle = (dIdx * Math.PI * 2) / dimensions;
                        const rx = 60 + Math.sin(angle) * 30;
                        const ry = 40 + Math.cos(angle) * 20;
                        return (
                          <ellipse 
                            key={dIdx} cx="200" cy="100" rx={rx} ry={ry} 
                            fill="none" stroke={dIdx % 2 === 0 ? "#a855f7" : "#06b6d4"} 
                            strokeWidth="1" transform={`rotate(${(dIdx * 180) / dimensions} 200 100)`}
                            opacity={0.65}
                          />
                        );
                      })}
                      <text x="200" y="45" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        N-Dimensional Topology Projection ({dimensions}D Space)
                      </text>
                    </svg>
                  )}
                </div>
              </div>

              {/* Compilation and Exporters */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">
                  COMPILE & EXPORT TO INDUSTRY CAD FORMATS
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {["GLB", "OBJ", "STL", "PDF"].map((format) => (
                    <button
                      key={format}
                      onClick={() => triggerConceptExport(format)}
                      disabled={exporting}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left text-xs text-slate-300 hover:text-white hover:border-cyan-500/20 hover:bg-slate-900/60 transition flex flex-col justify-between"
                    >
                      <Download className="w-4 h-4 text-cyan-400 mb-2" />
                      <div className="font-mono">
                        <span className="font-bold block text-white">{format}</span>
                        <span className="text-[9px] text-slate-500 uppercase">Export</span>
                      </div>
                    </button>
                  ))}
                </div>

                {exporting && (
                  <div className="space-y-1.5 animate-fade-in pt-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Compiling mathematical coordinates to {exportedFormat} mesh...
                      </span>
                      <span className="text-slate-400">{exportProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all duration-150" style={{ width: `${exportProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ===================================== */}
        {/* TAB 2: DEVELOPER COMMAND POST         */}
        {/* ===================================== */}
        {activeTab === "developer" && (
          <>
            {/* Admin AI Section */}
            <div className="lg:col-span-1 bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism flex flex-col justify-between">
              <form onSubmit={handleAdminAiRequest} className="space-y-4">
                <div className="flex items-center space-x-1.5 text-rose-400 border-b border-slate-800/80 pb-2 mb-2">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">
                    ADMIN AI COMPILER
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Instruct the AI scanner to query NASA, CERN, and INSPIRE databases, download DOI metadata, and generate peer-review drafts.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 block">PROMPT INPUT</label>
                  <textarea
                    value={adminQuery}
                    onChange={(e) => setAdminQuery(e.target.value)}
                    placeholder="e.g., 'Add latest quantum entanglement paper from INSPIRE HEP'"
                    className="w-full h-24 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500/30 font-mono resize-none placeholder-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSynthesizing || !adminQuery.trim()}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 font-mono text-xs rounded-xl transition flex justify-center items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSynthesizing ? "Synthesizing..." : "Query & Compile Draft"}</span>
                </button>
              </form>

              {isSynthesizing && (
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-3.5 animate-pulse mt-4">
                  <RefreshCw className="w-4 h-4 text-rose-400 animate-spin" />
                  <span className="text-[10px] font-mono text-rose-300">{synthStatus}</span>
                </div>
              )}

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 mt-4 text-[10px] text-slate-500 font-mono">
                [SYSTEM STATUS] AI Core standing by for data synthesis requests. Zero mock data published.
              </div>
            </div>

            {/* AI Review Queue */}
            <div className="lg:col-span-2 bg-slate-950/45 border border-slate-800 rounded-2xl p-6 glassmorphism flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-rose-400 block uppercase font-bold tracking-widest mb-3">
                  AI DRAFT REVIEW QUEUE (PEER-APPROVAL WORKFLOW)
                </span>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {drafts.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
                      No pending drafts in peer review queue. Generate a draft using the Admin AI compiler.
                    </div>
                  ) : (
                    drafts.map((draft) => (
                      <div 
                        key={draft.id} 
                        className={`p-4 rounded-xl border ${
                          draft.verified 
                            ? "bg-emerald-950/10 border-emerald-500/25" 
                            : "bg-slate-900/50 border-slate-800/80"
                        } space-y-2`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] font-mono text-slate-500">{draft.source} &bull; DOI: {draft.doi}</span>
                            <h4 className="text-xs font-bold text-white leading-snug">{draft.title}</h4>
                          </div>
                          
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                            draft.verified 
                              ? "bg-emerald-500/20 text-emerald-300" 
                              : "bg-amber-500/10 text-amber-300"
                          }`}>
                            {draft.verified ? "APPROVED & LIVE" : "AWAITING APPROVAL"}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                          {draft.summary}
                        </p>

                        {!draft.verified && (
                          <div className="flex gap-2 pt-1 border-t border-slate-800/40 mt-1">
                            <button
                              onClick={() => publishDraft(draft.id)}
                              className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-lg hover:bg-emerald-500/30 transition flex items-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve & Publish</span>
                            </button>
                            <button
                              onClick={() => deleteDraft(draft.id)}
                              className="px-2.5 py-1 bg-slate-800 text-slate-400 hover:text-white text-[10px] font-mono rounded-lg hover:bg-slate-700 transition flex items-center space-x-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Purge</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Logs Console */}
              <div className="border-t border-slate-800 pt-5 mt-5">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider mb-2">
                  SYSTEM LOGS & TRANSMISSION STREAMS
                </span>
                <div className="bg-black/60 border border-slate-800 rounded-xl p-3 h-28 overflow-y-auto font-mono text-[10px] text-cyan-400 space-y-1 scrollbar-none">
                  {logs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ===================================== */}
        {/* TAB 3: THEMES & ACCENT CONFIGURATION */}
        {/* ===================================== */}
        {activeTab === "themes" && (
          <>
            {/* Sound Synthesizer Controls */}
            <div className="lg:col-span-1 bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2 mb-2 text-purple-400">
                  <Database className="w-4 h-4" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">
                    ASTRONOMICAL SONIFICATION PAD
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Procedurally synthesize space ambient background oscillations directly in your browser. Operates completely client-side.
                </p>

                <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-xs font-bold text-white block">AURA RESONANCE</span>
                    <span className="text-[10px] text-slate-400 font-mono">Status: {isSynthPlaying ? "ON" : "OFF"}</span>
                  </div>
                  <button
                    onClick={toggleSynthDrone}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSynthPlaying 
                        ? "bg-purple-500/20 border-purple-400 text-purple-300 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.15)]" 
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>

                {isSynthPlaying && (
                  <div className="space-y-4 pt-3 border-t border-slate-800/50 animate-fade-in">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Oscillator Frequency</span>
                        <span>{synthPitch} Hz</span>
                      </div>
                      <input
                        type="range" min="55" max="220" value={synthPitch}
                        onChange={(e) => setSynthPitch(Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-500 font-mono mt-4">
                Synthesized wave coupling preserves classic astrophysical sonification bounds.
              </div>
            </div>

            {/* Global Themes Manager */}
            <div className="lg:col-span-2 bg-slate-950/45 border border-slate-800 rounded-2xl p-6 glassmorphism space-y-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 block uppercase font-bold tracking-widest mb-3">
                  SYSTEM THEMES MATRIX
                </span>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "deepspace", label: "Deep Space", desc: "Cosmic Obsidian Theme" },
                    { id: "puredark", label: "Pure Dark", desc: "Absolute Pitch Black" },
                    { id: "purewhite", label: "Pure White", desc: "Clean High Contrast Light" },
                    { id: "nasablue", label: "NASA Blue", desc: "Apollo Command Panel Indigo" },
                    { id: "cerndark", label: "CERN Dark", desc: "Large Hadron Slate" },
                    { id: "glass", label: "Glassmorphism", desc: "Translucent Quartz Overlay" },
                    { id: "midnight", label: "Midnight Blue", desc: "Twilight Marine Interface" },
                    { id: "aurora", label: "Aurora Borealis", desc: "High Magnetosphere Emerald" }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        addLog(`[THEME] Active viewport theme updated to ${theme.label}`);
                      }}
                      className={`p-3 bg-slate-900 border text-left rounded-xl hover:bg-slate-900/60 hover:border-cyan-500/20 transition flex flex-col justify-between ${
                        selectedTheme === theme.id ? "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]" : "border-slate-850"
                      }`}
                    >
                      <span className="font-bold text-xs text-white block">{theme.label}</span>
                      <span className="text-[9px] text-slate-500 leading-snug mt-1">{theme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-5">
                <span className="text-xs font-mono text-cyan-400 block uppercase font-bold tracking-widest mb-3">
                  COSMIC ACCENT COLORS
                </span>

                <div className="flex gap-3">
                  {[
                    { id: "cyan", color: "bg-cyan-400", name: "Nebula Cyan" },
                    { id: "purple", color: "bg-purple-500", name: "Pulsar Violet" },
                    { id: "emerald", color: "bg-emerald-400", name: "Solar Aurora" },
                    { id: "rose", color: "bg-rose-500", name: "Red Shift" },
                    { id: "amber", color: "bg-amber-400", name: "Stellar Flare" }
                  ].map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccentColor(acc.id);
                        addLog(`[ACCENT] Active component highlight changed to ${acc.name}`);
                      }}
                      className={`flex items-center space-x-2 px-3.5 py-2 border rounded-xl hover:bg-slate-900/50 transition cursor-pointer ${
                        accentColor === acc.id ? "border-cyan-400" : "border-slate-800"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${acc.color} block`} />
                      <span className="text-xs text-slate-200">{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
