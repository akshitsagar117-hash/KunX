import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, User, Volume2, Sparkles, Network, RefreshCw, Layers } from "lucide-react";
import { triggerAction } from "../utils/gamification";

interface MindMapNode {
  id: string;
  label: string;
  description: string;
  group: string;
}

interface MindMapEdge {
  from: string;
  to: string;
  label: string;
}

interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Awaiting inputs, researcher. I am the specialized KunX AI Assistant, grounded by CERN, MIT, and NASA data repositories. I can formulate derivations, analyze quantum matrices, summarize papers, or compile interactive mind maps. How shall we proceed?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mindMap, setMindMap] = useState<MindMapData | null>(null);
  const [isGeneratingMindmap, setIsGeneratingMindmap] = useState(false);
  const [narratingMsgId, setNarratingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    triggerAction("ask_ai");

    try {
      const res = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: userMsg.content,
          branch: "AI Assistant",
          mode: "Expert Mode"
        }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.content || "Connection lost. Please ensure your Gemini API key is configured.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "System alert: Gemini connection error. Please verify your GEMINI_API_KEY inside the Secrets panel.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate dynamic mindmap using Gemini
  const generateMindMap = async (topic: string) => {
    setIsGeneratingMindmap(true);
    setMindMap(null);
    try {
      const res = await fetch("/api/gemini/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.nodes && data.edges) {
        setMindMap(data);
      }
    } catch (err) {
      console.error("Mindmap generation failed", err);
    } finally {
      setIsGeneratingMindmap(false);
    }
  };

  // Play narration of AI response
  const speakMessage = async (msgId: string, text: string) => {
    if (narratingMsgId === msgId) {
      setNarratingMsgId(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }
    setNarratingMsgId(msgId);

    const cleanText = text.substring(0, 450);

    try {
      const res = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
      });
      const data = await res.json();
      if (data.audio) {
        let mimeType = data.mimeType || "audio/mpeg";
        if (mimeType === "audio/mp3") {
          mimeType = "audio/mpeg";
        }
        const audio = new Audio(`data:${mimeType};base64,${data.audio}`);
        audio.onended = () => setNarratingMsgId(null);
        audio.onerror = () => {
          setNarratingMsgId(null);
          fallbackSpeech(cleanText, msgId);
        };
        audio.play().catch((err) => {
          console.warn("Audio play() promise rejected, falling back:", err);
          setNarratingMsgId(null);
          fallbackSpeech(cleanText, msgId);
        });
      } else {
        throw new Error("No audio payload");
      }
    } catch (err) {
      console.warn("Gemini TTS failed, falling back to browser speech synthesis...");
      fallbackSpeech(cleanText, msgId);
    }
  };

  const fallbackSpeech = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      setNarratingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setNarratingMsgId(null);
    utterance.onerror = () => setNarratingMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="ai-assistant-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dynamic Conceptual Mind Map Card */}
      <div className="lg:col-span-1 bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Interactive Concept Graph</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Select a core physical term to build a dynamic relationship nodes network, mapping connected derivations.
          </p>

          <div className="grid grid-cols-2 gap-2 border-b border-slate-800/80 pb-4 mb-4">
            {(["Quantum Entanglement", "General Relativity", "Plasma Fusion", "Lagrangian Mechanics"] as const).map((term) => (
              <button
                key={term}
                onClick={() => generateMindMap(term)}
                className="px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left text-[11px] font-sans font-semibold text-slate-300 hover:text-white transition"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Mindmap display portal */}
          {isGeneratingMindmap && (
            <div className="flex flex-col justify-center items-center h-48 border border-slate-800/60 rounded-xl bg-black/40">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <span className="text-[10px] font-mono text-cyan-300 animate-pulse uppercase tracking-wider">
                COMPILING FIELD METRICS...
              </span>
            </div>
          )}

          {mindMap && (
            <div className="relative border border-cyan-500/10 rounded-xl p-4 bg-black/50 overflow-hidden">
              <span className="text-[9px] font-mono text-cyan-400 block mb-2 uppercase tracking-widest">
                CONCEPT CONNECTIONS GRAPH
              </span>
              
              {/* Concept nodes visual map */}
              <div className="flex flex-wrap gap-2 justify-center max-h-[250px] overflow-y-auto">
                {mindMap.nodes.map((node) => (
                  <div
                    key={node.id}
                    title={node.description}
                    className="p-2.5 rounded-lg border bg-slate-950 border-slate-800 text-[10px] hover:border-cyan-400 font-sans cursor-pointer transition max-w-[120px]"
                  >
                    <span className="font-bold text-white block truncate">{node.label}</span>
                    <span className="text-[9px] font-mono text-slate-500 capitalize">{node.group}</span>
                  </div>
                ))}
              </div>

              {/* Edge Connections List */}
              <div className="mt-4 border-t border-slate-800/80 pt-3 space-y-1">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Relationships</span>
                <div className="max-h-[80px] overflow-y-auto space-y-1">
                  {mindMap.edges.slice(0, 4).map((edge, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{edge.from}</span>
                      <span className="text-cyan-400 italic">({edge.label})</span>
                      <span>{edge.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!mindMap && !isGeneratingMindmap && (
            <div className="flex flex-col justify-center items-center h-48 border border-slate-850 rounded-xl bg-slate-900/10">
              <Layers className="w-8 h-8 text-slate-600 mb-2" />
              <span className="text-[10px] font-mono text-slate-500 uppercase">Awaiting concept command...</span>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500 leading-tight">
          Calculations are grounded on direct arXiv, DOI registries, and academic transcripts.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-2 bg-slate-950/45 border border-cyan-500/15 rounded-2xl flex flex-col h-[520px] glassmorphism overflow-hidden">
        {/* Holographic Header */}
        <div className="p-4 border-b border-cyan-500/10 bg-cyan-950/20 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono text-cyan-400 block uppercase">QUANTUM CORE</span>
              <h3 className="text-sm font-sans font-bold text-white leading-tight">Physics Intelligence Assistant</h3>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded uppercase">
            Model: gemini-3.1-pro
          </span>
        </div>

        {/* Message Logs */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex space-x-3 max-w-[85%] ${isAI ? "self-start" : "ml-auto flex-row-reverse space-x-reverse"}`}
              >
                {/* Avatar */}
                <div className={`p-2 rounded-xl h-fit border flex-shrink-0 ${isAI ? "bg-cyan-950/50 border-cyan-500/30 text-cyan-400" : "bg-slate-900 border-slate-850 text-white"}`}>
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-3.5 rounded-2xl relative ${
                  isAI
                    ? "bg-slate-950 border border-slate-900 text-slate-100 rounded-tl-none"
                    : "bg-cyan-500/10 border border-cyan-400/40 text-slate-200 rounded-tr-none"
                }`}>
                  <p className="text-xs font-sans leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {isAI && (
                    <div className="mt-2.5 pt-2 border-t border-slate-900/60 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-500">{msg.timestamp}</span>
                      
                      {/* Hear audio narrator */}
                      <button
                        onClick={() => speakMessage(msg.id, msg.content)}
                        className={`p-1.5 rounded bg-slate-900/80 border text-[9px] font-mono flex items-center space-x-1 transition ${
                          narratingMsgId === msg.id
                            ? "border-cyan-400 text-cyan-300 animate-pulse"
                            : "border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{narratingMsgId === msg.id ? "Playing..." : "Voice Narrator"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 rounded-xl h-fit">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-slate-950 border border-slate-900 text-slate-400 rounded-2xl rounded-tl-none">
                <span className="text-[10px] font-mono tracking-widest animate-pulse">
                  SOLVING QUANTUM EQUATION MATRIX...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-900 bg-slate-950/60 flex space-x-2">
          <input
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask: 'Derive Einstein rest energy' or 'How quantum entanglement breaches local realism'..."
            className="flex-grow px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-3 bg-cyan-500/20 border border-cyan-400 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition flex justify-center items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
