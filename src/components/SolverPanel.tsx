import React, { useState } from "react";
import { Upload, HelpCircle, GraduationCap, FileText, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react";
import { triggerAction } from "../utils/gamification";

interface ProblemTemplate {
  name: string;
  query: string;
  previewText: string;
  difficulty: "Academic" | "College" | "PhD";
  field: string;
}

const problemTemplates: ProblemTemplate[] = [
  {
    name: "Lagrangian Double Pendulum",
    query: "Formulate the Euler-Lagrange equations of motion for a double pendulum consisting of two massless rods of length L1, L2 and masses m1, m2. Derive the generalized coordinates.",
    previewText: "Double Pendulum: rods L1, L2, masses m1, m2. Standard coordinate constraints. Set up Lagrangian L = T - V.",
    difficulty: "College",
    field: "Classical Mechanics"
  },
  {
    name: "Quantum Harmonic Oscillator Wavefunction",
    query: "Solve the time-independent Schrödinger equation for a 1D quantum harmonic oscillator with potential V(x) = 1/2 m w^2 x^2. Find the ground state wavefunction and proof energy quantization En = (n + 1/2) h_bar w.",
    previewText: "Potential V(x) = 1/2 m w^2 x^2. Solve H psi = E psi. Proof quantization parameters.",
    difficulty: "PhD",
    field: "Quantum Physics"
  },
  {
    name: "Event Horizon Schwarzschild calculation",
    query: "Calculate the Schwarzschild Event Horizon radius (Rs) and average density inside Rs of a supermassive black hole candidate with a mass of 4.3 million Solar masses (e.g. Sagittarius A*). Mass of Sun M_solar = 1.989e30 kg.",
    previewText: "M = 4.3e6 Solar Masses. Find Rs = 2GM/c2. Find Schwarzschild volumetric density limit.",
    difficulty: "Academic",
    field: "General Relativity"
  }
];

export default function SolverPanel() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProblemTemplate | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [isSolving, setIsSolving] = useState(false);
  const [solutionOutput, setSolutionOutput] = useState<string | null>(null);

  // Handle uploaded files base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setSelectedTemplate(null);
    };
    reader.readAsDataURL(file);
  };

  const executeSolve = async () => {
    const finalQuery = selectedTemplate ? selectedTemplate.query : customQuery;
    if (!finalQuery && !uploadedImage) return;

    setIsSolving(true);
    setSolutionOutput(null);
    triggerAction("solve_problem");

    try {
      // Strip base64 prefix
      let rawBase64 = null;
      if (uploadedImage) {
        rawBase64 = uploadedImage.split(",")[1];
      }

      const res = await fetch("/api/gemini/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          imageBase64: rawBase64,
          mimeType,
        }),
      });

      const data = await res.json();
      setSolutionOutput(data.content || "Could not resolve solution.");
    } catch (err) {
      console.error(err);
      setSolutionOutput("System failure: Could not link up with Gemini Solver core. Verify that your GEMINI_API_KEY environment variable is configured correctly.");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div id="solver-panel-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Inputs area */}
      <div className="space-y-4">
        {/* Templates selector */}
        <div className="bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Select Template Notebook</span>
          </h3>
          <div className="space-y-2">
            {problemTemplates.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => {
                  setSelectedTemplate(tpl);
                  setUploadedImage(null);
                  setCustomQuery("");
                }}
                className={`w-full p-3 rounded-xl border text-left transition flex justify-between items-center ${
                  selectedTemplate?.name === tpl.name
                    ? "bg-cyan-500/10 border-cyan-400/80 text-white"
                    : "bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <div>
                  <span className="font-semibold text-xs block">{tpl.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">Field: {tpl.field}</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 uppercase">
                  {tpl.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* OCR / Handwritten notes uploader card */}
        <div className="bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism space-y-4">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Handwritten Notes Upload</span>
          </h3>

          <div className="relative border border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-cyan-500/35 transition cursor-pointer bg-black/30">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <span className="text-xs text-slate-300 block font-medium">Upload Problem Image</span>
            <span className="text-[10px] text-slate-500 mt-1 block">Supports PNG, JPEG, PDF snapshots</span>
          </div>

          {uploadedImage && (
            <div className="border border-slate-800 rounded-xl p-3 bg-black/40">
              <span className="text-[9px] font-mono text-slate-500 block mb-2">Image Preview Captured</span>
              <img src={uploadedImage} alt="Uploaded notes" className="max-h-24 mx-auto rounded border border-slate-800" />
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Manual Problem formulation</span>
            <textarea
              value={customQuery}
              onChange={(e) => {
                setCustomQuery(e.target.value);
                setSelectedTemplate(null);
              }}
              placeholder="Or type your custom mechanics, relativity, or quantum matrix problem here in plain text..."
              className="w-full h-24 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          <button
            onClick={executeSolve}
            disabled={isSolving || (!customQuery && !selectedTemplate && !uploadedImage)}
            className="w-full py-3 bg-cyan-500/20 border border-cyan-400 rounded-xl text-cyan-300 hover:bg-cyan-500/30 font-mono text-xs font-semibold tracking-wider transition uppercase"
          >
            {isSolving ? "Processing Matrix Solver..." : "Initiate AI Solver"}
          </button>
        </div>
      </div>

      {/* Solutions result page */}
      <div className="lg:col-span-2 flex flex-col bg-slate-950/45 border border-cyan-500/15 rounded-2xl p-6 glassmorphism min-h-[400px]">
        <div className="border-b border-slate-900 pb-4 mb-4 flex justify-between items-center">
          <div>
            <span className="text-xs font-mono text-cyan-500 block uppercase">MATRIX EVALUATION LOGS</span>
            <h3 className="text-md font-sans font-bold text-white tracking-wide leading-none">
              Derivation & Proof Analysis
            </h3>
          </div>
          {isSolving && (
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
          )}
        </div>

        {/* Solution Body */}
        <div className="flex-grow overflow-y-auto space-y-4">
          {solutionOutput ? (
            <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text markdown-body bg-black/20 p-4 border border-slate-900 rounded-xl">
              {solutionOutput}
            </div>
          ) : isSolving ? (
            <div className="flex flex-col justify-center items-center h-full py-20 text-center">
              <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
              <p className="text-sm text-cyan-300 font-mono tracking-widest animate-pulse uppercase">
                FORMULATING EULER-LAGRANGE DERIVATIONS...
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Scanning image vectors and aligning Hamiltonian state spaces...
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full py-20 text-slate-500 text-center border border-dashed border-slate-900 rounded-xl">
              <HelpCircle className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-xs font-mono uppercase">Awaiting physics problem parameters...</p>
              <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                Select a template physics derivation from the sidebar or upload a snapshot of your homework notes to start the solver.
              </p>
            </div>
          )}
        </div>

        {/* Safety notification */}
        <div className="mt-4 border-t border-slate-900 pt-3 flex items-start space-x-2 bg-slate-900/10 p-3 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span className="text-[10px] font-mono text-slate-400 leading-normal">
            KunX AI problem solver is tuned specifically for rigorous physics. Nonsensical inputs will trigger automatic safety containment overrides.
          </span>
        </div>
      </div>
    </div>
  );
}
