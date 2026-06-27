import { useState, useEffect, useRef } from "react";
import { cosmicNodes } from "../data/physicsData";
import { Space, Compass, ShieldAlert, Zap, Orbit, RefreshCw, Eye } from "lucide-react";

export default function CosmicExplorer() {
  const [selectedNodeId, setSelectedNodeId] = useState("earth");
  const [travelSpeed, setTravelSpeed] = useState<"sublight" | "light" | "warp" | "quantum">("light");
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelProgress, setTravelProgress] = useState(0);
  const [warpStars, setWarpStars] = useState<{ x: number; y: number; z: number }[]>([]);
  const [blackHoleVoyage, setBlackHoleVoyage] = useState(false);
  const [fallDistance, setFallDistance] = useState(0); // in km towards singularity

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedNode = cosmicNodes.find((n) => n.id === selectedNodeId) || cosmicNodes[0];

  // Initialize particles for warp drive / speed simulation
  useEffect(() => {
    const stars = Array.from({ length: 80 }).map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 800,
    }));
    setWarpStars(stars);
  }, []);

  // Canvas renderer for travel mode & node animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    const render = () => {
      ctx.fillStyle = "#020008";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 1. If actively traveling, draw Warp Speed Tunnel!
      if (isTraveling) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
        ctx.lineWidth = 1.5;

        warpStars.forEach((star) => {
          // Accelerate speed based on mode
          const multiplier = travelSpeed === "warp" ? 30 : travelSpeed === "light" ? 12 : 3;
          star.z -= multiplier;
          if (star.z <= 0) star.z = 800;

          const px = (star.x / star.z) * 400 + cx;
          const py = (star.y / star.z) * 400 + cy;

          // Draw stretching star lines
          if (px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
            const length = travelSpeed === "warp" ? 60 : travelSpeed === "light" ? 25 : 5;
            const pxPrev = (star.x / (star.z + length)) * 400 + cx;
            const pyPrev = (star.y / (star.z + length)) * 400 + cy;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(pxPrev, pyPrev);
            const alpha = Math.min(1, (800 - star.z) / 400);
            ctx.strokeStyle = travelSpeed === "warp" 
              ? `rgba(168, 85, 247, ${alpha})` 
              : `rgba(6, 182, 212, ${alpha})`;
            ctx.stroke();
          }
        });

        // Overlay quantum matrix code
        if (travelSpeed === "quantum") {
          ctx.fillStyle = "rgba(147, 51, 234, 0.15)";
          ctx.font = "11px monospace";
          ctx.fillText("ψ(x,t) QUANTUM SUPERPOSITION DECOHERENCE ACTIVE", 15, 30);
          ctx.fillText(`ENTANGLED STATE VECTOR COHERENT: ${Math.floor(travelProgress * 100)}%`, 15, 48);
        }

        frameId = requestAnimationFrame(render);
        return;
      }

      // 2. If in Black Hole voyage mode, draw Event Horizon gravitational warp!
      if (blackHoleVoyage) {
        angle += 0.02;

        // Draw distorted background space
        for (let r = 250; r > 30; r -= 15) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          const warpFactor = Math.sin(angle + r * 0.01) * 6;
          ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - r / 250)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Accretion Disk (spinning matter)
        ctx.beginPath();
        const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 140);
        grad.addColorStop(0, "rgba(0, 0, 0, 1)"); // Event horizon singularity
        grad.addColorStop(0.2, "rgba(249, 115, 22, 0.95)"); // Hot inner edge
        grad.addColorStop(0.5, "rgba(147, 51, 234, 0.45)"); // Gravitational shift
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Glowing singularity center
        ctx.beginPath();
        ctx.arc(cx, cy, 25, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Accretion disk matter sparks
        for (let i = 0; i < 30; i++) {
          const r = 40 + (i * 3) + Math.sin(angle * 2 + i) * 10;
          const theta = angle * (1 + (30 - i) * 0.05) + (i * Math.PI / 15);
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;
          ctx.fillStyle = i % 2 === 0 ? "#f97316" : "#a855f7";
          ctx.fillRect(px, py, 2, 2);
        }

        frameId = requestAnimationFrame(render);
        return;
      }

      // 3. Normal Mode: Draw Orbiting planets/galaxies
      angle += 0.005;
      
      // Draw selected object
      if (selectedNode.type === "planet") {
        // Body Sphere
        const radius = 65;
        const grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, radius);
        
        if (selectedNode.id === "earth") {
          grad.addColorStop(0, "#3b82f6"); // Deep blue
          grad.addColorStop(0.6, "#10b981"); // Land green
          grad.addColorStop(1, "#1e3a8a"); // Dark ocean
        } else if (selectedNode.id === "mars") {
          grad.addColorStop(0, "#ef4444"); // Mars red
          grad.addColorStop(0.7, "#b91c1c"); 
          grad.addColorStop(1, "#450a0a");
        } else {
          grad.addColorStop(0, "#f59e0b"); // Jupiter orange
          grad.addColorStop(0.5, "#d97706");
          grad.addColorStop(1, "#78350f");
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Atmosphere glow
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
        const atmos = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius + 8);
        atmos.addColorStop(0, "rgba(6, 182, 212, 0.5)");
        atmos.addColorStop(1, "rgba(6, 182, 212, 0)");
        ctx.fillStyle = atmos;
        ctx.fill();

        // Draw Moon Orbiting
        const mx = cx + Math.cos(angle * 2) * 120;
        const my = cy + Math.sin(angle * 2) * 60;
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#9ca3af";
        ctx.fill();
        ctx.shadowColor = "transparent";
      } else if (selectedNode.type === "blackhole") {
        // Draw Einstein Ring / Accretion Disk
        ctx.beginPath();
        const innerGlow = ctx.createRadialGradient(cx, cy, 15, cx, cy, 95);
        innerGlow.addColorStop(0, "#000000");
        innerGlow.addColorStop(0.2, "rgba(244,63,94,0.95)"); // Pink hot edge
        innerGlow.addColorStop(0.6, "rgba(147,51,234,0.3)");
        innerGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.arc(cx, cy, 95, 0, Math.PI * 2);
        ctx.fillStyle = innerGlow;
        ctx.fill();

        // Singularity core
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = "rgba(244,63,94,0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (selectedNode.type === "galaxy") {
        // Draw Spiral Galaxy arms
        for (let i = 0; i < 400; i++) {
          const dist = 5 + (i * 0.4);
          const theta = (i * 0.08) + angle;
          const px = cx + Math.cos(theta) * dist;
          const py = cy + Math.sin(theta) * dist;
          ctx.fillStyle = i % 2 === 0 ? "rgba(147, 51, 234, 0.55)" : "rgba(6, 182, 212, 0.55)";
          ctx.fillRect(px, py, 1.8, 1.8);
        }
        // Core glow
        ctx.beginPath();
        const galGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
        galGlow.addColorStop(0, "#ffffff");
        galGlow.addColorStop(0.3, "rgba(168, 85, 247, 0.45)");
        galGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fillStyle = galGlow;
        ctx.fill();
      } else {
        // Universe Scale / Big Bang
        ctx.beginPath();
        const uniGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 150);
        uniGlow.addColorStop(0, "#ffffff");
        uniGlow.addColorStop(0.1, "#6366f1");
        uniGlow.addColorStop(0.5, "rgba(147,51,234,0.15)");
        uniGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.arc(cx, cy, 150, 0, Math.PI * 2);
        ctx.fillStyle = uniGlow;
        ctx.fill();
        
        // Microwave Background ripples
        for (let r = 80; r < 140; r += 20) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - r / 140)})`;
          ctx.stroke();
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [selectedNodeId, isTraveling, blackHoleVoyage, travelSpeed, warpStars]);

  // Handle speed changes
  const initiateTransit = (nodeId: string) => {
    if (nodeId === selectedNodeId) return;
    setBlackHoleVoyage(false);
    setIsTraveling(true);
    setTravelProgress(0);

    const duration = travelSpeed === "warp" ? 1000 : travelSpeed === "light" ? 2500 : 4000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setTravelProgress(progress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setSelectedNodeId(nodeId);
        setIsTraveling(false);
      }
    }, intervalTime);
  };

  // Black Hole Singularity Descent Logic
  useEffect(() => {
    if (!blackHoleVoyage) {
      setFallDistance(0);
      return;
    }
    const timer = setInterval(() => {
      setFallDistance((prev) => {
        if (prev >= 14999) {
          // singularities collapse
          return 14999;
        }
        return prev + 120;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [blackHoleVoyage]);

  // relativistic calculations
  const calculateTimeDilation = () => {
    if (blackHoleVoyage) {
      // Near black hole event horizon (using Schwarzschild limit)
      // t' = t / sqrt(1 - Rs/r)
      // Let's mock the r approaching Rs (15,000 km)
      const r = 30000 - fallDistance;
      const Rs = 15000;
      if (r <= Rs) return Infinity;
      const factor = Math.sqrt(1 - Rs / r);
      return 1 / factor;
    }
    // Speed based time dilation: beta = v/c
    const betaMap = { sublight: 0.0001, light: 0.9999, warp: 1000, quantum: Infinity };
    const beta = betaMap[travelSpeed];
    if (beta >= 1) return beta === Infinity ? Infinity : 999999;
    return 1 / Math.sqrt(1 - beta * beta);
  };

  const dilationFactor = calculateTimeDilation();

  return (
    <div id="cosmic-explorer-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Simulation Screen */}
      <div className="lg:col-span-2 relative bg-black/60 border border-cyan-500/25 rounded-2xl overflow-hidden glassmorphism shadow-2xl flex flex-col">
        {/* Holographic Header */}
        <div className="p-4 border-b border-cyan-500/15 bg-cyan-950/20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Space className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-xs font-mono text-cyan-500 block">KUNX NAVIGATOR</span>
              <span className="text-sm font-sans font-medium tracking-wide text-white">
                {isTraveling ? "TRANSIT IN PROGRESS..." : blackHoleVoyage ? "SINGULARITY DESCENT" : `${selectedNode.name} Coordinates Locked`}
              </span>
            </div>
          </div>
          <div className="flex space-x-2 text-right">
            <div>
              <span className="text-[10px] font-mono text-cyan-500 block">SCALE LEVEL</span>
              <span className="text-xs font-mono text-cyan-300">{selectedNode.scale}</span>
            </div>
          </div>
        </div>

        {/* The Space Stage */}
        <div className="relative flex-grow min-h-[350px] lg:min-h-[420px] bg-black">
          <canvas
            ref={canvasRef}
            width={700}
            height={420}
            className="w-full h-full max-h-[450px] object-cover"
          />

          {/* Relativistic Stats Overlay */}
          <div className="absolute top-4 left-4 bg-slate-950/85 border border-cyan-500/30 rounded-xl p-3 font-mono text-[11px] space-y-1.5 text-cyan-300 pointer-events-none">
            <span className="text-white font-sans font-semibold text-xs block border-b border-cyan-500/20 pb-1 mb-1">
              RELATIVISTIC LOGS
            </span>
            <p>
              PROP VELOCITY:{" "}
              <span className="text-white">
                {travelSpeed === "sublight"
                  ? "25.4 km/s (Mach 74)"
                  : travelSpeed === "light"
                  ? "299,792.4 km/s (1.00c)"
                  : travelSpeed === "warp"
                  ? "Warp Factor 9.92 (Superluminal)"
                  : "Instant (Quantum Coherent)"}
              </span>
            </p>
            <p>
              TIME DILATION FACTOR (γ):{" "}
              <span className="text-cyan-400 font-bold">
                {dilationFactor === Infinity
                  ? "∞ (Time Frozen)"
                  : dilationFactor > 1000
                  ? "Non-Observable (Quantum Space)"
                  : `${dilationFactor.toFixed(5)}x`}
              </span>
            </p>
            <p>
              SPACETIME METRIC:{" "}
              <span className="text-white">
                {blackHoleVoyage ? "Schwarzschild Singularity Warp" : "Flat Minkowski Spacetime"}
              </span>
            </p>
            {blackHoleVoyage && (
              <p className="text-orange-400 animate-pulse font-bold">
                DIST TO SINGULARITY: {Math.max(1, 15000 - fallDistance)} km
              </p>
            )}
          </div>

          {/* Travel Progress HUD */}
          {isTraveling && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-center items-center px-12">
              <Compass className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <div className="w-full max-w-md bg-slate-900 border border-cyan-500/20 h-4 rounded-full p-0.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_#06b6d4]"
                  style={{ width: `${travelProgress * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-cyan-300 mt-2 tracking-widest animate-pulse">
                WARPING SPACE-TIME... {Math.floor(travelProgress * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Travel Control Bar */}
        <div className="p-4 border-t border-cyan-500/15 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-2">
            {(["sublight", "light", "warp", "quantum"] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  setTravelSpeed(spd);
                  setBlackHoleVoyage(false);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono capitalize transition ${
                  travelSpeed === spd
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {spd === "light" ? "1.00c" : spd}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                setBlackHoleVoyage(!blackHoleVoyage);
                setSelectedNodeId("sagittarius-a");
              }}
              className={`flex items-center space-x-1 px-4 py-1.5 rounded-lg border text-xs font-mono transition ${
                blackHoleVoyage
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>{blackHoleVoyage ? "Abort Voyage" : "Black Hole Journey"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Scales Sidebar */}
      <div className="space-y-4">
        {/* Navigation Selector card */}
        <div className="bg-black/40 border border-slate-800 rounded-2xl p-5 glassmorphism">
          <h4 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
            <Compass className="w-4 h-4" />
            <span>Select Destination Scale</span>
          </h4>
          <div className="space-y-2">
            {cosmicNodes.map((node) => {
              const isActive = selectedNodeId === node.id && !blackHoleVoyage;
              return (
                <button
                  key={node.id}
                  disabled={isTraveling}
                  onClick={() => initiateTransit(node.id)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    isActive
                      ? "bg-cyan-500/10 border-cyan-400 text-white"
                      : "bg-slate-950/60 border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white"
                  } ${isTraveling ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div>
                    <span className="font-semibold text-sm block">{node.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">Scale: {node.scale}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 capitalize border border-slate-800">
                    {node.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Body Information Card */}
        <div className="bg-black/50 border border-slate-800/80 rounded-2xl p-5 glassmorphism space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 block">CURRENT OBSERVABLE TARGET</span>
              <h3 className="text-lg font-sans font-bold text-white leading-tight">
                {blackHoleVoyage ? "Singularity Horizon" : selectedNode.name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {blackHoleVoyage
              ? "You have crossed the event horizon. Photons are trapped in terminal circular orbits. Due to severe spacetime curvature, an external observer would see you frozen in time forever, redshifted to absolute zero frequency."
              : selectedNode.description}
          </p>

          <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-wider">
              Cosmic Facts
            </span>
            <p className="text-xs font-sans text-slate-300 italic">
              &ldquo;{blackHoleVoyage ? "At the center of a Schwarzschild black hole sits a mathematical singularity of infinite gravity where physics as we know it completely breaks down." : selectedNode.fact}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
