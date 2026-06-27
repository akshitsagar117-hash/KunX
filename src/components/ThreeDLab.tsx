import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Sliders, ChevronRight, Zap, RefreshCw } from "lucide-react";
import { triggerAction } from "../utils/gamification";
import {
  FluidSolver2D,
  QuantumSchrodingerSolver,
  BarnesHutNode,
  RK4Solver,
  WaveEquationSolver2D,
  IsingLattice2D
} from "../utils/physicsSolvers";

export default function ThreeDLab() {
  const [activeSim, setActiveSim] = useState<"gravity" | "warp" | "waves" | "projectile" | "fluid" | "quantum" | "ising">("gravity");
  const [isPlaying, setIsPlaying] = useState(true);

  // Simulation Sliders
  const [simParams, setSimParams] = useState({
    gravityConst: 6.7,
    massScale: 80,
    waveFreq: 0.15,
    waveSlitDist: 40,
    projAngle: 45,
    projVel: 60,
    projDrag: 0.02,
    fluidViscosity: 0.1,
    quantumBarrier: 12,
    isingTemp: 2.27,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation State Refs
  const simStateRef = useRef({
    // Gravity Orbit Sim
    orbit: {
      px: 150, py: 0, // planet position relative to sun
      vx: 0, vy: 3.8, // planet velocity
      trail: [] as { x: number; y: number }[],
    },
    // Projectile Sim
    proj: {
      x: 30, y: 350,
      vx: 0, vy: 0,
      active: false,
      trail: [] as { x: number; y: number }[],
    },
  });

  // Advanced Core Solvers Refs
  const fluidRef = useRef<{
    solver: FluidSolver2D;
    u: Float32Array;
    v: Float32Array;
    uPrev: Float32Array;
    vPrev: Float32Array;
    density: Float32Array;
    densityPrev: Float32Array;
    p: Float32Array;
    div: Float32Array;
  } | null>(null);

  const quantumRef = useRef<{
    solver: QuantumSchrodingerSolver;
    prob: Float32Array;
  } | null>(null);

  const isingRef = useRef<IsingLattice2D | null>(null);

  // Reset simulation when switching or pressing reset
  const resetSimState = () => {
    const state = simStateRef.current;
    
    // Reset Gravity
    state.orbit.px = 155;
    state.orbit.py = 0;
    state.orbit.vx = 0;
    state.orbit.vy = 3.6 + (simParams.gravityConst * 0.05);
    state.orbit.trail = [];

    // Reset Projectile
    state.proj.x = 30;
    state.proj.y = 350;
    const rad = (simParams.projAngle * Math.PI) / 180;
    state.proj.vx = Math.cos(rad) * (simParams.projVel * 0.15);
    state.proj.vy = -Math.sin(rad) * (simParams.projVel * 0.15);
    state.proj.active = true;
    state.proj.trail = [];

    // Reset Advanced Fluid
    if (fluidRef.current) {
      fluidRef.current.u.fill(0);
      fluidRef.current.v.fill(0);
      fluidRef.current.uPrev.fill(0);
      fluidRef.current.vPrev.fill(0);
      fluidRef.current.density.fill(0);
      fluidRef.current.densityPrev.fill(0);
      fluidRef.current.p.fill(0);
      fluidRef.current.div.fill(0);
    }

    // Reset Quantum wavefunction to Gaussian pack
    if (quantumRef.current) {
      const solver = quantumRef.current.solver;
      const size = solver.size;
      const x0 = size / 3;
      const width = 8.0;
      const k = 1.2;
      for (let i = 0; i < size; i++) {
        const envelope = Math.exp(-Math.pow(i - x0, 2) / (2 * width * width));
        solver.psiReal[i] = envelope * Math.cos(k * i);
        solver.psiImag[i] = envelope * Math.sin(k * i);
      }
      solver.normalize();
    }

    // Reset Ising spins
    if (isingRef.current) {
      isingRef.current.initializeRandom();
    }
  };

  useEffect(() => {
    resetSimState();
    triggerAction("simulate");
  }, [activeSim, simParams.projAngle, simParams.projVel, simParams.gravityConst]);

  // Main Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let waveTime = 0;

    const render = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.fillStyle = "#020108";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle futuristic coordinates grid lines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      const state = simStateRef.current;

      // ----------------------------------------------------
      // 1. Keplerian Gravity / Planetary Orbit Simulation
      // ----------------------------------------------------
      if (activeSim === "gravity") {
        // Draw Central Star (Sun)
        ctx.beginPath();
        const sunGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 35);
        sunGlow.addColorStop(0, "#ffffff");
        sunGlow.addColorStop(0.2, "#f59e0b");
        sunGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fillStyle = sunGlow;
        ctx.fill();

        if (isPlaying) {
          // Physics: Kepler orbit gravity force F = G * M * m / r^2
          const dx = 0 - state.orbit.px;
          const dy = 0 - state.orbit.py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 15) {
            // Acceleration force
            const G = simParams.gravityConst * 0.15;
            const M = simParams.massScale;
            const force = (G * M) / (dist * dist);
            
            state.orbit.vx += (dx / dist) * force;
            state.orbit.vy += (dy / dist) * force;
            
            state.orbit.px += state.orbit.vx;
            state.orbit.py += state.orbit.vy;

            // Save trail
            state.orbit.trail.push({ x: state.orbit.px + cx, y: state.orbit.py + cy });
            if (state.orbit.trail.length > 250) state.orbit.trail.shift();
          }
        }

        // Draw Orbit path Trail
        if (state.orbit.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(state.orbit.trail[0].x, state.orbit.trail[0].y);
          for (let i = 1; i < state.orbit.trail.length; i++) {
            ctx.lineTo(state.orbit.trail[i].x, state.orbit.trail[i].y);
          }
          ctx.strokeStyle = "rgba(6, 182, 212, 0.45)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw Orbiting Planet
        const px = state.orbit.px + cx;
        const py = state.orbit.py + cy;
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee";
        ctx.fill();

        // Draw attractive gravity vector arrow line
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ----------------------------------------------------
      // 2. Black Hole Spacetime curvature (Grid warping)
      // ----------------------------------------------------
      else if (activeSim === "warp") {
        const gridSpacing = 28;
        const warpM = simParams.massScale * 0.85;

        // Draw bent grid wires 3D projection style
        ctx.strokeStyle = "rgba(99, 102, 241, 0.28)";
        ctx.lineWidth = 1;

        for (let y = 30; y < canvas.height - 30; y += gridSpacing) {
          ctx.beginPath();
          for (let x = 30; x < canvas.width - 30; x += 10) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Curvature formula: push coordinates closer to the singularity Center
            let warpFactor = 0;
            if (dist > 15) {
              warpFactor = (warpM * 18) / (dist + 15);
            }
            const px = x - (dx / dist) * warpFactor;
            const py = y - (dy / dist) * warpFactor;
            
            if (x === 30) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        // Singularity hole
        ctx.beginPath();
        const singularityGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
        singularityGlow.addColorStop(0, "#000000");
        singularityGlow.addColorStop(0.3, "rgba(0,0,0,1)");
        singularityGlow.addColorStop(0.5, "rgba(147, 51, 234, 0.4)");
        singularityGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.fillStyle = singularityGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = "rgba(168, 85, 247, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // ----------------------------------------------------
      // 3. Double Slit Wave Propagation Interference
      // ----------------------------------------------------
      else if (activeSim === "waves") {
        if (isPlaying) waveTime += 0.22;

        const s1Y = cy - simParams.waveSlitDist / 2;
        const s2Y = cy + simParams.waveSlitDist / 2;
        const startX = 140;

        // Draw waves emission source slits on left
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.fillRect(startX - 20, 0, 15, canvas.height);
        
        ctx.fillStyle = "rgba(6, 182, 212, 0.7)";
        ctx.fillRect(startX - 20, s1Y - 4, 15, 8); // slit 1 opening
        ctx.fillRect(startX - 20, s2Y - 4, 15, 8); // slit 2 opening

        // Draw Wave Interference on screen using analytical physics equations
        // Wave = sin(k*r1 - wt) + sin(k*r2 - wt)
        const waveStep = 6;
        for (let x = startX; x < canvas.width - 50; x += waveStep) {
          for (let y = 10; y < canvas.height - 10; y += waveStep * 1.5) {
            const r1 = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - s1Y, 2));
            const r2 = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - s2Y, 2));

            // wavelength k
            const k = 0.095;
            const w = simParams.waveFreq * 3.5;
            
            // Overlapping waves amplitudes
            const amp1 = Math.sin(k * r1 - waveTime * w) / Math.max(1, r1 * 0.004);
            const amp2 = Math.sin(k * r2 - waveTime * w) / Math.max(1, r2 * 0.004);
            const intensity = (amp1 + amp2 + 2) / 4; // normalized 0 to 1

            ctx.fillStyle = `rgba(6, 182, 212, ${intensity * 0.75})`;
            ctx.fillRect(x, y, waveStep, waveStep);
          }
        }

        // Draw intensity detector graph bar on right side
        ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
        ctx.fillRect(canvas.width - 45, 0, 45, canvas.height);
        
        ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
        ctx.beginPath();
        ctx.moveTo(canvas.width - 40, 0);
        ctx.lineTo(canvas.width - 40, canvas.height);
        ctx.stroke();

        ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
        for (let y = 10; y < canvas.height - 10; y += 4) {
          const r1 = Math.sqrt(Math.pow(canvas.width - 45 - startX, 2) + Math.pow(y - s1Y, 2));
          const r2 = Math.sqrt(Math.pow(canvas.width - 45 - startX, 2) + Math.pow(y - s2Y, 2));
          const amp1 = Math.sin(0.095 * r1 - waveTime * 0.4) / (r1 * 0.004);
          const amp2 = Math.sin(0.095 * r2 - waveTime * 0.4) / (r2 * 0.004);
          const val = Math.pow(amp1 + amp2, 2) * 5; // wave Intensity is proportional to square of amplitude!
          
          ctx.fillRect(canvas.width - 40, y, Math.min(38, val), 2);
        }
      }

      // ----------------------------------------------------
      // 4. Projectile Motion with fluid/air resistance drag
      // ----------------------------------------------------
      else if (activeSim === "projectile") {
        // Floor line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.moveTo(0, 350); ctx.lineTo(canvas.width, 350);
        ctx.stroke();

        if (state.proj.active && isPlaying) {
          // Physics solver step with air drag resistance!
          // acceleration F = m*a -> a_g = -g, a_drag = -k * v^2 / m
          const g = 0.18; // base acceleration of gravity
          const dragConst = simParams.projDrag * 0.1;
          const vx = state.proj.vx;
          const vy = state.proj.vy;
          const vel = Math.sqrt(vx * vx + vy * vy);

          // Drag forces
          const fx_drag = -dragConst * vel * vx;
          const fy_drag = -dragConst * vel * vy;

          // Update position & velocity
          state.proj.vx += fx_drag;
          state.proj.vy += g + fy_drag;

          state.proj.x += state.proj.vx;
          state.proj.y += state.proj.vy;

          // Record trail coordinate
          state.proj.trail.push({ x: state.proj.x, y: state.proj.y });

          // check floor bounds
          if (state.proj.y >= 350) {
            state.proj.y = 350;
            state.proj.active = false; // hit floor
          }
        }

        // Draw trajectory path line
        if (state.proj.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(state.proj.trail[0].x, state.proj.trail[0].y);
          for (let i = 1; i < state.proj.trail.length; i++) {
            ctx.lineTo(state.proj.trail[i].x, state.proj.trail[i].y);
          }
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Draw launcher canon
        const rad = (simParams.projAngle * Math.PI) / 180;
        const lx = 30 + Math.cos(rad) * 32;
        const ly = 350 - Math.sin(rad) * 32;
        ctx.beginPath();
        ctx.moveTo(30, 350);
        ctx.lineTo(lx, ly);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke();

        // Draw active projectile projectile mass ball
        ctx.beginPath();
        ctx.arc(state.proj.x, state.proj.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();

        // Velocity vector overlay
        if (state.proj.active) {
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(state.proj.x, state.proj.y);
          ctx.lineTo(state.proj.x + state.proj.vx * 3.5, state.proj.y + state.proj.vy * 3.5);
          ctx.stroke();
        }
      }

      // ----------------------------------------------------
      // 5. Incompressible Fluid Dynamics (Navier-Stokes)
      // ----------------------------------------------------
      else if (activeSim === "fluid") {
        if (!fluidRef.current) {
          const w = 64;
          const h = 36;
          const size = w * h;
          const solver = new FluidSolver2D(w, h, 20);
          const u = new Float32Array(size);
          const v = new Float32Array(size);
          const uPrev = new Float32Array(size);
          const vPrev = new Float32Array(size);
          const density = new Float32Array(size);
          const densityPrev = new Float32Array(size);
          const p = new Float32Array(size);
          const div = new Float32Array(size);
          fluidRef.current = { solver, u, v, uPrev, vPrev, density, densityPrev, p, div };
        }

        const f = fluidRef.current;
        const W = f.solver.width;
        const H = f.solver.height;

        if (isPlaying) {
          // Inject fluid jet from the left boundary
          const cY = Math.floor(H / 2);
          for (let dy = -2; dy <= 2; dy++) {
            const idx = 2 + (cY + dy) * W;
            f.density[idx] = 1.0;
            f.u[idx] = 6.0; // High velocity blow
            f.v[idx] = Math.sin(waveTime * 3.0) * 2.5; // Oscillating jet stream
          }

          // Step solver
          // Advect velocities
          f.solver.advect(f.u, f.v, f.u, f.uPrev, 0.1);
          f.solver.advect(f.u, f.v, f.v, f.vPrev, 0.1);
          f.u.set(f.uPrev);
          f.v.set(f.vPrev);

          // Project pressure for mass conservation
          f.solver.project(f.u, f.v, f.p, f.div);

          // Advect density
          f.solver.advect(f.u, f.v, f.density, f.densityPrev, 0.15);
          f.density.set(f.densityPrev);

          // Slowly fade out density to simulate open boundary vacuum draw
          for (let i = 0; i < f.density.length; i++) {
            f.density[i] *= 0.992;
          }
        }

        // Draw Cell Densities
        const cellW = canvas.width / W;
        const cellH = canvas.height / H;
        for (let j = 0; j < H; j++) {
          for (let i = 0; i < W; i++) {
            const idx = i + j * W;
            const d = f.density[idx];
            if (d > 0.01) {
              const hue = (180 + d * 60) % 360;
              ctx.fillStyle = `hsla(${hue}, 90%, 55%, ${Math.min(1.0, d * 0.95)})`;
              ctx.fillRect(i * cellW, j * cellH, cellW + 0.5, cellH + 0.5);
            }
          }
        }

        // Velocity vectors hud (only at low resolution grid spacing)
        ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
        ctx.lineWidth = 1;
        for (let j = 2; j < H - 2; j += 4) {
          for (let i = 2; i < W - 2; i += 4) {
            const idx = i + j * W;
            const speed = Math.sqrt(f.u[idx] * f.u[idx] + f.v[idx] * f.v[idx]);
            if (speed > 0.1) {
              ctx.beginPath();
              ctx.moveTo(i * cellW + cellW / 2, j * cellH + cellH / 2);
              ctx.lineTo(
                i * cellW + cellW / 2 + (f.u[idx] / speed) * 10,
                j * cellH + cellH / 2 + (f.v[idx] / speed) * 10
              );
              ctx.stroke();
            }
          }
        }
      }

      // ----------------------------------------------------
      // 6. Split-Operator Fourier Wave Quantum Mechanics (TDSE)
      // ----------------------------------------------------
      else if (activeSim === "quantum") {
        if (!quantumRef.current) {
          const size = 120;
          const solver = new QuantumSchrodingerSolver(size);
          // Gaussian packet: psi = exp(-(x-x0)^2 / (2*w^2)) * exp(i * k * x)
          const x0 = size / 3;
          const width = 8.0;
          const k = 1.2;
          for (let i = 0; i < size; i++) {
            const envelope = Math.exp(-Math.pow(i - x0, 2) / (2 * width * width));
            solver.psiReal[i] = envelope * Math.cos(k * i);
            solver.psiImag[i] = envelope * Math.sin(k * i);
          }
          solver.normalize();
          const prob = new Float32Array(size);
          quantumRef.current = { solver, prob };
        }

        const q = quantumRef.current;
        const size = q.solver.size;

        // Sync barrier height from parameters
        const barrierHeight = simParams.quantumBarrier;
        for (let i = 0; i < size; i++) {
          if (i > size / 2 && i < size / 2 + 10) {
            q.solver.potential[i] = barrierHeight;
          } else {
            q.solver.potential[i] = 0.0;
          }
        }

        if (isPlaying) {
          // Dynamic kinetic propagation
          q.solver.stepPotentialHalfStep(0.04);
          q.solver.propagateKineticStep(0.04, 1.0, 1.0, 0.45);
          q.solver.stepPotentialHalfStep(0.04);
          q.solver.normalize();
        }

        q.solver.getProbabilityDensity(q.prob);

        const plotW = canvas.width;
        const midY = canvas.height / 2;
        const scaleY = 120.0;

        // Draw potential barrier wall
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.fillRect(plotW / 2, 20, (10 / size) * plotW, canvas.height - 40);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(plotW / 2, 20, (10 / size) * plotW, canvas.height - 40);

        ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
        ctx.font = "9px monospace";
        ctx.fillText(`POTENTIAL WELL: ${barrierHeight} eV`, plotW / 2 + 15, 35);

        // Draw Real Wave part (Blue)
        ctx.strokeStyle = "rgba(59, 130, 246, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < size; i++) {
          const x = (i / size) * plotW;
          const y = midY - q.solver.psiReal[i] * scaleY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Imaginary Wave part (Purple)
        ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
        ctx.beginPath();
        for (let i = 0; i < size; i++) {
          const x = (i / size) * plotW;
          const y = midY - q.solver.psiImag[i] * scaleY;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Superposed Probability Density (Cyan filled)
        ctx.strokeStyle = "rgba(6, 182, 212, 0.9)";
        ctx.fillStyle = "rgba(6, 182, 212, 0.1)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        for (let i = 0; i < size; i++) {
          const x = (i / size) * plotW;
          const y = midY - q.prob[i] * scaleY * 1.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(plotW, midY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // ----------------------------------------------------
      // 7. Ferromagnetic Ising Lattice Model
      // ----------------------------------------------------
      else if (activeSim === "ising") {
        if (!isingRef.current) {
          isingRef.current = new IsingLattice2D(40);
        }

        const ising = isingRef.current;
        const temp = simParams.isingTemp;

        if (isPlaying) {
          // Speed up sweep steps to make visualization dynamic
          for (let sweep = 0; sweep < 3; sweep++) {
            ising.stepIsing(temp, 1.0, 0.0);
          }
        }

        const W = ising.size;
        const cellW = canvas.width / W;
        const cellH = canvas.height / W;

        for (let j = 0; j < W; j++) {
          for (let i = 0; i < W; i++) {
            const spin = ising.grid[i + j * W];
            ctx.fillStyle = spin > 0 ? "rgba(6, 182, 212, 0.9)" : "rgba(129, 140, 248, 0.15)";
            ctx.fillRect(i * cellW, j * cellH, cellW - 0.5, cellH - 0.5);
          }
        }

        // Magnetization gauge overlay
        const netM = ising.getNetMagnetization();
        ctx.fillStyle = "rgba(10, 10, 15, 0.85)";
        ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
        ctx.lineWidth = 1;
        ctx.fillRect(15, 15, 180, 50);
        ctx.strokeRect(15, 15, 180, 50);

        ctx.fillStyle = "#ffffff";
        ctx.font = "10px monospace";
        ctx.fillText(`LATTICE TEMP: ${temp.toFixed(2)} K`, 25, 32);
        ctx.fillText(`NET SPINS (M): ${netM.toFixed(4)}`, 25, 48);
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, [activeSim, isPlaying, simParams]);

  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    handleCanvasInteract(e);
  };

  const handleCanvasMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMouseDown) {
      handleCanvasInteract(e);
    }
  };

  const handleCanvasInteract = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    
    const pctX = clickX / width;
    const pctY = clickY / height;

    if (activeSim === "quantum" && quantumRef.current) {
      const idx = Math.floor(pctX * quantumRef.current.solver.size);
      if (idx >= 0 && idx < quantumRef.current.solver.size) {
        quantumRef.current.solver.measureState(idx);
        triggerAction("measure_quantum_state");
      }
    } else if (activeSim === "ising" && isingRef.current) {
      const size = isingRef.current.size;
      const gridX = Math.floor(pctX * size);
      const gridY = Math.floor(pctY * size);
      if (gridX >= 0 && gridX < size && gridY >= 0 && gridY < size) {
        const idx = gridX + gridY * size;
        isingRef.current.grid[idx] = -isingRef.current.grid[idx];
      }
    } else if (activeSim === "fluid" && fluidRef.current) {
      const f = fluidRef.current;
      const W = f.solver.width;
      const H = f.solver.height;
      const gridX = Math.floor(pctX * W);
      const gridY = Math.floor(pctY * H);
      
      if (gridX > 1 && gridX < W - 2 && gridY > 1 && gridY < H - 2) {
        const radius = 2;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const idx = (gridX + dx) + (gridY + dy) * W;
            f.density[idx] = 1.0;
            f.u[idx] = (Math.random() - 0.5) * 5.0;
            f.v[idx] = (Math.random() - 0.5) * 5.0;
          }
        }
      }
    }
  };

  return (
    <div id="physics-lab-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Simulation Workspace Panel */}
      <div className="lg:col-span-2 flex flex-col bg-slate-950/45 border border-cyan-500/20 rounded-2xl overflow-hidden glassmorphism shadow-xl">
        {/* Sim Tab bar */}
        <div className="flex border-b border-cyan-500/10 bg-cyan-950/15 overflow-x-auto">
          {(["gravity", "warp", "waves", "projectile", "fluid", "quantum", "ising"] as const).map((sim) => (
            <button
              key={sim}
              onClick={() => setActiveSim(sim)}
              className={`flex-grow md:flex-grow-0 px-5 py-3 border-r border-cyan-500/10 font-mono text-[11px] uppercase tracking-wider text-center transition ${
                activeSim === sim
                  ? "bg-cyan-500/10 border-b-2 border-b-cyan-400 text-cyan-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {sim === "warp"
                ? "Space Warp Grid"
                : sim === "gravity"
                ? "Orbit Gravity"
                : sim === "projectile"
                ? "Air Drag Trajectory"
                : sim === "waves"
                ? "Double Slit"
                : sim === "fluid"
                ? "CFD Fluid Dynamics"
                : sim === "quantum"
                ? "Quantum Wave TDSE"
                : "Ising Ferromagnetic"}
            </button>
          ))}
        </div>

        {/* The Live Interactive Canvas Stage */}
        <div className="relative flex-grow min-h-[300px] bg-black">
          <canvas
            ref={canvasRef}
            width={650}
            height={380}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full max-h-[390px] object-contain cursor-crosshair"
          />

          {/* Quick HUD badge */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-lg py-1 px-2.5 text-[10px] font-mono text-cyan-400">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="uppercase tracking-widest">{activeSim} SIMULATOR RUNNING</span>
          </div>
        </div>

        {/* Workspace controls */}
        <div className="p-4 bg-slate-950/80 border-t border-cyan-500/10 flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={resetSimState}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            {activeSim === "gravity" && "Planetary Gravity (F = G*M*m/r²)"}
            {activeSim === "warp" && "Schwarzschild Spatial Warping metric"}
            {activeSim === "waves" && "Interference: I = 4*I_0 * cos²(k*d*sinθ/2)"}
            {activeSim === "projectile" && "Trajectory with drag acceleration F_d = -½ k v²"}
            {activeSim === "fluid" && "Navier-Stokes (Stam's Advect-Project-Diffuse Grid - Click/Drag to stir)"}
            {activeSim === "quantum" && "TDSE Schrödinger Wave (Click/Drag to measure & collapse wave state)"}
            {activeSim === "ising" && "Metropolis Monte Carlo Curie Point Ferromagnetism (Click to flip spin)"}
          </div>
        </div>
      </div>

      {/* Physics variables sliders dashboard */}
      <div className="bg-slate-950/65 border border-slate-800/80 rounded-2xl p-5 glassmorphism flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-sans font-bold text-white tracking-wide border-b border-slate-800 pb-3 mb-4 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Interactive Sliders</span>
          </h3>

          <div className="space-y-5">
            {activeSim === "gravity" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Gravitational Constant (G)</span>
                    <span className="text-cyan-400">{simParams.gravityConst.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.1"
                    value={simParams.gravityConst}
                    onChange={(e) => setSimParams({ ...simParams, gravityConst: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Mass of Core Sun (M)</span>
                    <span className="text-cyan-400">{simParams.massScale} kg</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={simParams.massScale}
                    onChange={(e) => setSimParams({ ...simParams, massScale: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>
              </>
            )}

            {activeSim === "warp" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Singularity Core Mass</span>
                  <span className="text-cyan-400">{simParams.massScale} M_⊙</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="180"
                  step="2"
                  value={simParams.massScale}
                  onChange={(e) => setSimParams({ ...simParams, massScale: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                />
              </div>
            )}

            {activeSim === "waves" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Wave Frequency (f)</span>
                    <span className="text-cyan-400">{simParams.waveFreq.toFixed(2)} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.01"
                    value={simParams.waveFreq}
                    onChange={(e) => setSimParams({ ...simParams, waveFreq: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Double Slits Distance (d)</span>
                    <span className="text-cyan-400">{simParams.waveSlitDist} nm</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="2"
                    value={simParams.waveSlitDist}
                    onChange={(e) => setSimParams({ ...simParams, waveSlitDist: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>
              </>
            )}

            {activeSim === "projectile" && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Launch Angle (θ)</span>
                    <span className="text-cyan-400">{simParams.projAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="85"
                    step="1"
                    value={simParams.projAngle}
                    onChange={(e) => setSimParams({ ...simParams, projAngle: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Muzzle Velocity (v_0)</span>
                    <span className="text-cyan-400">{simParams.projVel} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="2"
                    value={simParams.projVel}
                    onChange={(e) => setSimParams({ ...simParams, projVel: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Fluid Drag Coefficient (C_d)</span>
                    <span className="text-cyan-400">{simParams.projDrag.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.08"
                    step="0.001"
                    value={simParams.projDrag}
                    onChange={(e) => setSimParams({ ...simParams, projDrag: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                  />
                </div>
              </>
            )}

            {activeSim === "fluid" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Dynamic Viscosity (ν)</span>
                  <span className="text-cyan-400">{(simParams.fluidViscosity || 0.1).toFixed(2)} Pa·s</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={simParams.fluidViscosity}
                  onChange={(e) => setSimParams({ ...simParams, fluidViscosity: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                />
              </div>
            )}

            {activeSim === "quantum" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Potential Barrier (V_0)</span>
                  <span className="text-cyan-400">{simParams.quantumBarrier} eV</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={simParams.quantumBarrier}
                  onChange={(e) => setSimParams({ ...simParams, quantumBarrier: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                />
              </div>
            )}

            {activeSim === "ising" && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Ambient Temperature (T)</span>
                  <span className="text-cyan-400">{simParams.isingTemp.toFixed(2)} K</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.05"
                  value={simParams.isingTemp}
                  onChange={(e) => setSimParams({ ...simParams, isingTemp: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-800 h-1 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Real life analogy info card */}
        <div className="mt-6 border border-cyan-500/10 bg-cyan-950/15 p-4 rounded-xl">
          <div className="flex items-start space-x-2.5 text-cyan-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-xs font-sans block mb-1">CERN Physics Verification</span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {activeSim === "gravity" && "Orbital mechanics governs celestial travel, satellite syncing, and Keplerian laws. High velocity Kepler orbits exhibit Special Relativity corrections."}
                {activeSim === "warp" && "Warping represents General Relativity. Massive bodies warp space-time fabric, guiding orbital vectors. Einstein rings are created when light curves around supermassive cores."}
                {activeSim === "waves" && "Double slit wave patterns are fundamental to both mechanical fluid dynamics and Quantum physics (representing de Broglie's particle-wave superposition)."}
                {activeSim === "projectile" && "Ballistic trajectories incorporate drag force which is proportional to velocity squared inside gaseous atmosphere models."}
                {activeSim === "fluid" && "CFD Fluid solver maps continuous flow fields via Jacobi Poisson pressure projection to enforce zero velocity divergence (incompressible Navier-Stokes)."}
                {activeSim === "quantum" && "Split-operator wavefunction propagation tracks subatomic wave packets tunnels. Clicks collapse continuous states to localized positions."}
                {activeSim === "ising" && "Curie Temperature phase transition is modeled using Metropolis Monte Carlo sweeps. Below T_c ≈ 2.27 K, alignment occurs spontaneously."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
