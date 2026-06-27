/**
 * QUANTA-CORE // CORE COMPUTATIONAL PHYSICS SOLVERS
 * Foundational engineering mathematical frameworks for the Physics Intelligence Platform.
 */

// ====================================================================================================
// SECTION 1: ZERO-ALLOCATION TYPED POOL MANAGER FOR 3D VECTOR MATH
// ====================================================================================================

export class Vector3Pool {
  private pool: Float32Array;
  private size: number;
  private nextAvailableIndex: number = 0;

  constructor(maxElements: number = 100000) {
    this.size = maxElements;
    // Layout: [x0, y0, z0, x1, y1, z1, ...]
    this.pool = new Float32Array(maxElements * 3);
  }

  public allocate(): number {
    if (this.nextAvailableIndex >= this.size) {
      this.nextAvailableIndex = 0; // Wraps around / overwrites oldest if buffer overflows
    }
    const allocatedId = this.nextAvailableIndex;
    this.nextAvailableIndex++;
    return allocatedId * 3; // Returns the byte-stride index mapping to vector base index
  }

  public set(id: number, x: number, y: number, z: number): void {
    this.pool[id] = x;
    this.pool[id + 1] = y;
    this.pool[id + 2] = z;
  }

  public get(id: number, out: Float32Array | number[]): void {
    out[0] = this.pool[id];
    out[1] = this.pool[id + 1];
    out[2] = this.pool[id + 2];
  }

  public add(destId: number, srcIdA: number, srcIdB: number): void {
    this.pool[destId] = this.pool[srcIdA] + this.pool[srcIdB];
    this.pool[destId + 1] = this.pool[srcIdA + 1] + this.pool[srcIdB + 1];
    this.pool[destId + 2] = this.pool[srcIdA + 2] + this.pool[srcIdB + 2];
  }
}

// ====================================================================================================
// SECTION 2: HIGH-FIDELITY RUNGE-KUTTA 4TH ORDER (RK4) VECTOR SOLVER
// ====================================================================================================

export type DerivativeFunction = (state: Float32Array, derivatives: Float32Array) => void;

export class RK4Solver {
  private k1: Float32Array;
  private k2: Float32Array;
  private k3: Float32Array;
  private k4: Float32Array;
  private tempState: Float32Array;

  constructor(private stateDimension: number) {
    this.k1 = new Float32Array(stateDimension);
    this.k2 = new Float32Array(stateDimension);
    this.k3 = new Float32Array(stateDimension);
    this.k4 = new Float32Array(stateDimension);
    this.tempState = new Float32Array(stateDimension);
  }

  public step(state: Float32Array, dt: number, computeDerivatives: DerivativeFunction): void {
    const dim = this.stateDimension;

    // k1 = f(t, y)
    computeDerivatives(state, this.k1);

    // k2 = f(t + dt/2, y + dt/2 * k1)
    for (let i = 0; i < dim; i++) this.tempState[i] = state[i] + (dt * 0.5) * this.k1[i];
    computeDerivatives(this.tempState, this.k2);

    // k3 = f(t + dt/2, y + dt/2 * k2)
    for (let i = 0; i < dim; i++) this.tempState[i] = state[i] + (dt * 0.5) * this.k2[i];
    computeDerivatives(this.tempState, this.k3);

    // k4 = f(t + dt, y + dt * k3)
    for (let i = 0; i < dim; i++) this.tempState[i] = state[i] + dt * this.k3[i];
    computeDerivatives(this.tempState, this.k4);

    // y_{n+1} = y_n + dt/6 * (k1 + 2*k2 + 2*k3 + k4)
    for (let i = 0; i < dim; i++) {
      state[i] += (dt / 6.0) * (this.k1[i] + 2.0 * this.k2[i] + 2.0 * this.k3[i] + this.k4[i]);
    }
  }
}

// ====================================================================================================
// SECTION 3: INCOMPRESSIBLE FLUID DYNAMICS (NAVIER-STOKES) JACOBI PRESSURE PROJECTION ENGINE
// ====================================================================================================

export class FluidSolver2D {
  constructor(
    public width: number,
    public height: number,
    private iterations: number = 40
  ) {}

  public project(u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array): void {
    const W = this.width;
    const H = this.height;

    // 1. Calculate Divergence Field
    for (let j = 1; j < H - 1; j++) {
      for (let i = 1; i < W - 1; i++) {
        const idx = i + j * W;
        div[idx] = -0.5 * (u[idx + 1] - u[idx - 1] + v[idx + W] - v[idx - W]) / Math.max(W, H);
        p[idx] = 0; // Reset pressure tracking array
      }
    }

    // 2. Iterative Jacobi Relaxation to Solve Pressure Poisson Equation
    for (let k = 0; k < this.iterations; k++) {
      for (let j = 1; j < H - 1; j++) {
        for (let i = 1; i < W - 1; i++) {
          const idx = i + j * W;
          p[idx] = (div[idx] + p[idx + 1] + p[idx - 1] + p[idx + W] + p[idx - W]) / 4.0;
        }
      }
    }

    // 3. Subtract Pressure Gradient from Velocity Fields (Divergence-Free Projection)
    for (let j = 1; j < H - 1; j++) {
      for (let i = 1; i < W - 1; i++) {
        const idx = i + j * W;
        u[idx] -= 0.5 * (p[idx + 1] - p[idx - 1]) * W;
        v[idx] -= 0.5 * (p[idx + W] - p[idx - W]) * H;
      }
    }
  }

  // Helper to advect fluid property fields
  public advect(u: Float32Array, v: Float32Array, src: Float32Array, dest: Float32Array, dt: number): void {
    const W = this.width;
    const H = this.height;
    const dt0_w = dt * W;
    const dt0_h = dt * H;

    for (let j = 1; j < H - 1; j++) {
      for (let i = 1; i < W - 1; i++) {
        const idx = i + j * W;
        let x = i - dt0_w * u[idx];
        let y = j - dt0_h * v[idx];

        // Clamp boundaries
        if (x < 0.5) x = 0.5;
        if (x > W - 1.5) x = W - 1.5;
        if (y < 0.5) y = 0.5;
        if (y > H - 1.5) y = H - 1.5;

        const i0 = Math.floor(x);
        const i1 = i0 + 1;
        const j0 = Math.floor(y);
        const j1 = j0 + 1;

        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;

        dest[idx] = 
          s0 * (t0 * src[i0 + j0 * W] + t1 * src[i0 + j1 * W]) +
          s1 * (t0 * src[i1 + j0 * W] + t1 * src[i1 + j1 * W]);
      }
    }
  }
}

// ====================================================================================================
// SECTION 4: SPLIT-OPERATOR FOURIER QUANTUM WAVEFUNCTION PROPAGATOR (SCHRÖDINGER TDSE)
// ====================================================================================================

export class QuantumSchrodingerSolver {
  public size: number;
  public psiReal: Float32Array;
  public psiImag: Float32Array;
  public potential: Float32Array;

  constructor(nodes: number) {
    this.size = nodes;
    this.psiReal = new Float32Array(nodes);
    this.psiImag = new Float32Array(nodes);
    this.potential = new Float32Array(nodes); // User custom-drawn barriers or potential wells
  }

  public stepPotentialHalfStep(dt: number, hbar: number = 1.0): void {
    // Computes spatial phase rotation operator: exp(-i * V(x) * dt / (2 * hbar))
    for (let i = 0; i < this.size; i++) {
      const phase = -(this.potential[i] * dt) / (2.0 * hbar);
      const cosP = Math.cos(phase);
      const sinP = Math.sin(phase);
      const r = this.psiReal[i];
      const img = this.psiImag[i];

      // Complex number matrix multiplication transformation
      this.psiReal[i] = r * cosP - img * sinP;
      this.psiImag[i] = r * sinP + img * cosP;
    }
  }

  // Direct kinetic propagation using high-order finite-difference approximations
  // as a lightweight alternative to Full FFT running inside standard browser sandboxes
  public propagateKineticStep(dt: number, m: number = 1.0, hbar: number = 1.0, dx: number = 0.1): void {
    // Hamiltonian Kinetic Part: H_k = - (hbar^2 / 2m) * d^2/dx^2
    const factor = (hbar * dt) / (2.0 * m * dx * dx);
    const nextReal = new Float32Array(this.size);
    const nextImag = new Float32Array(this.size);

    for (let i = 1; i < this.size - 1; i++) {
      // Second derivative finite-difference: psi[i+1] - 2*psi[i] + psi[i-1]
      const lapReal = this.psiReal[i + 1] - 2.0 * this.psiReal[i] + this.psiReal[i - 1];
      const lapImag = this.psiImag[i + 1] - 2.0 * this.psiImag[i] + this.psiImag[i - 1];

      // Schrödinger equation update: dPsi/dt = -i * H * Psi / hbar
      // real_dot = factor * lapImag, imag_dot = -factor * lapReal
      nextReal[i] = this.psiReal[i] + factor * lapImag;
      nextImag[i] = this.psiImag[i] - factor * lapReal;
    }

    // Boundary conditions (Infinite potential well boundaries)
    nextReal[0] = 0;
    nextImag[0] = 0;
    nextReal[this.size - 1] = 0;
    nextImag[this.size - 1] = 0;

    this.psiReal.set(nextReal);
    this.psiImag.set(nextImag);
  }

  public normalize(): void {
    let totalNorm = 0;
    for (let i = 0; i < this.size; i++) {
      totalNorm += this.psiReal[i] * this.psiReal[i] + this.psiImag[i] * this.psiImag[i];
    }
    const normFactor = Math.sqrt(totalNorm);
    if (normFactor > 1e-6) {
      for (let i = 0; i < this.size; i++) {
        this.psiReal[i] /= normFactor;
        this.psiImag[i] /= normFactor;
      }
    }
  }

  public getProbabilityDensity(out: Float32Array): void {
    for (let i = 0; i < this.size; i++) {
      out[i] = this.psiReal[i] * this.psiReal[i] + this.psiImag[i] * this.psiImag[i];
    }
  }

  // Collapse wavefunction to a highly localized peak (Kronecker delta-like)
  // according to Copenhagen quantum measurement principles
  public measureState(randomIndex: number): void {
    for (let i = 0; i < this.size; i++) {
      if (i === randomIndex) {
        this.psiReal[i] = 1.0;
        this.psiImag[i] = 0.0;
      } else {
        this.psiReal[i] = 0.0;
        this.psiImag[i] = 0.0;
      }
    }
    this.normalize();
  }
}

// ====================================================================================================
// SECTION 5: ASTROPHYSICS N-BODY GRAVITATIONAL BARNES-HUT SIMULATOR
// ====================================================================================================

export class BarnesHutNode {
  public mass: number = 0;
  public cx: number = 0; // Center of mass coordinates
  public cy: number = 0;
  public size: number;
  public x: number; // Geometric bounds bounds
  public y: number;
  public subNodes: BarnesHutNode[] | null = null;
  public bodyIndex: number = -1; // References global index if leaf node

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  public insertBody(bodyIdx: number, px: Float32Array, py: Float32Array, pmass: Float32Array): void {
    const bx = px[bodyIdx];
    const by = py[bodyIdx];
    const bmass = pmass[bodyIdx];

    if (this.mass === 0) {
      // Empty node, store index directly
      this.bodyIndex = bodyIdx;
      this.mass = bmass;
      this.cx = bx;
      this.cy = by;
      return;
    }

    if (this.subNodes === null) {
      // Subdivide leaf node into 4 localized quadrants
      const half = this.size / 2;
      this.subNodes = [
        new BarnesHutNode(this.x, this.y, half),                 // NW
        new BarnesHutNode(this.x + half, this.y, half),          // NE
        new BarnesHutNode(this.x, this.y + half, half),          // SW
        new BarnesHutNode(this.x + half, this.y + half, half)   // SE
      ];

      // Move historical leaf body down into child quadrant
      const oldIdx = this.bodyIndex;
      if (oldIdx !== -1) {
        this.bodyIndex = -1;
        this.insertIntoSubQuadrant(oldIdx, px, py, pmass);
      }
    }

    // Insert new incoming body element into tracking structures
    this.insertIntoSubQuadrant(bodyIdx, px, py, pmass);

    // Update center of mass metrics recursively
    const totalMass = this.mass + bmass;
    this.cx = (this.cx * this.mass + bx * bmass) / totalMass;
    this.cy = (this.cy * this.mass + by * bmass) / totalMass;
    this.mass = totalMass;
  }

  private insertIntoSubQuadrant(idx: number, px: Float32Array, py: Float32Array, pmass: Float32Array): void {
    const half = this.size / 2;
    const qx = px[idx] >= this.x + half ? 1 : 0;
    const qy = py[idx] >= this.y + half ? 1 : 0;
    const qidx = qx + qy * 2;
    this.subNodes![qidx].insertBody(idx, px, py, pmass);
  }

  // Compute accumulated gravitational forces on bodyIdx using Barnes-Hut theta criterion
  public calculateForce(
    bodyIdx: number,
    px: Float32Array,
    py: Float32Array,
    pmass: Float32Array,
    ax: Float32Array,
    ay: Float32Array,
    G: number,
    theta: number = 0.5,
    softening: number = 15.0
  ): void {
    const bx = px[bodyIdx];
    const by = py[bodyIdx];

    if (this.bodyIndex !== -1) {
      // It's a leaf node containing a single body
      if (this.bodyIndex === bodyIdx) return; // Don't compute force on self

      const dx = this.cx - bx;
      const dy = this.cy - by;
      const distSq = dx * dx + dy * dy + softening * softening;
      const dist = Math.sqrt(distSq);

      // Force = G * M * m / r^2
      const F = (G * this.mass) / distSq;
      ax[bodyIdx] += (dx / dist) * F;
      ay[bodyIdx] += (dy / dist) * F;
    } else {
      // It's an internal node
      const dx = this.cx - bx;
      const dy = this.cy - by;
      const dist = Math.sqrt(dx * dx + dy * dy + softening * softening);

      // Check Barnes-Hut theta condition: size / distance < theta
      if (this.size / dist < theta) {
        // Approximate force using internal node center of mass
        const F = (G * this.mass) / (dist * dist + softening);
        ax[bodyIdx] += (dx / dist) * F;
        ay[bodyIdx] += (dy / dist) * F;
      } else if (this.subNodes) {
        // Recursively visit child nodes
        for (let i = 0; i < 4; i++) {
          this.subNodes[i].calculateForce(bodyIdx, px, py, pmass, ax, ay, G, theta, softening);
        }
      }
    }
  }
}

// ====================================================================================================
// SECTION 6: GENERAL RELATIVITY SCHWARZSCHILD PHOTON GEODESIC PROPAGATOR
// ====================================================================================================

export class SchwarzschildGeodesicPropagator {
  // Integrates step near Schwarzschild black hole
  // Uses simplified 2D orbit coordinates (r, phi) for quick high-performance tracing
  public static propagateStep(
    state: Float32Array, // Layout: [r, phi, vr, vphi]
    dt: number,
    M: number = 1.0
  ): void {
    const r = state[0];
    const phi = state[1];
    const vr = state[2];
    const vphi = state[3];

    // If already inside the event horizon (r <= 2M), terminate / absorb photon
    if (r <= 2.01 * M) {
      state[0] = 0; // Collapsed state
      return;
    }

    // Geodesic equations derivatives matching general relativity Schwarzschild metric
    // Acceleration equations: d^2r/dt^2 = - (M/r^2) + r * (vphi)^2 - 3M * (vphi)^2
    const dr = vr;
    const dphi = vphi;
    const dvr = -(M / (r * r)) + r * vphi * vphi - 3.0 * M * vphi * vphi;
    const dvphi = -2.0 * (vr / r) * vphi; // Conservation of angular momentum

    // Euler-Cromer integration step
    state[2] += dvr * dt;
    state[3] += dvphi * dt;
    state[0] += state[2] * dt;
    state[1] += state[3] * dt;
  }
}

// ====================================================================================================
// SECTION 7: KEPLER'S ORBITAL ELEMENT PROPAGATOR (NEWTON-RAPHSON ROOT FINDING)
// ====================================================================================================

export class OrbitalElementPropagator {
  public static propagateKepler(
    meanAnomaly: number,
    eccentricity: number,
    semiMajorAxis: number,
    inclinationRad: number = 0.0,
    outCoord: Float32Array | number[] // Output: [x, y, z]
  ): void {
    // 1. Solve Kepler's Equation: M = E - e * sin(E) using Newton-Raphson method
    let E = meanAnomaly; // Initial guess
    const tolerance = 1e-6;
    const maxIterations = 30;

    for (let i = 0; i < maxIterations; i++) {
      const deltaE = (E - eccentricity * Math.sin(E) - meanAnomaly) / (1.0 - eccentricity * Math.cos(E));
      E -= deltaE;
      if (Math.abs(deltaE) < tolerance) break;
    }

    // 2. Compute coordinates in orbital plane
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const xOrbital = semiMajorAxis * (cosE - eccentricity);
    const yOrbital = semiMajorAxis * Math.sqrt(1.0 - eccentricity * eccentricity) * sinE;

    // 3. Project 2D plane into 3D using inclination parameter rotation
    const cosI = Math.cos(inclinationRad);
    const sinI = Math.sin(inclinationRad);

    outCoord[0] = xOrbital;
    outCoord[1] = yOrbital * cosI;
    outCoord[2] = yOrbital * sinI; // Out-of-plane orbital component
  }
}

// ====================================================================================================
// SECTION 8: FERROMAGNETIC ISING LATTICE MONTE CARLO ENGINE
// ====================================================================================================

export class IsingLattice2D {
  public grid: Int8Array; // -1 or +1 spins
  public size: number;

  constructor(size: number) {
    this.size = size;
    this.grid = new Int8Array(size * size);
    this.initializeRandom();
  }

  public initializeRandom(): void {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Math.random() > 0.5 ? 1 : -1;
    }
  }

  public stepIsing(temperature: number, J: number = 1.0, magneticField: number = 0.0): void {
    const N = this.size;
    const beta = 1.0 / Math.max(0.1, temperature);

    // Run Monte Carlo sweeps across random coordinate choices
    for (let sweep = 0; sweep < N * N; sweep++) {
      const i = Math.floor(Math.random() * N);
      const j = Math.floor(Math.random() * N);
      const idx = i + j * N;

      const currentSpin = this.grid[idx];

      // Sum neighbor spins (Periodic boundary conditions)
      const top = this.grid[i + ((j - 1 + N) % N) * N];
      const bottom = this.grid[i + ((j + 1) % N) * N];
      const left = this.grid[((i - 1 + N) % N) + j * N];
      const right = this.grid[((i + 1) % N) + j * N];

      // Energy calculation: deltaH = 2 * spin_i * (J * sum(neighbor_spins) + B)
      const energySum = top + bottom + left + right;
      const deltaH = 2.0 * currentSpin * (J * energySum + magneticField);

      // Metropolis criterion acceptance
      if (deltaH <= 0 || Math.random() < Math.exp(-deltaH * beta)) {
        this.grid[idx] = -currentSpin; // Accept spin flip
      }
    }
  }

  public getNetMagnetization(): number {
    let total = 0;
    for (let i = 0; i < this.grid.length; i++) {
      total += this.grid[i];
    }
    return total / this.grid.length;
  }
}

// ====================================================================================================
// SECTION 9: 2D FINITE-DIFFERENCE TIME-DOMAIN WAVE SOLVER (WITH BOUNDARY ABSORPTION)
// ====================================================================================================

export class WaveEquationSolver2D {
  public uCurr: Float32Array;
  public uPrev: Float32Array;
  public w: number;
  public h: number;

  constructor(width: number, height: number) {
    this.w = width;
    this.h = height;
    this.uCurr = new Float32Array(width * height);
    this.uPrev = new Float32Array(width * height);
  }

  public stepWave(waveSpeedSq: number = 0.15, dampingFactor: number = 0.985): void {
    const W = this.w;
    const H = this.h;
    const next = new Float32Array(W * H);

    // Apply discrete spatial 2D Wave equation with Finite Difference formulation
    for (let j = 1; j < H - 1; j++) {
      for (let i = 1; i < W - 1; i++) {
        const idx = i + j * W;

        // Laplacian calculation
        const laplacian = 
          this.uCurr[idx + 1] + 
          this.uCurr[idx - 1] + 
          this.uCurr[idx + W] + 
          this.uCurr[idx - W] - 
          4.0 * this.uCurr[idx];

        // Numerical solver state update: next = 2*curr - prev + speed^2 * laplacian
        next[idx] = (2.0 * this.uCurr[idx] - this.uPrev[idx] + waveSpeedSq * laplacian) * dampingFactor;
      }
    }

    // Copy pointers
    this.uPrev.set(this.uCurr);
    this.uCurr.set(next);
  }

  public injectImpulse(x: number, y: number, value: number): void {
    if (x > 0 && x < this.w - 1 && y > 0 && y < this.h - 1) {
      const idx = x + y * this.w;
      this.uCurr[idx] = value;
      this.uPrev[idx] = value;
    }
  }
}
