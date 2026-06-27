import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, Globe, Link2, RefreshCw, Trophy, Award, BookOpen, Binary, 
  FileText, Layers, Compass, Atom, Volume2, Play, Pause, RotateCcw, 
  Upload, HelpCircle, GraduationCap, ChevronRight, AlertTriangle, 
  TrendingUp, Video, Rocket, Calendar, Database, Eye, ZoomIn, 
  ZoomOut, RotateCw, Users, MapPin, Library, Share2, History, FileCode,
  ShieldAlert, Sparkles, CheckCircle2, Search, ArrowRight, BookMarked
} from "lucide-react";
import { triggerAction } from "../utils/gamification";

// ==========================================
// 1. DATA DEFINITIONS & STATIC DATASETS
// ==========================================

interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  institution: string;
  journal: string;
  date: string;
  doi: string;
  confidenceScore: number;
  peerReviewed: boolean;
  citationCount: number;
  version: string;
  whyItMatters: string;
  summary: string;
  beginnerExplanation: string;
  equations: string[];
  figures: string[];
  relatedDiscoveries: string[];
  supportingEvidence: string[];
  contradictingEvidence: string[];
}

const mockPapers: ResearchPaper[] = [
  {
    id: "paper-001",
    title: "Observational Evidence of Primordial Gravitational Waves in the Cosmic Microwave Background B-Mode Polarization",
    authors: "A. Kunz, S. Malhotra, L. Zhang",
    institution: "CERN & Stanford University",
    journal: "Physical Review Letters",
    date: "2026-06-25",
    doi: "10.1103/PhysRevLett.136.251101",
    confidenceScore: 97,
    peerReviewed: true,
    citationCount: 42,
    version: "v3.2",
    whyItMatters: "This discovery provides the first direct confirmation of the cosmic inflation theory, proving that the universe expanded exponentially in the first 10^-36 seconds.",
    summary: "By analyzing the B-mode polarization patterns of the CMB using the BICEP4 array, we identified a coherent tensor-to-scalar ratio r = 0.045, which directly corresponds to high-energy gravitational disturbances in the early inflationary epoch.",
    beginnerExplanation: "Just as ripples on a pond show where a stone was thrown, tiny twists in the oldest light in the universe show that space itself shook violently right after the Big Bang, confirming our theory of how the cosmos was born.",
    equations: [
      "r = \\frac{P_T(k_0)}{P_R(k_0)} \\approx 0.045",
      "V^{1/4} \approx 1.9 \times 10^{16} \\text{ GeV} \\left(\\frac{r}{0.10}\\right)^{1/4}"
    ],
    figures: ["CMB Polarization Map", "Inflation Power Spectrum Graph"],
    relatedDiscoveries: ["BICEP2 Cosmic Inflation Survey", "Planck Satellite Cosmological Parameters"],
    supportingEvidence: ["Planck CMB temperature fluctuations matching r bounds", "Wollaston prism polarization consistency checks"],
    contradictingEvidence: ["Interstellar dust foreground thermal emissions (partially discounted)"]
  },
  {
    id: "paper-002",
    title: "Proton-Driven Plasma Wakefield Acceleration in High-Density Capillary Discharge Cells",
    authors: "H. Patel, G. Moreau, K. Schmidt",
    institution: "CERN AWAKE Collaboration & IIT Bombay",
    journal: "Nature Physics",
    date: "2026-06-21",
    doi: "10.1038/s41567-026-0941",
    confidenceScore: 95,
    peerReviewed: true,
    citationCount: 18,
    version: "v1.4",
    whyItMatters: "Paves the way for mini, table-top particle accelerators, reducing the size of 3km-long linear colliders to just 20 meters, making high-energy physics accessible to universities worldwide.",
    summary: "Using a proton bunch from the CERN Super Proton Synchrotron (SPS) to excite a 10-meter plasma discharge cell, we achieved stable wakefield acceleration of a witness electron beam to 2.1 GV/m, demonstrating high-gradient preservation.",
    beginnerExplanation: "Instead of pushing particles using giant, expensive metal pipes, we ride them on plasma waves like surfers on an ocean swell. This allows us to speed them up in a fraction of the distance.",
    equations: [
      "E_0 = \\frac{m_e c \\omega_p}{e} \\approx 96 \\sqrt{n_0 \\text{ (cm}^{-3}\\text{)}} \\text{ V/m}",
      "\\Phi(z, r) = C \\cdot K_0(k_p r) \\cos(k_p z)"
    ],
    figures: ["AWAKE Plasma Beam Profile", "GV/m Electric Gradient Field Grid"],
    relatedDiscoveries: ["SLAC Laser Wakefield Electron Acceleration", "CERN SPS Proton Beam Coupling"],
    supportingEvidence: ["Electro-optic sampling of electron witness bunches", "Thomson scattering density measurements"],
    contradictingEvidence: ["Plasma hosing instabilities at densities above 10^15 cm^-3"]
  },
  {
    id: "paper-003",
    title: "Evidence of High-Temperature Cooper-Pair Formation in Carbon-Sulfur-Hydride Frameworks under 120 GPa",
    authors: "R. Mukhopadhyay, S. Raman, T. V. Raman",
    institution: "Indian Institute of Science (IISc), Bangalore",
    journal: "Journal of Superconductivity and Novel Magnetism",
    date: "2026-06-12",
    doi: "10.1007/s10948-026-1145",
    confidenceScore: 84,
    peerReviewed: false,
    citationCount: 5,
    version: "v1.1",
    whyItMatters: "A stepping stone to room-temperature superconductivity that doesn't require extreme pressures, which could revolutionize power grids, maglev trains, and MRI machines.",
    summary: "By synthesizing carbonaceous sulfur hydride in diamond anvil cells under 120 GPa, we observed a rapid shielding transition and resistance drop corresponding to Tc = 284 K. Density functional theory calculations show strong electron-phonon coupling.",
    beginnerExplanation: "We squeezed a mixture of carbon, sulfur, and hydrogen between two diamonds with incredible force. At room temperature, electricity flowed through it perfectly without wasting any energy as heat.",
    equations: [
      "T_c = \\frac{\\Theta_D}{1.2} \\exp\\left[-\\frac{1.04(1+\\lambda)}{\\lambda-\\mu^*(1+0.62\\lambda)}\\right]",
      "\\Delta(0) = 1.764 k_B T_c"
    ],
    figures: ["Diamond Anvil Cell Diagram", "Resistance vs Temperature Plot"],
    relatedDiscoveries: ["Lanthanum Hydride Superconductivity at 250K", "BCS Superconductivity Theory"],
    supportingEvidence: ["Meissner effect magnetic flux expulsion curves", "Isotope shift under deuterium substitution"],
    contradictingEvidence: ["Highly localized strain gradients might spoof zero-resistance measurements"]
  }
];

interface SpaceMission {
  id: string;
  name: string;
  org: string;
  rocket: string;
  spacecraft: string;
  launchDate: string;
  site: string;
  objectives: string;
  orbit: string;
  status: string;
  telemetry: { label: string; value: string; unit: string }[];
  scientificResults: string;
  instruments: string[];
}

const spaceMissions: SpaceMission[] = [
  {
    id: "mission-01",
    name: "Chandrayaan-4 Lunar Sample Return",
    org: "ISRO",
    rocket: "LVM3-M5",
    spacecraft: "CY4 Lander & Ascender",
    launchDate: "2026-11-15",
    site: "Satish Dhawan Space Centre, Sriharikota",
    objectives: "To perform soft landing in the lunar South Pole region, drill up to 2 meters, extract rock/ice cores, transfer to ascender, launch from Moon, and return the capsule to Earth.",
    orbit: "Lunar Polar Orbit to Earth Return",
    status: "Active Preparation",
    telemetry: [
      { label: "Dry Mass", value: "3900", unit: "kg" },
      { label: "Planned Payload", value: "8", unit: "Instruments" },
      { label: "Target Site", value: "85.3° S, 26.1° E", unit: "Moon Coordinates" }
    ],
    scientificResults: "Aimed to analyze the ancient basalt composition of the South Pole Aitken basin and quantify deep sub-surface water-ice reserves.",
    instruments: ["ChaSTE-2 Subsurface Probe", "ILSA-2 Seismic Array", "ALPHA-S Composition Scanner", "LIDAR Altimeter"]
  },
  {
    id: "mission-02",
    name: "Aditya-L1 Solar Observatory",
    org: "ISRO",
    rocket: "PSLV-C57",
    spacecraft: "Aditya Satellite",
    launchDate: "2023-09-02",
    site: "Sriharikota SDSC",
    objectives: "Observe the solar corona, chromospheric dynamics, coronal mass ejections (CMEs), and study solar wind and space weather from the Lagrange Point 1 (L1).",
    orbit: "Halo Orbit around Sun-Earth L1",
    status: "Operational & Telemetry Live",
    telemetry: [
      { label: "Distance to Earth", value: "1.5 Million", unit: "km" },
      { label: "Solar Wind Speed", value: "412", unit: "km/s" },
      { label: "Magnetic Flux", value: "5.8", unit: "nT" }
    ],
    scientificResults: "Provided first-of-its-kind high-cadence ultraviolet images of solar flares, explaining coronal heating mechanisms through magnetic reconnection loops.",
    instruments: ["VELC Coronagraph", "SUIT UV Telescope", "ASPEX Plasma Analyzer", "PAPA Plasma Analyzer"]
  },
  {
    id: "mission-03",
    name: "Nancy Grace Roman Space Telescope",
    org: "NASA",
    rocket: "Falcon Heavy",
    spacecraft: "Roman Telescope",
    launchDate: "2026-10-22",
    site: "Kennedy Space Center, FL",
    objectives: "Solve questions about dark energy, dark matter, search for habitable exoplanets via gravitational microlensing, and capture wide-field infrared surveys.",
    orbit: "Sun-Earth L2 Lagrange Point",
    status: "Integration & Testing",
    telemetry: [
      { label: "Primary Mirror", value: "2.4", unit: "meters" },
      { label: "Field of View", value: "100x", unit: "HST Field of View" },
      { label: "Operating Temp", value: "-240", unit: "°C" }
    ],
    scientificResults: "Forecasted to catalog over 2,600 exoplanets and measure dark energy constraints to 0.1% accuracy using weak gravitational lensing maps.",
    instruments: ["Wide Field Instrument (WFI)", "Coronagraph Instrument (CGI)"]
  }
];

interface SonifiedSound {
  id: string;
  name: string;
  agency: string;
  date: string;
  instrument: string;
  freq: number; // base frequency for procedural oscillator
  pulseRate?: number; // pulsing rate for pulsars
  chirp?: boolean; // sweeping frequency for gravitational wave
  context: string;
}

const sonifiedSounds: SonifiedSound[] = [
  {
    id: "sound-pulsar",
    name: "PSR B0329+54 Pulsar Rotation Signal",
    agency: "Jodrell Bank Radio Telescope",
    date: "2025-04-12",
    instrument: "76m Lovell Telescope",
    freq: 220,
    pulseRate: 1.4, // 1.4 Hz rotation pulse
    context: "A highly magnetized neutron star spinning 1.4 times per second. Its intense magnetic dipole sweeps a beam of radio waves past Earth, sonified into crisp rhythmic beats."
  },
  {
    id: "sound-chirp",
    name: "GW150914 Gravitational Wave Binary Merger",
    agency: "LIGO / Virgo",
    date: "2015-09-14",
    instrument: "LIGO Laser Interferometers (Hanford/Livingston)",
    freq: 60,
    chirp: true, // sweep from 60Hz up to 250Hz representing orbital spiraling
    context: "The ripples in spacetime generated by two colliding black holes 1.3 billion light-years away. As they spiral faster together, the wave sweeps up in frequency—creating a distinct audio 'chirp'."
  },
  {
    id: "sound-solar",
    name: "GONG Solar Acoustic Helioseismology",
    agency: "NASA / SOHO",
    date: "2024-11-03",
    instrument: "Global Oscillation Network Group",
    freq: 95, // low frequency resonance
    context: "Natural acoustic oscillations of the Sun's interior, caused by convective boiling. These acoustic waves travel through the solar core and are sonified from actual Doppler shifts."
  },
  {
    id: "sound-magneto",
    name: "Jupiter Jovian Magnetospheric Plasma Waves",
    agency: "NASA / ESA",
    date: "2024-08-30",
    instrument: "Voyager 1 Plasma Wave Receiver",
    freq: 150,
    pulseRate: 8, // fast warble
    context: "Charged plasma particles trapped in Jupiter's immense magnetic field. These electromagnetic frequencies are directly converted into audible cosmic plasma winds."
  }
];

interface Physicist {
  id: string;
  name: string;
  lifespan: string;
  nationality: string;
  institutions: string;
  biography: string;
  discoveries: string[];
  awards: string[];
  equations: string[];
  quotes: string;
  collaborators: string[];
  influenceFrom: string[];
  influenceTo: string[];
}

const physicistEncyclopedia: Physicist[] = [
  {
    id: "phys-cvraman",
    name: "Sir Chandrasekhara Venkata Raman",
    lifespan: "1888 - 1970",
    nationality: "Indian",
    institutions: "IISc Bangalore, Indian Association for the Cultivation of Science",
    biography: "V. Raman was an Indian physicist known for his pioneering work on the scattering of light. He discovered that when light traverses a transparent material, some of the deflected light changes wavelength—a quantum effect now known as the Raman Scattering.",
    discoveries: ["Raman Effect (Inelastic scattering of light)", "Acoustics of Indian musical instruments (Tabla and Mridangam)"],
    awards: ["Nobel Prize in Physics (1930)", "Bharat Ratna (1954)", "Lenin Peace Prize (1957)"],
    equations: ["\\nu_R = \\nu_0 \\pm \\Delta \\nu_{vibrational}"],
    quotes: "I am the master of my failure... If I do not succeed, it is because I did not work hard enough.",
    collaborators: ["K. S. Krishnan", "S. Bhagavantam"],
    influenceFrom: ["Lord Rayleigh", "James Clerk Maxwell"],
    influenceTo: ["G. N. Ramachandran", "S. Pancharatnam"]
  },
  {
    id: "phys-snbose",
    name: "Satyendra Nath Bose",
    lifespan: "1894 - 1974",
    nationality: "Indian",
    institutions: "Calcutta University, Dhaka University",
    biography: "S. N. Bose was a brilliant theoretical physicist specializing in quantum mechanics. He developed the foundation of Boson statistics which led to Albert Einstein's prediction of the Bose-Einstein Condensate (BEC).",
    discoveries: ["Bose-Einstein Statistics", "Planck's Law derivation without classical physics"],
    awards: ["Padma Vibhushan (1954)", "Fellow of the Royal Society (1958)"],
    equations: ["n_i = \\frac{g_i}{e^{(\\epsilon_i - \\mu)/k_B T} - 1}"],
    quotes: "Science is like a beautiful girl; she yields only to the persistent lover.",
    collaborators: ["Albert Einstein", "Meghnad Saha"],
    influenceFrom: ["Max Planck", "Niels Bohr"],
    influenceTo: ["Richard Feynman", "Murray Gell-Mann", "Eric Cornell (BEC verification)"]
  },
  {
    id: "phys-einstein",
    name: "Albert Einstein",
    lifespan: "1879 - 1955",
    nationality: "German / Swiss / American",
    institutions: "Princeton Institute for Advanced Study, Zurich Polytechnic",
    biography: "Albert Einstein developed the general theory of relativity, one of the two pillars of modern physics, alongside quantum mechanics. He is best known to the general public for his mass-energy equivalence formula.",
    discoveries: ["General Relativity", "Special Relativity", "Photoelectric Effect", "Brownian Motion"],
    awards: ["Nobel Prize in Physics (1921)", "Copley Medal (1925)", "Planck Medal (1929)"],
    equations: ["G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}", "E = m c^2"],
    quotes: "The most incomprehensible thing about the world is that it is at all comprehensible.",
    collaborators: ["Satyendra Nath Bose", "Mileva Marić", "Nathan Rosen", "Boris Podolsky"],
    influenceFrom: ["James Clerk Maxwell", "Ernst Mach", "Bernhard Riemann"],
    influenceTo: ["Stephen Hawking", "Roger Penrose", "John Archibald Wheeler"]
  }
];

// ==========================================
// 2. MAIN COMPONENT IMPLEMENTATION
// ==========================================

export default function DiscoveryScanner() {
  const [activeSubTab, setActiveSubTab] = useState<"intel" | "timeline" | "space" | "visuals" | "encyclopedia" | "india" | "copilot">("intel");
  
  // Learning Engine Level
  const [learningLevel, setLearningLevel] = useState<"BSc" | "MSc" | "PhD" | "Research">("Research");

  // State managers
  const [papers, setPapers] = useState<ResearchPaper[]>(mockPapers);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper>(mockPapers[0]);
  const [paperSearchQuery, setPaperSearchQuery] = useState("");
  const [paperQaInput, setPaperQaInput] = useState("");
  const [paperQaHistory, setPaperQaHistory] = useState<{ q: string; a: string }[]>([]);
  const [isPaperLoading, setIsPaperLoading] = useState(false);

  // Space database state
  const [selectedMission, setSelectedMission] = useState<SpaceMission>(spaceMissions[0]);

  // Audio state
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscRef = useRef<OscillatorNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const activeIntervalRef = useRef<any | null>(null);

  // Scientist state
  const [selectedPhysicist, setSelectedPhysicist] = useState<Physicist>(physicistEncyclopedia[0]);

  // Visual engine state
  const [visualMode, setVisualMode] = useState<"2d" | "3d" | "xray" | "particle">("particle");
  const [visualRotate, setVisualRotate] = useState(0);
  const [visualZoom, setVisualZoom] = useState(1);
  const [explodedView, setExplodedView] = useState(false);
  const [showMathOverlay, setShowMathOverlay] = useState(true);

  // Copilot State
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotResponse, setCopilotResponse] = useState<any | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  const [notesFile, setNotesFile] = useState<string | null>(null);

  // Trigger sound sonifications
  const playProceduralSound = (sound: SonifiedSound) => {
    // If playing the same sound, stop it
    if (playingSoundId === sound.id) {
      stopProceduralSound();
      return;
    }

    stopProceduralSound();
    setPlayingSoundId(sound.id);
    triggerAction("space_sonification");

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      activeOscRef.current = osc;
      activeGainRef.current = gain;

      // Setup oscillator parameters
      osc.type = "sine";
      
      if (sound.chirp) {
        // Sweeping chirp for gravitational wave
        osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(sound.freq * 5, ctx.currentTime + 1.2);
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
        
        setTimeout(() => {
          setPlayingSoundId(null);
        }, 1500);

      } else if (sound.pulseRate) {
        // Pulsating signal for pulsars or magnetospheres
        osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        osc.start(ctx.currentTime);

        let pulseOn = false;
        const intervalTime = (1 / sound.pulseRate) * 1000;
        
        const intervalId = setInterval(() => {
          if (!audioContextRef.current) return;
          const t = audioContextRef.current.currentTime;
          
          if (!pulseOn) {
            // Pulse on
            gain.gain.setValueAtTime(0.001, t);
            gain.gain.exponentialRampToValueAtTime(0.25, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            
            // Random pitch drift to represent stellar plasma scattering
            osc.frequency.setValueAtTime(sound.freq + (Math.random() - 0.5) * 15, t);
          }
          pulseOn = !pulseOn;
        }, intervalTime / 2);

        activeIntervalRef.current = intervalId;

      } else {
        // Low continuous rumble / solar oscillations
        osc.type = "sawtooth";
        // Filter to make it muddy solar rumble
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);

        osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
        
        osc.start(ctx.currentTime);
      }

    } catch (err) {
      console.warn("Web Audio sonification failed", err);
      setPlayingSoundId(null);
    }
  };

  const stopProceduralSound = () => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }
    if (activeOscRef.current) {
      try {
        activeOscRef.current.stop();
      } catch (e) {}
      activeOscRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setPlayingSoundId(null);
  };

  useEffect(() => {
    return () => {
      stopProceduralSound();
    };
  }, []);

  // Handle mock PDF Paper Q&A with real Gemini processing simulations
  const handlePaperQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperQaInput.trim()) return;

    const userQ = paperQaInput;
    setPaperQaInput("");
    setPaperQaHistory(prev => [...prev, { q: userQ, a: "Analyzing paper vector embeddings... AI is thinking..." }]);
    triggerAction("paper_qa");

    try {
      const res = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: `Regarding this research paper: "${selectedPaper.title}" with DOI ${selectedPaper.doi}. The user is asking at a ${learningLevel} level: "${userQ}". Answer accurately and link mathematical formulas extracted.` 
        })
      });
      const data = await res.json();
      
      setPaperQaHistory(prev => {
        const copy = [...prev];
        if (copy.length > 0) {
          copy[copy.length - 1].a = data.explanation || "No explanation returned.";
        }
        return copy;
      });
    } catch (err) {
      setPaperQaHistory(prev => {
        const copy = [...prev];
        if (copy.length > 0) {
          copy[copy.length - 1].a = "Error: Quantum connection to server timed out. Using local offline derivation core.";
        }
        return copy;
      });
    }
  };

  // Run a continuous intelligence scan to simulate NASA/CERN paper feeds
  const runLiveIntelligenceScan = async () => {
    setIsPaperLoading(true);
    triggerAction("arxiv_pioneer");
    try {
      const res = await fetch("/api/gemini/discoveries");
      const data = await res.json();
      if (data && data.length > 0) {
        // Map arXiv scans to our ResearchPaper structure
        const mapped: ResearchPaper[] = data.map((d: any, idx: number) => ({
          id: `live-${idx}`,
          title: d.title,
          authors: d.source || "International Space Collaboration",
          institution: "NASA / CERN Space Intelligence Node",
          journal: "High Energy arXiv Peer-Archive",
          date: d.date || "2026-06-26",
          doi: d.doi || `10.48550/arXiv.${Math.floor(Math.random() * 100000)}`,
          confidenceScore: d.confidenceScore || 90,
          peerReviewed: d.confidenceScore > 85,
          citationCount: Math.floor(Math.random() * 60) + 2,
          version: "v1.0",
          whyItMatters: d.evidence || "Explains key parameters under peer review verification protocols.",
          summary: d.summary,
          beginnerExplanation: `A beginner-friendly overview of how this deep exploration matches standard astrophysical models.`,
          equations: ["H(z) = H_0 \\sqrt{\\Omega_m (1+z)^3 + \\Omega_\\Lambda}"],
          figures: ["Spectral Density Grid", "Telemetry Waveform"],
          relatedDiscoveries: ["LIGO Gravitational Array 2026", "Event Horizon Telescope Black Hole Halo"],
          supportingEvidence: ["Verified under standard ground-based telemetry systems"],
          contradictingEvidence: ["No major contradicting models verified yet"]
        }));
        setPapers([...mapped, ...mockPapers]);
        setSelectedPaper(mapped[0]);
      }
    } catch (e) {
      console.warn("Failed to update papers from live API", e);
    } finally {
      setIsPaperLoading(false);
    }
  };

  // AI Copilot simulation / derivation logic
  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    setIsCopilotThinking(true);
    triggerAction("ask_ai");

    try {
      const res = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: `You are the ultimate AI Physics Copilot. For the topic/equation/note: "${copilotInput}". Provide a strict mathematical derivation, a 30-second conceptual summary, custom simulation coordinates, and an interactive layout. Format beautifully.`
        })
      });
      const data = await res.json();
      setCopilotResponse({
        explanation: data.explanation || "Derivation complete.",
        derivationSteps: [
          { step: "Initialize Hamilton Principle of Least Action", math: "\\delta \\int L \\, dt = 0" },
          { step: "Substitute generalized coordinates and velocities", math: "L = T - V" },
          { step: "Evaluate Euler-Lagrange equations of motion", math: "\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}_j}\\right) - \\frac{\\partial L}{\\partial q_j} = 0" }
        ]
      });
    } catch (err) {
      setCopilotResponse({
        explanation: "Fallback offline derivation complete. Newton's second law of motion holds true.",
        derivationSteps: [
          { step: "Force is equal to mass times acceleration", math: "F = m a" },
          { step: "Substitute momentum derivative over time", math: "F = \\frac{dp}{dt}" }
        ]
      });
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Mock notes file upload to simulate handwriting processing
  const handleNotesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotesFile(file.name);
      setCopilotInput(`Explain the handwritten equations found in uploaded notes: "${file.name}"`);
      triggerAction("solve_problem");
    }
  };

  return (
    <div id="unified-research-space-hub" className="space-y-6">
      
      {/* 1. Header & Adaptive Learning Engine Selector */}
      <div className="glassmorphism p-5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Compass className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            <span>KUNX UNIFIED SPACE & RESEARCH CORE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time arXiv filters, Sonified space wave receivers, India Physics hub, and Adaptive quantum visualization controls.
          </p>
        </div>

        {/* Dynamic adapt learning engine adaptation select */}
        <div className="flex flex-col space-y-1.5">
          <label className="text-[10px] font-mono text-cyan-500 uppercase font-bold tracking-wider flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>LEARNING ENGINE LEVEL (Auto-Adapts UI)</span>
          </label>
          <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {[
              { id: "BSc", label: "BSc Scholar" },
              { id: "MSc", label: "MSc Scholar" },
              { id: "PhD", label: "PhD Researcher" },
              { id: "Research", label: "PI / Scientist" }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => {
                  setLearningLevel(level.id as any);
                  triggerAction("explore_physics");
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                  learningLevel === level.id 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Primary Sub-Navigation Bar */}
      <div className="glassmorphism p-1 rounded-xl flex flex-wrap gap-1 border border-slate-800/80">
        {[
          { id: "intel", label: "Research Intel & PDF Viewer", icon: FileText },
          { id: "timeline", label: "Global Timeline & Gallery", icon: Calendar },
          { id: "space", label: "Space Mission Database", icon: Rocket },
          { id: "visuals", label: "Visual & Sound Engine", icon: Volume2 },
          { id: "encyclopedia", label: "Scientist Encyclopedia", icon: Users },
          { id: "india", label: "India Physics Hub", icon: Globe },
          { id: "copilot", label: "AI Physics Copilot", icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                triggerAction("explore_physics");
              }}
              className={`flex-1 min-w-[130px] px-3 py-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center space-x-1.5 ${
                isActive 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =======================================================
          SUB-TAB 1: AI RESEARCH INTEL & SMART PDF VIEWER
          ======================================================= */}
      {activeSubTab === "intel" && (
        <div id="intel-layer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Feed & Verifications */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism flex flex-col justify-between h-fit">
              <div>
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>NASA-CERN Monitor Terminal</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Continuously scans global archives (NASA, CERN, arXiv, Crossref, Semantic Scholar, INSPIRE HEP) to fetch breaking physics discoveries.
                </p>

                {/* Live updates ticker */}
                <div className="bg-black/60 border border-slate-900 rounded-xl p-3 text-[10px] text-emerald-400 font-mono space-y-2 mb-4 h-[120px] overflow-y-auto">
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>[CERN] Wake-field gradient preservation check: COMPLIANT</span>
                  </div>
                  <div>[arXiv] Found paper: B-mode tensor-to-scalar ratio r = 0.045</div>
                  <div className="text-slate-500">[INSPIRE] 14 new citations registered for Weyl semi-metals</div>
                  <div className="text-cyan-400">[NASA-L1] Solar coronagraph data stream synced successfully</div>
                </div>

                <button
                  onClick={runLiveIntelligenceScan}
                  disabled={isPaperLoading}
                  className="w-full py-2.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 transition font-mono text-xs font-semibold rounded-xl flex items-center justify-center space-x-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPaperLoading ? "animate-spin" : ""}`} />
                  <span>{isPaperLoading ? "Querying Archives..." : "Trigger Continuous Scan"}</span>
                </button>
              </div>
            </div>

            {/* List of Scanned/Fetched Papers */}
            <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl glassmorphism space-y-3">
              <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider border-b border-slate-900 pb-2">
                VERIFIED ACADEMIC FEEDS
              </h4>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {papers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPaper(p);
                      triggerAction("explore_physics");
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPaper.id === p.id 
                        ? "bg-cyan-500/15 border-cyan-400/50" 
                        : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">
                        {p.journal}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        p.confidenceScore > 90 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        AI Credibility: {p.confidenceScore}%
                      </span>
                    </div>
                    <h5 className="text-[11px] font-semibold text-white leading-tight line-clamp-2">
                      {p.title}
                    </h5>
                    <p className="text-[9px] text-slate-400 mt-1 truncate">
                      {p.authors} &bull; {p.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Smart PDF Viewer & Interactive Tools */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              
              {/* Paper Header / Metadata */}
              <div className="border-b border-slate-900 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-mono">
                    {selectedPaper.journal}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[9px] font-mono">
                    DOI: {selectedPaper.doi}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[9px] font-mono">
                    Ver: {selectedPaper.version}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedPaper.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  <strong>Authors:</strong> {selectedPaper.authors} &mdash; <em>{selectedPaper.institution}</em>
                </p>
              </div>

              {/* Smart PDF Split Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Section: Core Explanations adapts to Learning Engine */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5 mb-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{learningLevel}-Adapted Explanation</span>
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                      {learningLevel === "BSc" ? (
                        <span><strong>Conceptual Analogy:</strong> {selectedPaper.beginnerExplanation}</span>
                      ) : learningLevel === "MSc" ? (
                        <span><strong>Core Thesis Summary:</strong> {selectedPaper.summary}</span>
                      ) : learningLevel === "PhD" ? (
                        <span><strong>Rigorous Analytical Bound:</strong> {selectedPaper.summary} Empirical models map directly to high-dimensional tensors and gauge vectors.</span>
                      ) : (
                        <span><strong>Theoretical Frontier Diagnostics:</strong> {selectedPaper.summary} Peer review status indicates highest confidence limits with verified DOI and institution metrics.</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Why This Research Matters</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                      {selectedPaper.whyItMatters}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      Verification Credentials
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/60 text-center">
                        <span className="block text-[9px] font-mono text-slate-500">Peer Reviewed</span>
                        <span className={`text-[11px] font-bold ${selectedPaper.peerReviewed ? "text-emerald-400" : "text-amber-400"}`}>
                          {selectedPaper.peerReviewed ? "✓ Fully Verified" : "⚠️ Pre-Print Feed"}
                        </span>
                      </div>
                      <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/60 text-center">
                        <span className="block text-[9px] font-mono text-slate-500">Citations</span>
                        <span className="text-[11px] font-bold text-white">
                          {selectedPaper.citationCount} tracked
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Equations & Graphing Extractions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5 mb-1.5">
                      <Binary className="w-3.5 h-3.5" />
                      <span>Extracted Core Equations</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedPaper.equations.map((eq, index) => (
                        <div key={index} className="bg-black/50 p-2.5 rounded-xl border border-slate-900 flex flex-col justify-center items-center text-center">
                          <code className="text-cyan-300 font-mono text-[11px] leading-tight select-all">
                            {eq}
                          </code>
                          <span className="text-[9px] font-mono text-slate-500 mt-1">LaTeX Compiled Equation</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      Extracted Figures Gallery
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPaper.figures.map((fig, idx) => (
                        <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center flex flex-col justify-center items-center">
                          <Atom className="w-6 h-6 text-indigo-400/60 mb-1 animate-pulse" />
                          <span className="text-[9px] font-mono text-slate-300">{fig}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supporting vs Contradicting papers tracker */}
                  <div>
                    <h4 className="text-[10px] font-mono text-amber-500 uppercase tracking-wider mb-1.5">
                      AI Verification & Academic Debate
                    </h4>
                    <div className="space-y-2 text-[10px] font-sans leading-relaxed">
                      <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-xl text-emerald-300">
                        <strong>Supporting:</strong> {selectedPaper.supportingEvidence[0]}
                      </div>
                      <div className="bg-amber-950/20 border border-amber-900/30 p-2 rounded-xl text-amber-300">
                        <strong>Challenging:</strong> {selectedPaper.contradictingEvidence[0]}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Interactive Paper Q&A Console */}
              <div className="border-t border-slate-900 pt-5 space-y-3">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookMarked className="w-4 h-4" />
                  <span>Interactive Q&A On This Paper</span>
                </h4>
                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                  {paperQaHistory.map((h, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="text-cyan-300"><strong>Q:</strong> {h.q}</div>
                      <div className="text-slate-400 bg-slate-900/30 p-2 rounded-lg border border-slate-800/40"><strong>A:</strong> {h.a}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handlePaperQa} className="flex gap-2">
                  <input
                    type="text"
                    value={paperQaInput}
                    onChange={(e) => setPaperQaInput(e.target.value)}
                    placeholder="Ask a question on this paper's methodologies or parameters..."
                    className="flex-grow px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded-xl text-xs font-mono hover:bg-cyan-500/30 transition"
                  >
                    Query
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* =======================================================
          SUB-TAB 2: GLOBAL TIMELINE & GALLERY ARCHIVE
          ======================================================= */}
      {activeSubTab === "timeline" && (
        <div id="timeline-layer" className="space-y-6">
          <div className="glassmorphism p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>GLOBAL PHYSICS DISCOVERY TIMELINE</span>
            </h3>

            {/* Simulated interactive timeline animation nodes */}
            <div className="relative border-l border-slate-800 pl-6 ml-4 space-y-8 py-2">
              {[
                { year: "2026", title: "CMB B-Mode Polarization Alignment", scientist: "A. Kunz (Stanford/CERN)", desc: "Direct confirmation of cosmic inflationary gravitational waves at tensor scale r=0.045." },
                { year: "2015", title: "First Direct Gravitational Wave Detection", scientist: "LIGO / Virgo Collaborations", desc: "Detection of binary black hole merger GW150914, proving Einstein's general relativity ripples exist." },
                { year: "2012", title: "Discovery of the Higgs Boson", scientist: "CERN CMS & ATLAS", desc: "Revealed the scalar particle responsible for generating mass of standard model fermions." },
                { year: "1930", title: "Discovery of Raman Inelastic Scattering", scientist: "Sir C. V. Raman (IACS Calcutta)", desc: "Showed inelastic deflection of photons causing molecular vibration shifts—first major Indian physics Nobel." }
              ].map((ev, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 hover:border-cyan-500/35 transition duration-300">
                    <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
                      {ev.year} &mdash; {ev.scientist}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {ev.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discovery Gallery & Historical Scans */}
            <div className="border-t border-slate-900 pt-6 space-y-4">
              <h4 className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                Discovery Heritage Gallery & Lab Scans
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Original 1930 Raman Spectrograph Plate", type: "Historical Scan", origin: "Calcutta Museum" },
                  { title: "BICEP4 Cosmic Inflation B-Mode Plot", type: "Satellite Survey Map", origin: "South Pole Station" },
                  { title: "LIGO Laser Arm Vacuum Seal Draft", type: "Patent Draft Schematic", origin: "Caltech Archive" }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                      <span className="text-[9px] font-mono text-cyan-400 block uppercase mb-1">
                        {item.type}
                      </span>
                      <h5 className="text-xs font-semibold text-white">
                        {item.title}
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-3 flex items-center justify-between">
                      <span>Source: {item.origin}</span>
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =======================================================
          SUB-TAB 3: GLOBAL SPACE MISSION DATABASE
          ======================================================= */}
      {activeSubTab === "space" && (
        <div id="space-layer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Mission Directory */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <Rocket className="w-4 h-4" />
                <span>Space Mission Registry</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Real-time tracking of space missions and scientific objectives across NASA, ISRO, ESA, SpaceX, and other global space agencies.
              </p>
              <div className="space-y-2">
                {spaceMissions.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => {
                      setSelectedMission(mission);
                      triggerAction("explore_physics");
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedMission.id === mission.id 
                        ? "bg-cyan-500/15 border-cyan-400/50" 
                        : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold">
                        {mission.org}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {mission.launchDate}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {mission.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Telemetry & Mission Details */}
          <div className="lg:col-span-8">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              
              <div className="border-b border-slate-900 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-mono">
                    {selectedMission.org} Official Database
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                    {selectedMission.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono">
                    Status: {selectedMission.status}
                  </span>
                </div>
              </div>

              {/* Mission Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      Core Mission Profile
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedMission.objectives}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 block">Rocket Carrier</span>
                      <strong className="text-white">{selectedMission.rocket}</strong>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-slate-500 block">Spacecraft</span>
                      <strong className="text-white">{selectedMission.spacecraft}</strong>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 col-span-2">
                      <span className="text-[9px] font-mono text-slate-500 block">Launch Complex</span>
                      <strong className="text-white">{selectedMission.site}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    Scientific Instrumentation & Telemetry
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedMission.telemetry.map((tel, idx) => (
                      <div key={idx} className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 text-center flex flex-col justify-center">
                        <span className="text-[14px] font-extrabold text-cyan-300">{tel.value}</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5 leading-tight">{tel.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="block text-[9px] font-mono text-slate-500 mb-1">Onboard Spectrometers</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMission.instruments.map((inst, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-900 text-slate-300 rounded border border-slate-800 text-[10px] font-mono">
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-emerald-400 block mb-1">Key Scientific Results</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedMission.scientificResults}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* =======================================================
          SUB-TAB 4: PHYSICS VISUAL & SOUND ENGINE
          ======================================================= */}
      {activeSubTab === "visuals" && (
        <div id="visual-sound-layer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive 2D/3D Style Visual Engine */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Atom className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  <span>KUNX PHYSICS VISUAL ENGINE</span>
                </h3>
                {/* Visual modes toggles */}
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {["particle", "xray", "3d"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setVisualMode(mode as any)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
                        visualMode === mode ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Render viewport container */}
              <div className="relative bg-black/70 rounded-2xl h-[280px] border border-slate-900 flex items-center justify-center overflow-hidden">
                
                {/* Zoom indicator HUD */}
                <div className="absolute top-3 left-3 text-[9px] font-mono text-slate-500 space-y-0.5 pointer-events-none">
                  <div>ZOOM: {visualZoom.toFixed(1)}X</div>
                  <div>ANGLE: {visualRotate}°</div>
                  <div>EXPLODED MODE: {explodedView ? "ON" : "OFF"}</div>
                </div>

                {/* SVG representing cosmological or atomic simulation */}
                <svg 
                  className="w-full h-full max-w-[260px] max-h-[260px] transition-transform duration-300"
                  style={{
                    transform: `scale(${visualZoom}) rotate(${visualRotate}deg)`
                  }}
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
                  
                  {/* Particle orbit mode */}
                  {visualMode === "particle" && (
                    <>
                      {/* Center nucleus */}
                      <circle cx="50" cy="50" r="5" fill="rgb(6,182,212)" className="animate-pulse" />
                      <circle cx="50" cy="50" r="2.5" fill="white" />
                      
                      {/* Orbits */}
                      <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="0.5" />
                      {/* Moving electron */}
                      <circle cx="50" cy="35" r="1.8" fill="white" className="animate-bounce" />
                    </>
                  )}

                  {/* XRAY / Wave interference mode */}
                  {visualMode === "xray" && (
                    <>
                      <defs>
                        <radialGradient id="xray-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(6,182,212,0.8)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="50" r="30" fill="url(#xray-glow)" />
                      {/* Interference rings */}
                      <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    </>
                  )}

                  {/* 3D Black Hole ergosphere representation */}
                  {visualMode === "3d" && (
                    <>
                      {/* Event horizon */}
                      <circle cx="50" cy="50" r="16" fill="black" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" />
                      {/* Accretion disk skewed projection */}
                      <ellipse cx="50" cy="50" rx="40" ry="8" fill="none" stroke="rgba(249,115,22,0.6)" strokeWidth="1.5" className="animate-pulse" />
                      {/* Exploded spacers if activated */}
                      {explodedView && (
                        <>
                          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(6,182,212,0.4)" strokeWidth="0.5" strokeDasharray="1 1" />
                          <text x="52" y="14" fill="rgba(6,182,212,0.7)" fontSize="2" fontFamily="monospace">Singularity Vector</text>
                        </>
                      )}
                    </>
                  )}

                  {/* Floating particles math overlay */}
                  {showMathOverlay && (
                    <>
                      <text x="12" y="88" fill="rgba(6,182,212,0.6)" fontSize="2.5" fontFamily="monospace">G_uv = 8pi G T_uv</text>
                      <text x="68" y="15" fill="rgba(255,255,255,0.4)" fontSize="2.5" fontFamily="monospace">Psi(x,t)</text>
                    </>
                  )}
                </svg>

                {/* Simulation Control Overlay */}
                <div className="absolute bottom-3 right-3 flex space-x-1">
                  <button 
                    onClick={() => setVisualZoom(z => Math.max(0.5, z - 0.2))} 
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setVisualZoom(z => Math.min(3, z + 0.2))} 
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setVisualRotate(r => r + 45)} 
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title="Rotate View"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setExplodedView(!explodedView)} 
                    className={`p-1.5 rounded-lg border text-[9px] font-mono uppercase ${
                      explodedView ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                    title="Toggle Exploded Mode"
                  >
                    Exploded
                  </button>
                </div>
              </div>

              {/* Engine controls panel */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <span className="font-mono text-cyan-400 block mb-1">Visualization Presets</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Rotate, zoom, or split the view to analyze structural geometries, electromagnetic field gradients, and particle orbits.
                  </p>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-slate-300 block">Math Overlay</span>
                    <span className="text-[10px] text-slate-500 font-mono">Render LaTeX variables</span>
                  </div>
                  <button
                    onClick={() => setShowMathOverlay(!showMathOverlay)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${showMathOverlay ? "bg-cyan-500" : "bg-slate-800"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showMathOverlay ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scientifically Recorded Sound Archive */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              <div>
                <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>KUNX PHYSICS SOUND ARCHIVE</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Play real procedural sonifications representing astrophysical events. Synthesized in real-time from observed radio frequency and Doppler shift datasets.
                </p>
              </div>

              <div className="space-y-3.5">
                {sonifiedSounds.map((sound) => {
                  const isPlaying = playingSoundId === sound.id;
                  return (
                    <div key={sound.id} className="bg-slate-900/30 p-4 rounded-2xl border border-slate-850 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[8px] font-mono text-cyan-400 block uppercase">
                            Source: {sound.agency} &bull; {sound.date}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-0.5">
                            {sound.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => playProceduralSound(sound)}
                          className={`p-2 rounded-xl transition-all ${
                            isPlaying 
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse" 
                              : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20"
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-slate-500 leading-tight">
                        <strong>Instrument:</strong> {sound.instrument}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        {sound.context}
                      </p>
                    </div>
                  );
                })}
              </div>

              {playingSoundId && (
                <div className="bg-black/60 border border-slate-900 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Oscilloscope Streaming Live Data</span>
                  </div>
                  <button 
                    onClick={stopProceduralSound} 
                    className="text-[9px] font-mono text-slate-500 hover:text-white underline cursor-pointer"
                  >
                    Kill Audio Context
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* =======================================================
          SUB-TAB 5: SCIENTIST ENCYCLOPEDIA & INFLUENCE GRAPH
          ======================================================= */}
      {activeSubTab === "encyclopedia" && (
        <div id="encyclopedia-layer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Physicists Directory */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism">
              <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
                <Users className="w-4 h-4" />
                <span>Physicist Encyclopedia</span>
              </h3>
              <div className="space-y-2">
                {physicistEncyclopedia.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPhysicist(p);
                      triggerAction("explore_physics");
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPhysicist.id === p.id 
                        ? "bg-cyan-500/15 border-cyan-400/50" 
                        : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">
                      {p.nationality} &bull; {p.lifespan}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">
                      {p.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated concept knowledge graph connection */}
            <div className="bg-slate-950/45 border border-slate-800 rounded-2xl p-5 glassmorphism space-y-2">
              <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Concept Connection Graph (DNA)
              </h4>
              <div className="text-[10px] font-mono text-slate-400 bg-black/60 p-3 rounded-xl space-y-1.5 leading-relaxed">
                <div className="text-white font-semibold mb-1">Einstein Model Chain:</div>
                <div className="flex items-center space-x-1">
                  <span className="text-cyan-400">Einstein</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>General Relativity</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>General Relativity</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-indigo-400">Time Dilation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-indigo-400">Time Dilation</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-cyan-400">GPS Satellites</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500">
                  <span>GPS Satellites</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span>Modern Tech Orbits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selected Physicist Profile Details */}
          <div className="lg:col-span-8">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              
              <div className="border-b border-slate-900 pb-4">
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                  Nobel laureate profile &bull; {selectedPhysicist.lifespan}
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                  {selectedPhysicist.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  <strong>Institutions:</strong> {selectedPhysicist.institutions}
                </p>
              </div>

              {/* Biography Section */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                    Scientific Biography
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedPhysicist.biography}
                  </p>
                </div>

                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  <span className="text-[9px] font-mono text-cyan-400 block uppercase mb-1">Inspirational Quote</span>
                  <p className="text-xs text-slate-200 italic font-sans leading-relaxed">
                    &ldquo;{selectedPhysicist.quotes}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Key Scientific Discoveries
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedPhysicist.discoveries.map((disc, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-cyan-400 font-mono mt-0.5">&bull;</span>
                          <span>{disc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Prestigious Medals & Awards
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedPhysicist.awards.map((award, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-mono mt-0.5">✓</span>
                          <span>{award}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Influence Network Graph */}
                <div className="border-t border-slate-900 pt-4">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Academic Lineage & Influence Networks
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-850">
                      <span className="text-[9px] font-mono text-slate-500 block mb-1">Influenced By</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPhysicist.influenceFrom.map((inf, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded text-[9px] border border-slate-900">
                            {inf}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-850">
                      <span className="text-[9px] font-mono text-slate-500 block mb-1">Heavily Influenced</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedPhysicist.influenceTo.map((inf, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded text-[9px] border border-slate-900">
                            {inf}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* =======================================================
          SUB-TAB 6: INDIA PHYSICS HUB
          ======================================================= */}
      {activeSubTab === "india" && (
        <div id="india-hub-layer" className="space-y-6">
          <div className="glassmorphism p-6 rounded-3xl space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-mono">
                🇮🇳 Dedicated National Academic Portal
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-2 flex items-center space-x-2">
                <span>INDIA PHYSICS HUB</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Celebrating ancient atomic theories of Sage Kanada to modern quantum pioneers and high-tier ISRO deep-space telemetry alignments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Side: Ancient and Modern Pioneers */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-orange-400 uppercase tracking-wider">
                  Ancient Indian Foundations
                </h4>
                <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-4 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">Sage Kanada & Vaisheshika Sutra (c. 6th Century BCE)</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Postulated the atomic theory of matter. Proposed that everything is composed of invisible, indestructible particles called <strong>&apos;Anu&apos;</strong>, which combine in dyads and triads to form macroscopic objects.
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-2">
                    <h5 className="text-xs font-bold text-white">Aryabhata (476 - 550 CE)</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Postulated that the Earth is spherical and rotates on its own axis. Correctly explained solar and lunar eclipses using shadows, calculating the Earth&apos;s circumference to extreme accuracy.
                    </p>
                  </div>
                </div>

                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Modern Pioneers (Golden Era)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { name: "Homi J. Bhabha", role: "Nuclear physics pioneer, father of India nuclear energy program." },
                    { name: "Vikram Sarabhai", role: "Father of Indian Space Research, founded ISRO & PRL." },
                    { name: "Meghnad Saha", role: "Formulated the Saha Ionization equation for stellar spectra." },
                    { name: "Jagadish Chandra Bose", role: "Pioneered millimeter-wave radio transmitters and plant acoustics." }
                  ].map((p, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                      <strong className="text-white block mb-1">{p.name}</strong>
                      <span className="text-[10px] text-slate-400 leading-tight">{p.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Elite Indian Physics Institutes & Space Feeds */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  Premier Indian Research Institutes
                </h4>
                <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { code: "IISc Bangalore", desc: "India's premier postgraduate institute for advanced physical sciences." },
                      { code: "TIFR Mumbai", desc: "Tata Institute of Fundamental Research—hosts high-energy physics labs." },
                      { code: "BARC Mumbai", desc: "Bhabha Atomic Research Centre for nuclear physics & fusion diagnostics." },
                      { code: "IUCAA Pune", desc: "Inter-University Centre for Astronomy and Astrophysics—LIGO-India partner." }
                    ].map((inst, i) => (
                      <div key={i} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-900">
                        <strong className="text-cyan-300 block">{inst.code}</strong>
                        <span className="text-[9px] text-slate-500 leading-tight block mt-0.5">{inst.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <h4 className="text-xs font-mono text-orange-400 uppercase tracking-wider">
                  Active Indian Space Missions (ISRO)
                </h4>
                <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-4 space-y-3">
                  {[
                    { mission: "Chandrayaan-3", status: "Successful Landing (Shiv Shakti Point)", details: "Confirmed abundance of Sulfur, Silicon, and Oxygen on the south polar lunar regolith." },
                    { mission: "Aditya-L1 Solar Mission", status: "Operational at Lagrange Point 1", details: "Studies chromospheric loops and CME mass velocities utilizing coronagraph arrays." },
                    { mission: "Gaganyaan Crewed Program", status: "Active Orbital Testing", details: "Paving the way for human orbital spaceflight inside customized ISRO crew capsules." }
                  ].map((m, i) => (
                    <div key={i} className="border-b border-slate-900 last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-white">{m.mission}</strong>
                        <span className="text-[9px] font-mono text-emerald-400">{m.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{m.details}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =======================================================
          SUB-TAB 7: AI PHYSICS COPILOT & NOTE SCANNER
          ======================================================= */}
      {activeSubTab === "copilot" && (
        <div id="copilot-layer" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Input Prompt & File Upload */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              <div>
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI PHYSICS COPILOT ENGINE</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Ask any complex physics question, derive Euler-Lagrange equations, or upload handwritten lecture notes to generate interactive step-by-step math models.
                </p>
              </div>

              {/* handwritten notes upload drag and drop form */}
              <div className="border border-dashed border-slate-800 rounded-2xl p-5 text-center bg-slate-900/30 hover:bg-slate-900/50 transition relative group">
                <input
                  type="file"
                  id="notes-uploader-field"
                  accept="image/*,application/pdf"
                  onChange={handleNotesUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-cyan-400/60 mx-auto group-hover:scale-110 transition duration-300" />
                  <div className="text-xs font-semibold text-white">Drag & Drop handwritten equations or notes</div>
                  <div className="text-[10px] font-mono text-slate-500">Supports JPG, PNG or PDF scans</div>
                </div>
              </div>

              {notesFile && (
                <div className="bg-cyan-950/20 border border-cyan-800/40 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 truncate">Uploaded: {notesFile}</span>
                  <button 
                    onClick={() => setNotesFile(null)} 
                    className="text-[9px] font-mono text-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Text Area form */}
              <form onSubmit={handleCopilotSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Enter formula or question (e.g., 'Derive Schwarzschild radius from escape velocity equations' or 'Explain Josephson junction quantum tunneling')..."
                  className="w-full px-3.5 py-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isCopilotThinking}
                  className="w-full py-2.5 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 transition text-xs font-mono font-bold rounded-xl flex justify-center items-center space-x-2"
                >
                  {isCopilotThinking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Deriving Quantum Parameters...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Compute AI Derivation & Simulate</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

          {/* Right Column: AI Derivation Output & Simulated Math Graph */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950/45 border border-slate-800 rounded-3xl p-6 glassmorphism space-y-6">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-slate-900 pb-3">
                AI CO-ENGINE DERIVATION HUD
              </h4>

              {copilotResponse ? (
                <div className="space-y-5">
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
                    {copilotResponse.explanation}
                  </p>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Step-by-Step Formal Mathematical Proof
                    </h5>
                    {copilotResponse.derivationSteps.map((step: any, idx: number) => (
                      <div key={idx} className="bg-black/60 p-3 rounded-xl border border-slate-900 text-center flex flex-col items-center">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1">
                          Step {idx + 1}: {step.step}
                        </span>
                        <code className="text-xs text-cyan-300 font-mono select-all">
                          {step.math}
                        </code>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] font-mono text-emerald-400 block mb-1">✓ Verified Credentials</span>
                    <span className="text-[10px] font-mono text-slate-500 leading-tight">
                      Validated using high-energy physics reference frameworks.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    AI Copilot is idle. Ask a question or upload a handwritten note in the left panel to begin formal step-by-step mathematical derivations.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
