// KunX Physics Console - Gamification Engine
export interface DailyChallenge {
  id: string;
  task: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  actionType: string; // 'simulate', 'ask_ai', 'solve_problem', 'read_glossary'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  icon: string; // Lucide icon reference string
}

export interface GamificationState {
  xp: number;
  coins: number;
  level: number;
  levelTitle: string;
  streak: number;
  lastActiveDate: string; // ISO string
  unlockedBadges: string[];
  completedChallenges: string[];
  biographyLogs: string[]; // List of scientist IDs read
  bookmarks: string[]; // List of bookmarked equations or topics
}

const LEVEL_TITLES = [
  "Newtonian Apprentice", // Level 1
  "Galilean Observer",    // Level 2
  "Maxwellian Fieldsmith", // Level 3
  "Relativistic voyager",  // Level 4
  "Planck Quantum Adept",  // Level 5
  "Hawking Spacetime Sage", // Level 6
  "Dirac Matrix Master",   // Level 7
  "Einsteinian Unifier"    // Level 8+
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    title: "Newtonian Spark",
    description: "Launch your first interactive simulation in the Virtual 3D Lab.",
    xpReward: 100,
    coinReward: 50,
    unlocked: false,
    icon: "Compass"
  },
  {
    id: "ai_colleague",
    title: "Quantum Peer",
    description: "Submit a highly detailed query to the AI Physics Professor.",
    xpReward: 150,
    coinReward: 75,
    unlocked: false,
    icon: "Cpu"
  },
  {
    id: "problem_solved",
    title: "Anomaly Cracker",
    description: "Solve a complex theoretical or numerical physics problem.",
    xpReward: 200,
    coinReward: 100,
    unlocked: false,
    icon: "ShieldCheck"
  },
  {
    id: "glossary_master",
    title: "Linguistic Cosmologist",
    description: "Listen to the AI phonetic pronunciation of 3 different glossary terms.",
    xpReward: 120,
    coinReward: 60,
    unlocked: false,
    icon: "Volume2"
  },
  {
    id: "relativistic_sailor",
    title: "Wormhole Navigator",
    description: "Accelerate to lightspeed in the Relativistic simulator.",
    xpReward: 250,
    coinReward: 125,
    unlocked: false,
    icon: "Orbit"
  },
  {
    id: "arXiv_pioneer",
    title: "Academic Scout",
    description: "Scan the arXiv live database for recent physics discoveries.",
    xpReward: 180,
    coinReward: 90,
    unlocked: false,
    icon: "Activity"
  }
];

const DEFAULT_CHALLENGES: DailyChallenge[] = [
  {
    id: "dc_1",
    task: "Accelerate particle flow inside the 3D Gravitational field simulator",
    xpReward: 50,
    coinReward: 25,
    completed: false,
    actionType: "simulate"
  },
  {
    id: "dc_2",
    task: "Ask the AI Physics Professor to explain a quantum mechanics concept",
    xpReward: 60,
    coinReward: 30,
    completed: false,
    actionType: "ask_ai"
  },
  {
    id: "dc_3",
    task: "Listen to any AI phonetic guides in the Scientific Glossary",
    xpReward: 40,
    coinReward: 20,
    completed: false,
    actionType: "read_glossary"
  }
];

const STORAGE_KEY = "kunx_gamification_state";

export function loadGamificationState(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as GamificationState;
      // Perform streak decay check if active date changed
      return checkStreakAndRefreshChallenges(state);
    }
  } catch (e) {
    console.error("Failed to load gamification state:", e);
  }

  // Initial State
  const initial: GamificationState = {
    xp: 0,
    coins: 0,
    level: 1,
    levelTitle: LEVEL_TITLES[0],
    streak: 1,
    lastActiveDate: new Date().toDateString(),
    unlockedBadges: [],
    completedChallenges: [],
    biographyLogs: [],
    bookmarks: []
  };
  saveGamificationState(initial);
  return initial;
}

export function saveGamificationState(state: GamificationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save gamification state:", e);
  }
}

function checkStreakAndRefreshChallenges(state: GamificationState): GamificationState {
  const todayStr = new Date().toDateString();
  if (state.lastActiveDate !== todayStr) {
    const lastActive = new Date(state.lastActiveDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      state.streak += 1; // Maintained streak!
    } else if (diffDays > 1) {
      state.streak = 1; // Streak broken
    }
    
    state.lastActiveDate = todayStr;
    state.completedChallenges = []; // Refresh daily challenges completed list
    saveGamificationState(state);
  }
  return state;
}

// Add XP and check for Level Up
export function addXpAndCoins(xpAmount: number, coinAmount: number, reason: string): { leveledUp: boolean; newLevel: number; actualXpGained: number; actualCoinsGained: number } {
  const state = loadGamificationState();
  
  const originalLevel = state.level;
  state.xp += xpAmount;
  state.coins += coinAmount;

  // Level Up logic: Level thresholds = level * 300 XP
  // e.g. Level 1 needs 300 XP to reach Level 2, Level 2 needs another 600 XP etc.
  let targetXp = state.level * 300;
  let leveledUp = false;

  while (state.xp >= targetXp) {
    state.xp -= targetXp;
    state.level += 1;
    targetXp = state.level * 300;
    leveledUp = true;
  }

  state.levelTitle = LEVEL_TITLES[Math.min(state.level - 1, LEVEL_TITLES.length - 1)];
  saveGamificationState(state);

  // Dispatch custom events so that active React components can render alerts
  window.dispatchEvent(
    new CustomEvent("physics-rewards-earned", {
      detail: { xp: xpAmount, coins: coinAmount, reason, level: state.level, leveledUp }
    })
  );

  return {
    leveledUp,
    newLevel: state.level,
    actualXpGained: xpAmount,
    actualCoinsGained: coinAmount
  };
}

// Complete Daily Challenge
export function triggerAction(actionType: string) {
  const state = loadGamificationState();
  const challenge = DEFAULT_CHALLENGES.find(c => c.actionType === actionType);
  
  if (challenge && !state.completedChallenges.includes(challenge.id)) {
    state.completedChallenges.push(challenge.id);
    saveGamificationState(state);
    
    // Reward player
    addXpAndCoins(challenge.xpReward, challenge.coinReward, `Daily Challenge: ${challenge.task}`);
    
    window.dispatchEvent(
      new CustomEvent("challenge-completed", {
        detail: { challenge }
      })
    );
  }

  // Also check achievement unlocks
  checkAchievementTrigger(actionType);
}

// Unlock Badge / Achievement helper
function checkAchievementTrigger(actionType: string) {
  const state = loadGamificationState();
  let targetAchievementId = "";

  if (actionType === "simulate" && !state.unlockedBadges.includes("first_steps")) {
    targetAchievementId = "first_steps";
  } else if (actionType === "ask_ai" && !state.unlockedBadges.includes("ai_colleague")) {
    targetAchievementId = "ai_colleague";
  } else if (actionType === "solve_problem" && !state.unlockedBadges.includes("problem_solved")) {
    targetAchievementId = "problem_solved";
  } else if (actionType === "read_glossary" && !state.unlockedBadges.includes("glossary_master")) {
    // If they read 3 glossary terms
    targetAchievementId = "glossary_master";
  }

  if (targetAchievementId) {
    state.unlockedBadges.push(targetAchievementId);
    saveGamificationState(state);

    const ach = ALL_ACHIEVEMENTS.find(a => a.id === targetAchievementId);
    if (ach) {
      addXpAndCoins(ach.xpReward, ach.coinReward, `Achievement unlocked: ${ach.title}`);
      window.dispatchEvent(
        new CustomEvent("achievement-unlocked", {
          detail: { achievement: ach }
        })
      );
    }
  }
}

// Fetch active challenges
export function getDailyChallenges(state: GamificationState): DailyChallenge[] {
  return DEFAULT_CHALLENGES.map(c => ({
    ...c,
    completed: state.completedChallenges.includes(c.id)
  }));
}
