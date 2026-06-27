export interface VariableInfo {
  name: string;
  symbol: string;
  unit: string;
  defaultValue: number;
}

export interface InteractiveCalculator {
  inputs: VariableInfo[];
  outputName: string;
  outputSymbol: string;
  outputUnit: string;
  calculateFn: (inputs: Record<string, number>) => number;
}

export interface PhysicsEquation {
  id: string;
  title: string;
  formula: string;
  meaning: string;
  variables: VariableInfo[];
  calculator: InteractiveCalculator;
  derivation: string;
  realLifeExample: string;
  simulationHint: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface ResearchPaper {
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string;
  confidence: number;
}

export interface VerificationLog {
  evidence: string;
  confidenceScore: number; // 0-100
  lastVerified: string;
  peerReviewStatus: string;
  contradictingTheories: string;
}

export interface PhysicsTopic {
  id: string;
  name: string;
  branchId: string;
  definition: string;
  history: string;
  discoverer: string;
  timeline: TimelineEvent[];
  mathematics: {
    formula: string;
    derivation: string;
    proof: string;
  };
  realExperiment: string;
  easySummary: string;
  expertSummary: string;
  researchSummary: string;
  applications: {
    space: string;
    medicine: string;
    military: string;
    engineering: string;
    dailyLife: string;
  };
  practiceQuestions: PracticeQuestion[];
  flashcards: Flashcard[];
  papers: ResearchPaper[];
  verification: VerificationLog;
  futureScope: string;
  relatedTopics: string[];
}

export interface PhysicsBranch {
  id: string;
  name: string;
  category: 'Classical' | 'Modern' | 'Cosmology & Astronomy' | 'Interdisciplinary' | 'Theoretical & Advanced';
  description: string;
  icon: string; // Lucide icon name
  topicIds: string[];
}

export interface Physicist {
  id: string;
  name: string;
  lifespan: string;
  nationality: string;
  biography: string;
  quote: string;
  discoveries: string[];
  equations: string[];
  awards: string[];
  experiments: string[];
  books: string[];
  legacy: string;
  timeline: TimelineEvent[];
}

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  type: 'gravity' | 'blackhole' | 'electric-field' | 'waves' | 'optics' | 'atoms';
}

export interface CosmicNode {
  id: string;
  name: string;
  scale: string; // e.g. "1.496e8 km" or "100,000 ly"
  type: 'planet' | 'star' | 'blackhole' | 'galaxy' | 'nebula' | 'universe';
  description: string;
  fact: string;
  parent?: string;
  coordinates: { x: number; y: number; z: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  diagramSvg?: string; // Opt diagram
  formulaSheet?: string[]; // Opt formulas
  thinking?: string; // Reasoning trace
}

export interface ResearchPaperSummary {
  title: string;
  summary: string;
  citation: string;
  doi: string;
  confidenceScore: number;
}

export interface GlossaryTerm {
  term: string;
  phonetic: string;
  ipa: string;
  definition: string;
  category: string;
  audioText: string;
  funFact: string;
}
