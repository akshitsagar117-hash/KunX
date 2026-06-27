import { useState, useEffect, useRef } from "react";
import { physicsEquations } from "../data/physicsData";
import { Calculator, Milestone, Eye, Lightbulb, LineChart, Cpu, ChevronRight } from "lucide-react";

export default function EquationEngine() {
  const [selectedEqId, setSelectedEqId] = useState("mass-energy");
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);

  const selectedEq = physicsEquations.find((eq) => eq.id === selectedEqId) || physicsEquations[0];

  // Set default calculator variables when selected equation changes
  useEffect(() => {
    const defaults: Record<string, number> = {};
    selectedEq.calculator.inputs.forEach((input) => {
      defaults[input.symbol] = input.defaultValue;
    });
    setInputs(defaults);
  }, [selectedEqId]);

  // Handle variable change
  const handleInputChange = (symbol: string, val: number) => {
    setInputs((prev) => ({ ...prev, [symbol]: val }));
  };

  // Render mathematical graph curve on canvas
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and set background
    ctx.fillStyle = "#010008";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const padding = 45;

    // Draw axis lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding); // X Axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding); // Y Axis
    ctx.stroke();

    // Plot mathematical curves depending on the active equation
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const graphSteps = 100;
    const plotWidth = w - padding * 2;
    const plotHeight = h - padding * 2;

    for (let i = 0; i <= graphSteps; i++) {
      const pct = i / graphSteps;
      
      // Compute mathematical values for the graph curve
      let mathX = 0;
      let mathY = 0;

      if (selectedEq.id === "mass-energy") {
        // E = m * c^2 (Linear curve relative to mass m)
        // X ranges from 0 to 10 kg
        const m = pct * 10;
        const c = 299792458;
        mathX = m;
        mathY = m * c * c;
      } else if (selectedEq.id === "newton-second") {
        // F = m * a (Linear curve relative to mass m at constant acceleration)
        const m = pct * 50;
        const a = inputs.a || 9.81;
        mathX = m;
        mathY = m * a;
      } else if (selectedEq.id === "schrodinger-time") {
        // En = (n^2 * h^2) / (8 * m * L^2)
        // curve vs Width L
        const L = 0.1 + pct * 2.5; // nm
        const n = inputs.n || 1;
        const h = 6.626e-34;
        const m = 9.109e-31;
        const L_meters = L * 1e-9;
        const energyJoules = (n * n * h * h) / (8 * m * L_meters * L_meters);
        mathX = L;
        mathY = energyJoules / 1.602e-19; // eV
      } else if (selectedEq.id === "gravitational-law") {
        // F = G * m1 * m2 / r^2 (Inverse-square decay curve)
        // Plot vs distance r (x-axis)
        const r = 50000 + pct * 800000; // km
        const G = 6.6743e-11;
        const m1 = (inputs.m1 || 5.97) * 1e24;
        const m2 = (inputs.m2 || 7.34) * 1e22;
        mathX = r;
        mathY = (G * m1 * m2) / Math.pow(r * 1000, 2);
      } else if (selectedEq.id === "time-dilation-eq") {
        // t' = t / sqrt(1 - v^2/c^2) (Hyperbolic upward asymptotic relativistic curve)
        const vRatio = pct * 0.96; // up to 96% of c
        const t = inputs.t || 1;
        mathX = vRatio;
        mathY = t / Math.sqrt(1 - vRatio * vRatio);
      }

      // Convert mathematical coordinates to canvas viewport coords
      const xPos = padding + pct * plotWidth;
      
      // Normalize Y coordinate scaling to fit graph area beautifully
      let normY = 0;
      if (selectedEq.id === "mass-energy") {
        normY = mathY / (10 * 299792458 * 299792458);
      } else if (selectedEq.id === "newton-second") {
        normY = mathY / (50 * (inputs.a || 9.81));
      } else if (selectedEq.id === "schrodinger-time") {
        // Caps very high values
        const maxLimit = 150;
        normY = Math.min(maxLimit, mathY) / maxLimit;
      } else if (selectedEq.id === "gravitational-law") {
        const maxForce = 5e21; // earth moon level force
        normY = Math.min(maxForce, mathY) / maxForce;
      } else if (selectedEq.id === "time-dilation-eq") {
        normY = Math.min(10, mathY) / 10;
      }

      const yPos = h - padding - normY * plotHeight;

      if (i === 0) ctx.moveTo(xPos, yPos);
      else ctx.lineTo(xPos, yPos);
    }
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "9px monospace";
    
    // Y-Axis label
    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    let yLabel = "Value";
    if (selectedEq.id === "mass-energy") yLabel = "Energy (E) [J]";
    else if (selectedEq.id === "newton-second") yLabel = "Force (F) [N]";
    else if (selectedEq.id === "schrodinger-time") yLabel = "Energy En [eV]";
    else if (selectedEq.id === "gravitational-law") yLabel = "Attractive Force F_g [N]";
    else if (selectedEq.id === "time-dilation-eq") yLabel = "Relative Time t' [Yrs]";
    ctx.fillText(yLabel, -20, 0);
    ctx.restore();

    // X-Axis label
    let xLabel = "Variable";
    if (selectedEq.id === "mass-energy") xLabel = "Mass (m) [kg]";
    else if (selectedEq.id === "newton-second") xLabel = "Mass (m) [kg]";
    else if (selectedEq.id === "schrodinger-time") xLabel = "Width L [nm]";
    else if (selectedEq.id === "gravitational-law") xLabel = "Radius Distance r [km]";
    else if (selectedEq.id === "time-dilation-eq") xLabel = "Velocity ratio v/c";
    ctx.fillText(xLabel, w / 2 - 30, h - 12);

  }, [selectedEqId, inputs]);

  // Compute the exact mathematical output
  const outputValue = selectedEq.calculator.calculateFn(inputs);

  return (
    <div id="equation-engine-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar Equation catalog */}
      <div className="bg-black/45 border border-slate-800 rounded-2xl p-5 glassmorphism h-fit space-y-3">
        <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Equation Repository</span>
        </h3>
        <div className="space-y-2">
          {physicsEquations.map((eq) => {
            const isActive = selectedEqId === eq.id;
            return (
              <button
                key={eq.id}
                onClick={() => setSelectedEqId(eq.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex justify-between items-center ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-400/80 text-white shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                    : "bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <div>
                  <span className="font-semibold text-sm block">{eq.title}</span>
                  <span className="text-[11px] font-mono text-cyan-400">{eq.formula}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition ${isActive ? "text-cyan-400" : "text-slate-600"}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main interactive Calculator panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-950/45 border border-cyan-500/20 rounded-2xl p-6 glassmorphism flex flex-col md:flex-row gap-6">
          {/* Inputs Section */}
          <div className="flex-grow space-y-6">
            <div className="flex items-start space-x-3 border-b border-slate-800 pb-4">
              <Calculator className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <span className="text-xs font-mono text-cyan-500 block">DYNAMIC CALCULATOR</span>
                <h3 className="text-lg font-sans font-bold text-white tracking-wide leading-tight">
                  {selectedEq.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic">{selectedEq.meaning}</p>

            <div className="space-y-5">
              {selectedEq.calculator.inputs.map((input) => (
                <div key={input.symbol} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      {input.name} (<span className="text-cyan-400 font-bold">{input.symbol}</span>)
                    </span>
                    <span className="text-white">
                      {inputs[input.symbol]?.toLocaleString() || input.defaultValue} {input.unit}
                    </span>
                  </div>
                  
                  {/* Slider controls */}
                  <input
                    type="range"
                    min={input.symbol === "v_ratio" ? "0.0" : input.symbol === "beta" ? "0" : "0.1"}
                    max={
                      input.symbol === "v_ratio"
                        ? "0.99"
                        : input.symbol === "L"
                        ? "5"
                        : input.symbol === "m"
                        ? "100"
                        : input.symbol === "m1"
                        ? "10"
                        : input.symbol === "m2"
                        ? "10"
                        : "500000"
                    }
                    step={input.symbol === "v_ratio" ? "0.01" : "0.1"}
                    value={inputs[input.symbol] ?? input.defaultValue}
                    onChange={(e) => handleInputChange(input.symbol, parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-900 h-1 rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Compiled Output HUD */}
            <div className="mt-6 bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-center items-center">
              <span className="text-[10px] font-mono text-cyan-400 block tracking-widest uppercase mb-1">
                Computed {selectedEq.calculator.outputName} ({selectedEq.calculator.outputSymbol})
              </span>
              <span className="text-2xl font-mono font-extrabold text-white tracking-tight text-center">
                {outputValue === Infinity
                  ? "∞ (Singularity)"
                  : outputValue > 1e12
                  ? outputValue.toExponential(6)
                  : outputValue.toFixed(4)}{" "}
                <span className="text-xs text-cyan-400 font-normal">{selectedEq.calculator.outputUnit}</span>
              </span>
            </div>
          </div>

          {/* Graphical Plotter */}
          <div className="flex flex-col items-center min-w-[280px] bg-slate-950/70 border border-slate-900 rounded-xl p-4">
            <h4 className="text-xs font-mono text-slate-400 flex items-center space-x-1.5 mb-3 self-start">
              <LineChart className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-time Functional Graph</span>
            </h4>
            <canvas
              ref={graphCanvasRef}
              width={260}
              height={200}
              className="w-full h-[200px] bg-black border border-slate-900/60 rounded-lg"
            />
            <span className="text-[10px] font-mono text-slate-500 mt-2 text-center">
              Response Curve relative to variable parameter shifting
            </span>
          </div>
        </div>

        {/* Math Derivation and application info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/50 border border-slate-900 p-5 rounded-2xl glassmorphism space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 flex items-center space-x-1.5">
              <Milestone className="w-4 h-4" />
              <span>Mathematical Derivation</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedEq.derivation}</p>
          </div>

          <div className="bg-black/50 border border-slate-900 p-5 rounded-2xl glassmorphism space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>CERN / NASA Real Application</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedEq.realLifeExample}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
