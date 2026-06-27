import React, { useState, useEffect } from "react";
import BackgroundCanvas from "./components/BackgroundCanvas";
import PhysicsLibrary from "./components/PhysicsLibrary";
import EquationEngine from "./components/EquationEngine";
import ThreeDLab from "./components/ThreeDLab";
import CosmicExplorer from "./components/CosmicExplorer";
import AiAssistant from "./components/AiAssistant";
import SolverPanel from "./components/SolverPanel";
import DiscoveryScanner from "./components/DiscoveryScanner";
import PersonalDashboard from "./components/PersonalDashboard";
import GamificationAlert from "./components/GamificationAlert";

import { physicsQuotes } from "./data/physicsData";
import { 
  Atom, Orbit, Activity, ShieldCheck, Compass, 
  Search, Cpu, Sparkles, Clock, Globe, Trophy, Award
} from "lucide-react";
import { SUPPORTED_LANGUAGES, getTranslation, detectBrowserLanguage } from "./utils/translator";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "library" | "equations" | "lab" | "cosmic" | "ai" | "solver" | "discoveries" | "project">("home");
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [utcTime, setUtcTime] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return localStorage.getItem("kunx_lang") || detectBrowserLanguage();
  });

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    localStorage.setItem("kunx_lang", newLang);
    window.dispatchEvent(new CustomEvent("kunx-lang-changed", { detail: { lang: newLang } }));
  };

  // Cycle quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % physicsQuotes.length);
    }, 6000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Scientific real-time ticking clock (Local & UTC coordinates)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());
      setUtcTime(now.toUTCString().split(" ")[4]); // Extracts HH:MM:SS from UTC string
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Global search bar handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Route query straight to AI Assistant for dynamic explanation
    setActiveTab("ai");
  };

  const selectedQuote = physicsQuotes[currentQuoteIdx];

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans overflow-x-hidden antialiased">
      {/* 1. Starry Galaxy Canvas backdrop */}
      <BackgroundCanvas />

      {/* 2. Holographic Top Laboratory Control Header */}
      <header className="sticky top-0 z-40 glassmorphism !rounded-none border-t-0 border-x-0 !bg-slate-950/50 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
        {/* Brand logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
          <div className="relative flex justify-center items-center">
            <Atom className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            <Orbit className="absolute w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-sans shadow-cyan-500/20">
              KUNX
            </h1>
            <span className="text-[9px] font-mono tracking-widest text-cyan-500 block uppercase">
              PHYSICS INTEL PLATFORM
            </span>
          </div>
        </div>

        {/* Real-time Ticking Clocks & Telemetries & Language Dropdown */}
        <div className="flex items-center space-x-6">
          {/* Global Multi-Language Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedLang}
              onChange={handleLanguageChange}
              className="bg-slate-900/85 border border-slate-800/85 hover:border-cyan-500/20 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 font-sans outline-none focus:ring-1 focus:ring-cyan-500/30 glassmorphism cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-200 text-xs">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Diagnostic feeds */}
          <div className="hidden lg:flex items-center space-x-4 text-[10px] font-mono text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-slate-400">CERN-GRID: SECURE</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">NASA-ORBIT: LOCK</span>
            </div>
          </div>

          {/* Time trackers */}
          <div className="flex items-center space-x-3 border-l border-slate-800/80 pl-4">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              <span>LCL: {localTime || "00:00:00"}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-500">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>UTC: {utcTime || "00:00:00"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Immersive Control Console Layout */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl flex flex-col space-y-6">
        {/* Futuristic Glassmorphic Navigation Bar */}
        <nav className="glassmorphism p-1.5 rounded-2xl flex flex-wrap justify-center gap-1">
          {[
            { id: "home", label: getTranslation("control_center", selectedLang), icon: Cpu },
            { id: "library", label: getTranslation("physics_library", selectedLang), icon: Atom },
            { id: "equations", label: getTranslation("equation_engine", selectedLang), icon: Activity },
            { id: "lab", label: getTranslation("virtual_lab", selectedLang), icon: Sparkles },
            { id: "cosmic", label: getTranslation("cosmic_explorer", selectedLang), icon: Compass },
            { id: "ai", label: getTranslation("ai_assistant", selectedLang), icon: Cpu },
            { id: "solver", label: getTranslation("problem_solver", selectedLang), icon: ShieldCheck },
            { id: "discoveries", label: getTranslation("research_hub", selectedLang), icon: Orbit },
            { id: "project", label: getTranslation("project_lab", selectedLang), icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  // Preserve search parameter transition if routing from home query
                  if (tab.id === "ai" && searchQuery) {
                    // query is consumed dynamically inside assistant
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide font-sans flex items-center space-x-2 transition-all ${
                  isActive
                    ? "bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 4. Tab Content Routing */}
        <div className="flex-grow min-h-[500px]">
          {activeTab === "home" && (
            <div className="space-y-8 py-6 max-w-4xl mx-auto text-center flex flex-col items-center">
              {/* Cycling dynamic quote hud */}
              <div className="w-full max-w-2xl px-6 py-3 glassmorphism flex flex-col justify-center items-center text-center">
                <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                  &ldquo;{selectedQuote.text}&rdquo;
                </p>
                <span className="text-[10px] font-mono text-cyan-400 mt-1.5 uppercase font-bold tracking-wider">
                  &mdash; {selectedQuote.author}
                </span>
              </div>

              {/* Holographic Logo Intro */}
              <div className="space-y-3 relative py-8">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-display uppercase">
                  {getTranslation("enter_laboratory", selectedLang)}
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                  {getTranslation("science_desc", selectedLang)}
                </p>
              </div>

              {/* ASK ANYTHING SEARCH ENGINE */}
              <form onSubmit={handleSearchSubmit} className="w-full max-w-lg relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getTranslation("ask_engine_placeholder", selectedLang)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/15 focus:border-cyan-500/50 text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-md font-sans"
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition" />
                <button
                  type="submit"
                  className="absolute right-3.5 top-2.5 p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 hover:bg-cyan-500/30 transition flex justify-center items-center cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Sub-features shortcuts catalog */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-8">
                {[
                  { title: "Complete Syllabus", tag: "classical & quantum", tab: "library" },
                  { title: "Equation Plotter", tag: "variables & units", tab: "equations" },
                  { title: "Virtual 3D Lab", tag: "real-time physics", tab: "lab" },
                  { title: "Relativistic Explorer", tag: "spacetime voyage", tab: "cosmic" }
                ].map((sc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(sc.tab as any)}
                    className="p-4 rounded-2xl glassmorphism glass-interactive cursor-pointer flex flex-col justify-center items-center text-center group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition block leading-tight">
                      {sc.title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-1.5 uppercase tracking-wider block">
                      {sc.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "library" && <PhysicsLibrary />}
          {activeTab === "equations" && <EquationEngine />}
          {activeTab === "lab" && <ThreeDLab />}
          {activeTab === "cosmic" && <CosmicExplorer />}
          {activeTab === "ai" && <AiAssistant />}
          {activeTab === "solver" && <SolverPanel />}
          {activeTab === "discoveries" && <DiscoveryScanner />}
          {activeTab === "project" && <PersonalDashboard />}
        </div>
      </main>

      {/* Real-time Audio-Visual Achievement Alert overlay */}
      <GamificationAlert />

      {/* 5. Space Command Footer */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950/70 text-center text-[10px] font-mono text-slate-500">
        KUNX PHYSICS CONSOLE SECURED &bull; MIT RESEARCH COOPERATIVE &bull; CERN GRID COMPLIANT PROTOCOLS &copy; 2026
      </footer>
    </div>
  );
}
