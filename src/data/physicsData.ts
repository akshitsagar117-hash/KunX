import { PhysicsBranch, PhysicsTopic, PhysicsEquation, Physicist, CosmicNode } from '../types';

export const physicsQuotes = [
  { text: "What I cannot create, I do not understand.", author: "Richard Feynman" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existence.", author: "Albert Einstein" },
  { text: "Look up at the stars and not down at your feet. Try to make sense of what you see.", author: "Stephen Hawking" },
  { text: "Scientific progress is a two-way street: technology enables science, and science inspires technology.", author: "CERN Scientific Charter" },
  { text: "If I have seen further, it is by standing on the shoulders of giants.", author: "Sir Isaac Newton" },
  { text: "Reality is merely an illusion, albeit a very persistent one.", author: "Albert Einstein" },
  { text: "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more.", author: "Marie Curie" }
];

export const physicsBranches: PhysicsBranch[] = [
  {
    id: "classical-mechanics",
    name: "Classical Mechanics",
    category: "Classical",
    description: "The study of the motion of bodies under the action of system of forces, formulated by Newton and expanded by Lagrange and Hamilton.",
    icon: "Activity",
    topicIds: ["mechanics", "rotational-motion", "fluid-mechanics", "elasticity"]
  },
  {
    id: "thermodynamics",
    name: "Thermodynamics & Heat",
    category: "Classical",
    description: "The branch dealing with heat, work, temperature, and their relation to energy, radiation, and physical properties of matter.",
    icon: "Flame",
    topicIds: ["thermodynamics-core", "heat-transfer"]
  },
  {
    id: "electromagnetism",
    name: "Electromagnetism & Optics",
    category: "Classical",
    description: "Study of electric and magnetic fields, forces, light, wave propagation, optical instruments, and Maxwell's equations.",
    icon: "Zap",
    topicIds: ["electromagnetism-core", "optics", "acoustics"]
  },
  {
    id: "quantum-mechanics",
    name: "Quantum Mechanics",
    category: "Modern",
    description: "The fundamental theory of nature at the scale of atoms and subatomic particles, introducing wave-particle duality and quantization.",
    icon: "Atom",
    topicIds: ["quantum-physics", "quantum-tunneling", "condensed-matter"]
  },
  {
    id: "relativity",
    name: "Relativity & Gravity",
    category: "Modern",
    description: "Albert Einstein's twin theories (Special and General) describing spacetime structure, gravity as geometry, and high-velocity kinematics.",
    icon: "Orbit",
    topicIds: ["special-relativity", "general-relativity", "time-dilation"]
  },
  {
    id: "particle-physics",
    name: "Particle & Nuclear Physics",
    category: "Modern",
    description: "The investigation of elementary constituents of matter (quarks, leptons, bosons) and the forces that govern them inside the nucleus.",
    icon: "Cpu",
    topicIds: ["particle-standard-model", "nuclear-physics", "high-energy"]
  },
  {
    id: "cosmology-astronomy",
    name: "Cosmology & Galaxies",
    category: "Cosmology & Astronomy",
    description: "The scientific study of the origin, evolution, large-scale structures, and ultimate fate of the universe, alongside astrophysical bodies.",
    icon: "Globe",
    topicIds: ["black-holes", "big-bang", "dark-matter-energy", "stellar-evolution"]
  },
  {
    id: "quantum-computing",
    name: "Quantum Computing",
    category: "Interdisciplinary",
    description: "The merging of quantum mechanics and information theory to process complex data using qubits, superposition, and entanglement.",
    icon: "Binary",
    topicIds: ["quantum-algorithms", "qubit-physics"]
  },
  {
    id: "biophysics",
    name: "Biophysics & Medical Physics",
    category: "Interdisciplinary",
    description: "Applying the principles, theories, and methods of physics to understand biological systems, dna kinematics, and medical imaging technologies like MRI.",
    icon: "HeartPulse",
    topicIds: ["dna-physics", "medical-imaging"]
  },
  {
    id: "string-theory",
    name: "String & M-Theory",
    category: "Theoretical & Advanced",
    description: "A theoretical framework in which point-like particles are replaced by one-dimensional vibrating strings, aiming to unify gravity and quantum mechanics.",
    icon: "Layers",
    topicIds: ["string-theory-core", "higher-dimensions"]
  }
];

export const physicsEquations: PhysicsEquation[] = [
  {
    id: "mass-energy",
    title: "Mass-Energy Equivalence",
    formula: "E = mc²",
    meaning: "States that mass (m) and energy (E) are equivalent and can be converted into each other, where c is the speed of light.",
    variables: [
      { name: "Mass", symbol: "m", unit: "kg", defaultValue: 1 },
      { name: "Speed of Light", symbol: "c", unit: "m/s", defaultValue: 299792458 }
    ],
    calculator: {
      inputs: [
        { name: "Mass", symbol: "m", unit: "kg", defaultValue: 1 },
        { name: "Speed of Light (Constant)", symbol: "c", unit: "m/s", defaultValue: 299792458 }
      ],
      outputName: "Energy",
      outputSymbol: "E",
      outputUnit: "Joules (J)",
      calculateFn: (inputs) => inputs.m * Math.pow(inputs.c || 299792458, 2)
    },
    derivation: "Derived by Albert Einstein in 1905 using special relativity kinematics. It shows that the relativistic kinetic energy of a body includes a rest energy proportional to its mass.",
    realLifeExample: "Nuclear fusion in the core of our Sun, where 4 million tons of hydrogen are converted into pure energy every single second.",
    simulationHint: "Animate a particle splitting and releasing high-energy wave packets propagating outwards."
  },
  {
    id: "newton-second",
    title: "Newton's Second Law of Motion",
    formula: "F = ma",
    meaning: "The force (F) applied to an object is equal to its mass (m) multiplied by its acceleration (a).",
    variables: [
      { name: "Mass", symbol: "m", unit: "kg", defaultValue: 10 },
      { name: "Acceleration", symbol: "a", unit: "m/s²", defaultValue: 9.81 }
    ],
    calculator: {
      inputs: [
        { name: "Mass", symbol: "m", unit: "kg", defaultValue: 10 },
        { name: "Acceleration", symbol: "a", unit: "m/s²", defaultValue: 9.81 }
      ],
      outputName: "Net Force",
      outputSymbol: "F",
      outputUnit: "Newtons (N)",
      calculateFn: (inputs) => inputs.m * inputs.a
    },
    derivation: "First formulated by Sir Isaac Newton in his Philosophiæ Naturalis Principia Mathematica (1687) as the time derivative of momentum: F = dp/dt.",
    realLifeExample: "The thrust required for a SpaceX Falcon 9 rocket to overcome Earth's gravitational pull and accelerate into orbit.",
    simulationHint: "Interactive slider pushing a block across a frictionless plane, changing acceleration."
  },
  {
    id: "schrodinger-time",
    title: "Schrödinger Wave Equation (Time-Independent)",
    formula: "Ĥψ = Eψ",
    meaning: "The fundamental equation of quantum mechanics describing how the quantum state (ψ) of a physical system changes, where Ĥ is the Hamiltonian operator.",
    variables: [
      { name: "Energy Level Index", symbol: "n", unit: "dimensionless", defaultValue: 1 },
      { name: "Box Width", symbol: "L", unit: "nm", defaultValue: 1 }
    ],
    calculator: {
      inputs: [
        { name: "Quantum State Index (n)", symbol: "n", unit: "#", defaultValue: 1 },
        { name: "Potential Barrier Width (L)", symbol: "L", unit: "nm", defaultValue: 1 }
      ],
      outputName: "Ground State Energy (for Particle in a 1D Box)",
      outputSymbol: "E_n",
      outputUnit: "eV",
      calculateFn: (inputs) => {
        // En = (n^2 * h^2) / (8 * m * L^2)
        // h = 6.626e-34 J s
        // m = 9.109e-31 kg (electron mass)
        // L in meters = L_nm * 1e-9
        const n = inputs.n;
        const L = inputs.L * 1e-9;
        const h = 6.62607015e-34;
        const m = 9.10938356e-31;
        const energyJoules = (Math.pow(n, 2) * Math.pow(h, 2)) / (8 * m * Math.pow(L, 2));
        return energyJoules / 1.602176634e-19; // convert to eV
      }
    },
    derivation: "Developed by Erwin Schrödinger in 1925, synthesizing Louis de Broglie's wave-particle hypothesis into a partial differential wave equation.",
    realLifeExample: "Determining the stable electron energy orbits in a semiconductor crystal, crucial for silicon microchips.",
    simulationHint: "Wave function rendering as a dynamic sine wave oscillating within boundary walls."
  },
  {
    id: "gravitational-law",
    title: "Newton's Law of Universal Gravitation",
    formula: "F = G * (m₁ * m₂) / r²",
    meaning: "States that every particle attracts every other particle in the universe with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers.",
    variables: [
      { name: "Mass 1", symbol: "m1", unit: "kg", defaultValue: 5.972e24 }, // Earth
      { name: "Mass 2", symbol: "m2", unit: "kg", defaultValue: 7.347e22 }, // Moon
      { name: "Distance", symbol: "r", unit: "km", defaultValue: 384400 }
    ],
    calculator: {
      inputs: [
        { name: "Mass 1 (e.g. Earth)", symbol: "m1", unit: "kg (x10^24)", defaultValue: 5.972 },
        { name: "Mass 2 (e.g. Moon)", symbol: "m2", unit: "kg (x10^22)", defaultValue: 7.347 },
        { name: "Orbital Radius (Distance)", symbol: "r", unit: "km", defaultValue: 384400 }
      ],
      outputName: "Gravitational Force",
      outputSymbol: "F_g",
      outputUnit: "Newtons (N)",
      calculateFn: (inputs) => {
        const G = 6.6743e-11;
        const m1 = inputs.m1 * 1e24;
        const m2 = inputs.m2 * 1e22;
        const r = inputs.r * 1000; // convert km to meters
        return (G * m1 * m2) / Math.pow(r, 2);
      }
    },
    derivation: "Inferred by Newton by analyzing Kepler's third law of planetary motion, showing a universal 1/r² force field.",
    realLifeExample: "The Earth keeping the Moon in stable geocentric orbit, creating our marine ocean tides.",
    simulationHint: "Two spheres orbiting in space with vector lines showing attractive force intensity."
  },
  {
    id: "time-dilation-eq",
    title: "Relativistic Time Dilation",
    formula: "t' = t / √(1 - v²/c²)",
    meaning: "A difference in the elapsed time measured by two clocks, either due to a relative velocity (v) between them or a gravitational potential.",
    variables: [
      { name: "Proper Time", symbol: "t", unit: "seconds", defaultValue: 10 },
      { name: "Relative Velocity Ratio (v/c)", symbol: "beta", unit: "ratio", defaultValue: 0.9 }
    ],
    calculator: {
      inputs: [
        { name: "Stationary Observer Time", symbol: "t", unit: "years", defaultValue: 1 },
        { name: "Spacecraft Velocity Ratio (v/c)", symbol: "v_ratio", unit: "0.0 to 0.999", defaultValue: 0.9 }
      ],
      outputName: "Time Passed for Stationary Observer",
      outputSymbol: "t_prime",
      outputUnit: "Years",
      calculateFn: (inputs) => {
        const vRatio = Math.min(0.999999, Math.max(0, inputs.v_ratio));
        return inputs.t / Math.sqrt(1 - Math.pow(vRatio, 2));
      }
    },
    derivation: "Postulated by Albert Einstein as a consequence of the constancy of the speed of light in all inertial frames of reference.",
    realLifeExample: "The GPS satellites orbit Earth at high speeds and lower gravity. Their clocks must be adjusted by 38 microseconds per day to remain in sync with ground clocks.",
    simulationHint: "Side-by-side clocks showing a light pulse reflecting between mirrors inside a moving spacecraft versus on Earth."
  }
];

export const physicists: Physicist[] = [
  {
    id: "albert-einstein",
    name: "Albert Einstein",
    lifespan: "1879 - 1955",
    nationality: "German / Swiss / American",
    biography: "Widely regarded as the greatest physicist of the 20th century. He developed the theory of relativity, which revolutionized cosmology and modern quantum physics.",
    quote: "Gravitation is not responsible for people falling in love.",
    discoveries: ["Special Relativity", "General Relativity", "Photoelectric Effect", "Brownian Motion", "Bose-Einstein Condensate"],
    equations: ["E = mc²", "G_μν + Λg_μν = 8πG/c⁴ * T_μν"],
    awards: ["Nobel Prize in Physics (1921) for photoelectric effect", "Max Planck Medal (1929)"],
    experiments: ["Thought experiments (Gedankenexperimente)", "Bending of starlight verified by Arthur Eddington in 1919 eclipse"],
    books: ["Relativity: The Special and General Theory", "The Evolution of Physics"],
    legacy: "Fundamentally rewrote our concept of space, time, matter, and energy, replacing the mechanical universe of Newton with an elastic, four-dimensional spacetime continuum.",
    timeline: [
      { year: "1905", title: "Annus Mirabilis Papers", description: "Published four papers on Brownian motion, photoelectric effect, special relativity, and mass-energy equivalence." },
      { year: "1915", title: "General Relativity", description: "Formulated the gravitational field equations describing gravity as warping of spacetime geometry." },
      { year: "1921", title: "Nobel Prize Achievement", description: "Awarded the Nobel Prize for his law of the photoelectric effect." }
    ]
  },
  {
    id: "isaac-newton",
    name: "Sir Isaac Newton",
    lifespan: "1643 - 1727",
    nationality: "English",
    biography: "The absolute pioneer of classical physics, mathematics, and astronomy. He established the laws of motion, gravitation, and developed calculus.",
    quote: "If I have seen further it is by standing on the shoulders of Giants.",
    discoveries: ["Laws of Motion", "Law of Universal Gravitation", "Calculus", "Refracting Telescope", "Spectrum of White Light"],
    equations: ["F = ma", "F_g = G(m1*m2)/r²"],
    awards: ["Knighted by Queen Anne (1705)", "President of the Royal Society (1703-1727)"],
    experiments: ["Prism light refraction experiments proving light consists of full rainbow spectrum", "Calculated gravitational orbit of planets"],
    books: ["Philosophiæ Naturalis Principia Mathematica", "Opticks"],
    legacy: "Formulated the mathematical foundation of physics that reigned supreme for over 200 years and still guides all rocket engineering, bridge design, and space missions today.",
    timeline: [
      { year: "1665", title: "The Plague Year (Miracle Year)", description: "During isolation from Cambridge, he invented calculus, analyzed light spectrums, and began the gravity concept." },
      { year: "1687", title: "Principia Publication", description: "Unveiled the three laws of motion and universal gravity, laying down classical mechanics." },
      { year: "1704", title: "Opticks Published", description: "Detailed his experiments with light, refraction, and particle theory of light." }
    ]
  },
  {
    id: "richard-feynman",
    name: "Richard Feynman",
    lifespan: "1918 - 1988",
    nationality: "American",
    biography: "One of the most charismatic and influential theoretical physicists. He developed quantum electrodynamics (QED), formulated path integrals, and pioneered quantum computing and nanotechnology concepts.",
    quote: "I, a universe of atoms, an atom in the universe.",
    discoveries: ["Quantum Electrodynamics", "Feynman Diagrams", "Path Integral Formulation", "Superfluidity in Liquid Helium", "Nanotechnology Concept"],
    equations: ["∫ e^(iS/ħ) Dx"],
    awards: ["Nobel Prize in Physics (1965) for QED", "Oersted Medal (1972)"],
    experiments: ["Manhattan Project core calculations", "Challenger Space Shuttle O-Ring iced-water demonstration"],
    books: ["Surely You're Joking, Mr. Feynman!", "The Feynman Lectures on Physics"],
    legacy: "Known for his incredible teaching ability (The Feynman Technique) and making quantum electrodynamics accessible visually through 'Feynman Diagrams'.",
    timeline: [
      { year: "1942", title: "Manhattan Project Contribution", description: "Worked at Los Alamos calculating nuclear yield and chain reaction formulas." },
      { year: "1948", title: "Feynman Diagrams Invented", description: "Introduced space-time graphical representations of subatomic particle interactions." },
      { year: "1965", title: "Nobel Prize Winner", description: "Won the Nobel Prize jointly with Schwinger and Tomonaga for fundamental work in Quantum Electrodynamics." }
    ]
  },
  {
    id: "marie-curie",
    name: "Marie Skłodowska-Curie",
    lifespan: "1867 - 1934",
    nationality: "Polish / French",
    biography: "The first person to win two Nobel Prizes, and the only person to win them in two different sciences (Physics and Chemistry). She pioneered radioactivity research and discovered Polonium and Radium.",
    quote: "Nothing in life is to be feared, it is only to be understood.",
    discoveries: ["Radioactivity", "Polonium", "Radium", "Mobile X-Ray Field Units"],
    equations: ["A = -dN/dt = λN"],
    awards: ["Nobel Prize in Physics (1903)", "Nobel Prize in Chemistry (1911)"],
    experiments: ["Isolating radioactive isotopes from pitchblende ores", "Measuring radioactivity fields"],
    books: ["Recherches sur les substances radioactives"],
    legacy: "Laid the foundational groundwork for atomic science, nuclear therapy in oncology, and shattered barriers for women in STEM.",
    timeline: [
      { year: "1898", title: "Element Discovery", description: "Discovered polonium and radium after painstakingly crushing kilograms of pitchblende." },
      { year: "1903", title: "First Nobel Prize", description: "Shared the Physics Nobel with Pierre Curie and Henri Becquerel for radiation studies." },
      { year: "1911", title: "Second Nobel Prize", description: "Awarded the Chemistry Nobel for isolating radium and studying its chemical properties." }
    ]
  }
];

export const cosmicNodes: CosmicNode[] = [
  {
    id: "earth",
    name: "Earth",
    scale: "12,742 km (Diameter)",
    type: "planet",
    description: "Our home planet, the only known orbital object in the cosmos harboring life, featuring liquid surface oceans and a protective magnetosphere.",
    fact: "Earth is traveling around the sun at a staggering velocity of 107,000 kilometers per hour (66,000 mph).",
    coordinates: { x: 0, y: 0, z: 0 }
  },
  {
    id: "moon",
    name: "The Moon",
    scale: "384,400 km (Orbital Radius)",
    type: "planet",
    description: "Earth's singular natural satellite, stabilizing our planet's axial wobble and guiding oceanic tides.",
    fact: "The Moon is drifting away from Earth at a rate of 3.8 centimeters (1.5 inches) per year.",
    parent: "earth",
    coordinates: { x: 1.5, y: 0.2, z: 0.5 }
  },
  {
    id: "mars",
    name: "Mars",
    scale: "225,000,000 km (Distance from Earth)",
    type: "planet",
    description: "The Red Planet, featuring massive ancient shield volcanoes like Olympus Mons, vast canyons, and trace ice caps.",
    fact: "Mars' gravity is only 38% of Earth's gravity, meaning you could jump nearly three times higher there.",
    parent: "earth",
    coordinates: { x: 4.5, y: -0.5, z: -1.2 }
  },
  {
    id: "jupiter",
    name: "Jupiter",
    scale: "778,500,000 km (Distance from Sun)",
    type: "planet",
    description: "The gas giant behemoth, keeping a shield over the inner solar system with its massive gravitational presence.",
    fact: "Jupiter has a storm called the Great Red Spot that is wider than the entire planet Earth and has raged for over 300 years.",
    parent: "earth",
    coordinates: { x: 9.0, y: 1.1, z: 2.0 }
  },
  {
    id: "sagittarius-a",
    name: "Sagittarius A* (Supermassive Black Hole)",
    scale: "26,000 light-years from Earth",
    type: "blackhole",
    description: "The supermassive black hole anchor at the dynamic center of our Milky Way Galaxy, with a mass of 4.3 million Suns.",
    fact: "Spacetime is warped so violently near Sagittarius A* that stars orbit it at over 8,000 kilometers per second.",
    parent: "milky-way",
    coordinates: { x: 22, y: -15, z: -8 }
  },
  {
    id: "milky-way",
    name: "Milky Way Galaxy",
    scale: "100,000 light-years (Diameter)",
    type: "galaxy",
    description: "Our home barred spiral galaxy, containing 100 to 400 billion stars, swirling and rotating around a central galactic bulge.",
    fact: "The Milky Way is currently on a collision course with our neighbor Andromeda Galaxy, set to merge in 4.5 billion years.",
    coordinates: { x: 120, y: 40, z: -60 }
  },
  {
    id: "observable-universe",
    name: "The Observable Universe",
    scale: "93,000,000,000 light-years (Diameter)",
    type: "universe",
    description: "The entire sphere of cosmic space that can be seen from Earth, bounded by the cosmic microwave background radiation (CMB).",
    fact: "The observable universe contains over 2 trillion individual galaxies, each holding hundreds of billions of solar stars.",
    coordinates: { x: 1000, y: 1000, z: 1000 }
  }
];

export const initialTopics: PhysicsTopic[] = [
  {
    id: "quantum-physics",
    name: "Quantum Mechanics",
    branchId: "quantum-mechanics",
    definition: "Quantum mechanics is the study of matter and energy at the scale of atoms, molecular orbitals, and subatomic elements. It challenges Newtonian mechanics by introducing quantization, wave-particle duality, and Heisenberg's uncertainty principle.",
    history: "Quantum theory emerged at the turn of the 20th century to explain blackbody radiation (Max Planck, 1900) and the photoelectric effect (Albert Einstein, 1905). Niels Bohr formulated quantized atomic orbits (1913), and Werner Heisenberg and Erwin Schrödinger created the rigorous matrix and wave mechanics formulations (1925-1926).",
    discoverer: "Max Planck, Albert Einstein, Erwin Schrödinger, Werner Heisenberg, Louis de Broglie, Paul Dirac, Niels Bohr",
    timeline: [
      { year: "1900", title: "Planck's Constant", description: "Max Planck postulated that energy of radiation is quantized: E = hν, resolving the Ultraviolet Catastrophe." },
      { year: "1905", title: "Photoelectric Effect", description: "Albert Einstein proposed that light consists of discrete energy quanta (photons) to eject electrons." },
      { year: "1924", title: "Wave-Particle Duality", description: "Louis de Broglie argued that all matter possesses an associated de Broglie wavelength λ = h/p." },
      { year: "1927", title: "Uncertainty Principle", description: "Werner Heisenberg proved that position and momentum cannot be simultaneously measured with absolute precision: Δx * Δp ≥ ħ/2." }
    ],
    mathematics: {
      formula: "iħ ∂/∂t |ψ⟩ = Ĥ|ψ⟩",
      derivation: "Developed from wave equations, combining de Broglie's relation with the classical conservation of energy. It describes the evolution of a complex wave function ψ representing probability amplitudes.",
      proof: "The Schrödinger equation represents a fundamental postulate. Its proof is experimental, successfully calculating the exact energy levels, emission spectra, and wave properties of the hydrogen atom, verified to 12 decimal places."
    },
    realExperiment: "The Double-Slit Experiment: Proves that when individual electrons or photons are fired through two slits, they form an interference pattern on the detector screen, showing wave-like behavior even for physical matter, unless they are observed, which collapses the wave function.",
    easySummary: "Think of quantum physics as the rules of a cosmic video game at the microscopic level. Particles don't sit in one spot; they behave like waves of possibilities, being in multiple places at once (superposition) until you 'look' at them, forcing them to choose a definite location.",
    expertSummary: "Quantum mechanics is formulated in a complex Hilbert space where physical states are vectors and observables are self-adjoint operators. The dynamics of states are governed by the unitary time-evolution operator of the Schrödinger Equation. The transition from wave amplitudes to probabilities is defined by Born's Rule, and measurement induces wave-function collapse (Copenhagen) or branching (Many-Worlds).",
    researchSummary: "Modern research explores Quantum Entanglement and the violation of Bell's inequalities, proving local realism is false. Key frontiers are quantum computing algorithms (Shor's, Grover's), topological qubits for fault-tolerant computation, and high-temperature superconductor electron dynamics governed by quantum spin liquids.",
    applications: {
      space: "Quantum atomic clocks inside GPS and deep-space communications, offering nanosecond timing precision.",
      medicine: "Magnetic Resonance Imaging (MRI) scanners relying on nuclear magnetic resonance spins of hydrogen nuclei.",
      military: "Quantum cryptography and quantum key distribution (QKD) enabling mathematically unbreakable communications.",
      engineering: "Silicon semiconductors, transistors, and diodes that power every mobile phone and supercomputer globally.",
      dailyLife: "LED lightbulbs operating on electron-hole quantum recombination to emit high-efficiency photons."
    },
    practiceQuestions: [
      {
        question: "Which equation represents the de Broglie wavelength of a moving particle?",
        options: [
          "λ = h * p",
          "λ = h / p",
          "λ = mc² / h",
          "λ = h * f"
        ],
        correctAnswer: 1,
        explanation: "The de Broglie relation states λ = h/p, where h is Planck's constant and p is momentum (m*v)."
      },
      {
        question: "What physical concept prevents positioning an electron and measuring its velocity simultaneously with perfect accuracy?",
        options: [
          "Copenhagen Collapse",
          "Born's Rule",
          "Heisenberg's Uncertainty Principle",
          "The Zeeman Effect"
        ],
        correctAnswer: 2,
        explanation: "Heisenberg's Uncertainty Principle states that the product of the uncertainties of position and momentum is at least ħ/2."
      }
    ],
    flashcards: [
      { front: "Superposition", back: "The ability of a quantum system to be in multiple states simultaneously until a measurement is performed." },
      { front: "Quantum Entanglement", back: "A state where two or more particles are linked such that the state of one instantly determines the state of the other, regardless of distance." }
    ],
    papers: [
      { title: "Can Quantum-Mechanical Description of Physical Reality be Considered Complete?", authors: "A. Einstein, B. Podolsky, N. Rosen", journal: "Physical Review", year: "1935", doi: "10.1103/PhysRev.47.777", confidence: 99 }
    ],
    verification: {
      evidence: "Verified through quantum electrodynamics, atomic lasers, and thousands of semiconductor and particle accelerator experiments.",
      confidenceScore: 100,
      lastVerified: "2026-06-15",
      peerReviewStatus: "Globally accepted as the foundation of modern chemical and physical science.",
      contradictingTheories: "None within its valid range; at macroscopic scales, it smoothly converges to classical mechanics (Correspondence Principle)."
    },
    futureScope: "Developing topological quantum computers, finding a quantum theory of gravity (Loop Quantum Gravity or String Theory), and creating rooms-temperature superconductors.",
    relatedTopics: ["quantum-computing", "particle-physics", "solid-state-physics"]
  },
  {
    id: "black-holes",
    name: "Black Holes",
    branchId: "cosmology-astronomy",
    definition: "A black hole is a region of spacetime where gravity is so strong that nothing, including light or other electromagnetic waves, has enough energy to escape its event horizon.",
    history: "In 1916, Karl Schwarzschild found the first exact solution to Einstein's General Relativity, which predicted a point of infinite gravitational density. John Wheeler coined the term 'black hole' in 1967. Hawking discovered Hawking Radiation in 1974. In 2019, the Event Horizon Telescope captured the first direct silhouette of M87*.",
    discoverer: "Karl Schwarzschild, J. Robert Oppenheimer, John Wheeler, Stephen Hawking, Roger Penrose",
    timeline: [
      { year: "1916", title: "Schwarzschild Solution", description: "Karl Schwarzschild solved Einstein's field equations for a non-rotating spherical mass, revealing the event horizon radius." },
      { year: "1939", title: "Oppenheimer Gravitational Collapse", description: "Oppenheimer and Snyder calculated how a massive star collapses indefinitely under its own gravity." },
      { year: "1974", title: "Hawking Radiation", description: "Stephen Hawking proved quantum effects cause black holes to slowly leak thermal radiation and eventually evaporate." },
      { year: "2015", title: "First LIGO Gravitational Wave Detection", description: "Laser Interferometer Gravitational-Wave Observatory detected ripples from the merger of two black holes 1.3 billion light-years away." }
    ],
    mathematics: {
      formula: "R_s = 2GM / c²",
      derivation: "The Schwarzschild radius formula is derived by finding where the coordinate singularity occurs in the Schwarzschild metric of Einstein's field equations, or classically where the escape velocity equals the speed of light.",
      proof: "Proven mathematically inside General Relativity and verified observationally by tracking the high-speed orbital stellar dynamics of stars like S2 around Sagittarius A*."
    },
    realExperiment: "Gravitational Wave Observatories (LIGO & Virgo): These massive L-shaped laser tunnels detect spacetime squeezing smaller than a fraction of a proton's width, resulting from black hole collisions across the cosmos.",
    easySummary: "A black hole is like a cosmic whirlpool in space. When a huge star dies, it collapses into a point so tiny and heavy that its gravitational pull becomes irresistible. Once you pass a boundary called the 'Event Horizon' (the point of no return), you'd need to go faster than light to escape, which is physically impossible!",
    expertSummary: "Black holes are characterized entirely by three externally observable classical parameters: mass, charge, and angular momentum, according to the No-Hair Theorem. In General Relativity, the center contains a gravitational singularity where the Weyl curvature becomes infinite. In quantum field theory, virtual particle-antiparticle pairs near the horizon lead to quantum evaporation (Hawking Radiation) with an inverse mass temperature relation.",
    researchSummary: "Current frontiers address the Black Hole Information Paradox: does quantum information crossing the event horizon get destroyed? Holographic Principle and AdS/CFT correspondence suggest information is encoded on the boundary. Scientists also study primordial black holes as dark matter candidates and shadow accretion profiles using Earth-scale interferometry.",
    applications: {
      space: "Acts as ultimate cosmic laboratories to test extreme gravitational limits of General Relativity.",
      medicine: "Spinoff algorithms used in processing EHT black hole images are adapted to clarify high-resolution medical MRI and CT scans.",
      military: "None (Theoretical astrophysics, completely safe at stellar distances).",
      engineering: "Extremely sensitive laser phase sensors designed for LIGO gravitational wave detection are now utilized in high-precision microchip lithography.",
      dailyLife: "Inspires globally unified research networks, supercomputing clusters, and public scientific engagement."
    },
    practiceQuestions: [
      {
        question: "What is the name of the boundary beyond which nothing, not even light, can escape a black hole?",
        options: [
          "Singularity Point",
          "Roche Limit",
          "Event Horizon",
          "Schwarzschild Core"
        ],
        correctAnswer: 2,
        explanation: "The Event Horizon is the mathematically defined boundary of a black hole where the escape velocity equals the speed of light."
      }
    ],
    flashcards: [
      { front: "Schwarzschild Radius", back: "The radius of the event horizon for a non-rotating, spherical mass. Rs = 2GM/c²." },
      { front: "Spaghettification", back: "The vertical stretching and horizontal squeezing of an object falling into a black hole due to extreme tidal forces." }
    ],
    papers: [
      { title: "Black Hole Exploded?", authors: "S. W. Hawking", journal: "Nature", year: "1974", doi: "10.1038/248030a0", confidence: 98 }
    ],
    verification: {
      evidence: "Verified via LIGO gravitational wave signatures, Sgr A* orbital tracking (Nobel Prize 2020), and direct imaging by the Event Horizon Telescope.",
      confidenceScore: 99,
      lastVerified: "2026-05-10",
      peerReviewStatus: "Astro-observationally fully accepted.",
      contradictingTheories: "Naked singularities (denied by Cosmic Censorship Hypothesis), Gravastars, or Fuzzballs in string theory."
    },
    futureScope: "Deploying space-based laser interferometers (LISA) to detect low-frequency supermassive black hole mergers, and resolving the quantum structure of the central singularity.",
    relatedTopics: ["special-relativity", "general-relativity", "cosmology"]
  }
];
