import { useState } from "react";
import { glossaryTerms } from "../data/glossaryData";
import { GlossaryTerm } from "../types";
import { Volume2, Search, HelpCircle, Sparkles, Filter, RefreshCw, X } from "lucide-react";
import { triggerAction } from "../utils/gamification";

export default function PhysicsGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  
  // Audio state
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [playingTerm, setPlayingTerm] = useState<string | null>(null);

  // Categories extraction
  const categories = ["ALL", ...Array.from(new Set(glossaryTerms.map((t) => t.category)))];
  
  // Alphabet extraction based on existing terms
  const letters = ["ALL", ...Array.from(new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()))).sort()];

  // Filter Logic
  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch = 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.funFact.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLetter = 
      selectedLetter === "ALL" || 
      term.term[0].toUpperCase() === selectedLetter;
      
    const matchesCategory = 
      selectedCategory === "ALL" || 
      term.category === selectedCategory;

    return matchesSearch && matchesLetter && matchesCategory;
  });

  // AI & Local Pronunciation triggers
  const handlePronounce = async (termObj: GlossaryTerm) => {
    if (audioLoading || playingTerm) return;
    
    setAudioLoading(termObj.term);
    
    try {
      const res = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: `Pronunciation guide: ${termObj.term}. Spoken as: ${termObj.phonetic}. Definition: ${termObj.definition}`
        })
      });
      
      const data = await res.json();
      
      if (data.audio) {
        let mimeType = data.mimeType || "audio/mpeg";
        if (mimeType === "audio/mp3") {
          mimeType = "audio/mpeg";
        }
        const audio = new Audio(`data:${mimeType};base64,${data.audio}`);
        setAudioLoading(null);
        setPlayingTerm(termObj.term);
        triggerAction("read_glossary");
        audio.onended = () => setPlayingTerm(null);
        audio.onerror = () => {
          setPlayingTerm(null);
          fallbackSpeech(termObj);
        };
        audio.play().catch((err) => {
          console.warn("Audio play() promise rejected, falling back:", err);
          setPlayingTerm(null);
          fallbackSpeech(termObj);
        });
      } else {
        throw new Error("No audio payload returned");
      }
    } catch (err) {
      console.warn("Gemini TTS pronunciation failed or was rate limited, triggering native browser TTS fallback...");
      setAudioLoading(null);
      fallbackSpeech(termObj);
    }
  };

  // Zero-quota native browser SpeechSynthesis fallback
  const fallbackSpeech = (termObj: GlossaryTerm) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Text-to-speech is not supported by your browser.");
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(termObj.term);
    triggerAction("read_glossary");
    
    // Find an English scientific sounding voice if possible
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Natural")) || 
                         voices.find(v => v.lang.includes("en")) || 
                         voices[0];
    
    if (premiumVoice) utterance.voice = premiumVoice;
    utterance.rate = 0.85; // Slightly slower for clear instruction
    
    utterance.onstart = () => setPlayingTerm(termObj.term);
    utterance.onend = () => setPlayingTerm(null);
    utterance.onerror = () => setPlayingTerm(null);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Glossary Controls panel */}
      <div className="p-5 rounded-2xl glassmorphism border border-cyan-500/10 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-sans font-extrabold text-white tracking-wider">
                PHYSICS TERMINOLOGY CORE
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Interactive database of fundamental laws, metrics, and equations with high-fidelity phonetic guides.
            </p>
          </div>

          {/* Reset Filters action */}
          {(searchTerm || selectedLetter !== "ALL" || selectedCategory !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLetter("ALL");
                setSelectedCategory("ALL");
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono hover:bg-cyan-500/25 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter Locks</span>
            </button>
          )}
        </div>

        {/* Search & Category Select Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search terms, definitions, or fun facts (e.g. 'Bose-Einstein' or 'Blue light')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/40 border border-white/10 focus:border-cyan-500/50 text-xs text-white placeholder-slate-400 focus:outline-none transition"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          </div>

          {/* Category Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-950 text-slate-200">
                  {cat === "ALL" ? "All Fields / Categories" : cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* A-Z Index Selection bar */}
        <div className="border-t border-slate-900 pt-3">
          <span className="text-[9px] font-mono text-cyan-500 block uppercase tracking-widest mb-2">
            Alphabetical Quick Index
          </span>
          <div className="flex flex-wrap gap-1">
            {letters.map((letItem) => (
              <button
                key={letItem}
                onClick={() => setSelectedLetter(letItem)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all border ${
                  selectedLetter === letItem
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {letItem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Glossary grid or fallback */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((item) => {
            const isLoading = audioLoading === item.term;
            const isPlaying = playingTerm === item.term;

            return (
              <div
                key={item.term}
                className="p-5 rounded-2xl glassmorphism glass-interactive border border-white/5 flex flex-col justify-between space-y-4 group"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 uppercase tracking-wider font-bold">
                      {item.category}
                    </span>
                    
                    {/* Speaker trigger button */}
                    <button
                      onClick={() => handlePronounce(item)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isPlaying
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse scale-105 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                          : isLoading
                          ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/20"
                      }`}
                      title="AI Phonetic Pronunciation Audio"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-md font-sans font-bold text-white tracking-wide group-hover:text-cyan-200 transition">
                      {item.term}
                    </h4>
                    
                    {/* Phonetic Pronunciation helper */}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/20 px-1.5 py-0.5 rounded">
                        {item.phonetic}
                      </span>
                      <span className="text-[10px] font-sans text-slate-400 italic">
                        {item.ipa}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Short scientific definition */}
                <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                  {item.definition}
                </p>

                {/* Fact drawer trigger / viewer */}
                <div className="border-t border-slate-900 pt-3">
                  <button
                    onClick={() => setActiveTerm(activeTerm?.term === item.term ? null : item)}
                    className="text-[10px] font-mono text-purple-400 hover:text-purple-300 transition flex items-center space-x-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{activeTerm?.term === item.term ? "Hide Science Fact" : "Did you know?"}</span>
                  </button>

                  {activeTerm?.term === item.term && (
                    <div className="mt-2.5 p-3 rounded-xl bg-purple-950/20 border border-purple-500/15 text-[11px] text-slate-300 leading-relaxed font-sans animate-fade-in">
                      <span className="font-bold text-purple-400 block mb-1">Scientific Context:</span>
                      {item.funFact}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl glassmorphism border border-white/5 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white font-sans">No physics terms found matching filter</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Try adjusting your search keywords, switching the category field, or toggling back to "ALL" letters.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedLetter("ALL");
              setSelectedCategory("ALL");
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/30 transition cursor-pointer"
          >
            Reset Database Scanners
          </button>
        </div>
      )}
    </div>
  );
}
