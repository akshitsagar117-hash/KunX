// KUNNUVERSE MULTI-LANGUAGE TRANSLATOR UTILITY
// Includes 25+ languages, automatic language detection, Hinglish mode, and reactive context.

export interface LanguageDef {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageDef[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "hinglish", name: "Hinglish", nativeName: "Hinglish", flag: "🇮🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" }
];

// Dictionary of static labels across the applet
export const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  control_center: {
    en: "Control Center",
    hi: "नियंत्रण केंद्र",
    hinglish: "Control Center Command Panel",
    ja: "コントロールセンター",
    zh: "控制中心",
    fr: "Centre de Contrôle",
    de: "Kontrollzentrum",
    es: "Centro de Control",
    ru: "Центр управления",
    ar: "مركز التحكم",
    ko: "제어 센터"
  },
  physics_library: {
    en: "Physics Research Vault",
    hi: "भौतिकी अनुसंधान तिजोरी",
    hinglish: "Physics Research Vault (Study Deck)",
    ja: "物理研究保管庫",
    zh: "物理研究库",
    fr: "Coffre de Recherche Physique",
    de: "Physikforschungstresor",
    es: "Bóveda de Investigación Física",
    ru: "Хранилище физических исследований",
    ar: "قبو أبحاث الفيزياء",
    ko: "물리학 연구 보관소"
  },
  equation_engine: {
    en: "Equation Engine",
    hi: "समीकरण इंजन",
    hinglish: "Equation Dynamics Engine",
    ja: "数式シミュレーションエンジン",
    zh: "方程分析引擎",
    fr: "Moteur d'Équations",
    de: "Gleichungs-Engine",
    es: "Motor de Ecuaciones",
    ru: "Уравнения и вычисления",
    ar: "محرك المعادلات",
    ko: "방정식 시뮬레이터"
  },
  virtual_lab: {
    en: "Virtual 3D Lab",
    hi: "अभासी 3D प्रयोगशाला",
    hinglish: "Virtual 3D Physics Lab",
    ja: "バーチャル3D研究所",
    zh: "虚拟3D实验室",
    fr: "Labo Virtuel 3D",
    de: "Virtuelles 3D-Labor",
    es: "Laboratorio Virtual 3D",
    ru: "Виртуальная 3D-лаборатория",
    ar: "المختبر الافتراضي ثلاثي الأبعاد",
    ko: "가상 3D 실험실"
  },
  cosmic_explorer: {
    en: "Cosmic Spacetime Voyager",
    hi: "ब्रह्मांडीय अंतरिक्ष यात्री",
    hinglish: "Cosmic Spacetime Voyager",
    ja: "宇宙時空探査機",
    zh: "宇宙时空探索",
    fr: "Voyageur de l'Espace-Temps",
    de: "Kosmischer Raumzeit-Voyager",
    es: "Viajero del Espacio-Tiempo",
    ru: "Космический исследователь",
    ar: "مستكشف الزمان والمكان الكوني",
    ko: "우주 시공간 탐사선"
  },
  ai_assistant: {
    en: "AI Research Assistant",
    hi: "एआई अनुसंधान सहायक",
    hinglish: "AI Research Assistant",
    ja: "AI研究アシスタント",
    zh: "AI学术助手",
    fr: "Assistant de Recherche IA",
    de: "KI-Forschungsassistent",
    es: "Asistente de Investigación IA",
    ru: "ИИ-ассистент исследований",
    ar: "مساعد أبحاث الذكاء الاصطناعي",
    ko: "AI 연구 어시스턴트"
  },
  problem_solver: {
    en: "Theoretical Problem Solver",
    hi: "सैद्धांतिक समस्या निवारक",
    hinglish: "Analytical Problem Solver",
    ja: "理論物理学問題ソルバー",
    zh: "物理问题解答引擎",
    fr: "Solveur de Problèmes Physiques",
    de: "Physikalischer Problemlöser",
    es: "Solucionador de Problemas",
    ru: "Решатель физических задач",
    ar: "محلل المشكلات النظرية",
    ko: "이론 물리학 문제 해결사"
  },
  research_hub: {
    en: "CERN-NASA Discovery Scanner",
    hi: "सर्न-नासा अनुसंधान हब",
    hinglish: "CERN-NASA Space & Research Hub",
    ja: "CERN-NASA最新発見スキャナー",
    zh: "CERN-NASA 科学发现扫描仪",
    fr: "Scanneur de Découvertes CERN-NASA",
    de: "CERN-NASA Entdeckungsscanner",
    es: "Escáner de Descubrimientos",
    ru: "Сканер открытий CERN-NASA",
    ar: "ماسح الاكتشافات CERN-NASA",
    ko: "CERN-NASA 연구 허브"
  },
  project_lab: {
    en: "Project Lab & Exporter",
    hi: "परियोजना लैब और निर्यातक",
    hinglish: "Project Lab & Exporter",
    ja: "プロジェクトラボ＆エクスポート",
    zh: "项目实验室与导出",
    fr: "Lab de Projet & Exportation",
    de: "Projektlabor & Export",
    es: "Laboratorio de Proyectos",
    ru: "Лаборатория проектов",
    ar: "مختبر المشاريع",
    ko: "프로젝트 랩 & 내보내기"
  },
  ask_engine_placeholder: {
    en: "Search missions, scientists, papers, equations or ask any physics query...",
    hi: "मिशन, वैज्ञानिकों, शोध पत्रों, या भौतिकी प्रश्नों को खोजें...",
    hinglish: "Apna physics query dalo (e.g. Explain Schwarzschild radius)...",
    ja: "ミッション、科学者、論文、方程式、または物理の質問を入力...",
    zh: "搜索任务、科学家、论文、公式或提问...",
    fr: "Rechercher des missions, des scientifiques, des équations ou poser une question...",
    de: "Suchen Sie nach Missionen, Wissenschaftlern, Formeln oder stellen Sie eine Frage...",
    es: "Buscar misiones, científicos, artículos, o hacer una pregunta de física..."
  },
  enter_laboratory: {
    en: "ENTER THE PHYSICS INTELLIGENCE PLATFORM",
    hi: "भौतिकी खुफिया मंच में प्रवेश करें",
    hinglish: "ENTER THE PHYSICS INTELLIGENCE CORE",
    ja: "物理インテリジェンスコアにアクセスする",
    zh: "进入物理智能核心平台",
    fr: "ENTRER DANS LA PLATEFORME D'INTELLIGENCE PHYSIQUE",
    de: "BETRETEN SIE DIE PHYSIKALISCHE INTELLIGENZ-PLATTFORM",
    es: "INGRESAR AL NÚCLEO DE INTELIGENCIA FÍSICA"
  },
  science_desc: {
    en: "Unified laboratory console unifying classical formulas, quantum states, relativistic travel engines, and search-grounded academic peer summaries.",
    hi: "शास्त्रीय सूत्रों, क्वांटम अवस्थाओं, और वास्तविक वैज्ञानिक शोधों को एकीकृत करने वाला प्रयोगशाला कंसोल।",
    hinglish: "Classical formulas, quantum fields, relativistic travel, and CERN peer-reviewed research papers ka ek single integrated vault.",
    ja: "古典物理学から量子状態、相対性理論シミュレーター、学術論文検索までを統合した最高峰のラボコンソール。",
    zh: "统一了经典公式、量子态、相对论航行引擎和经同行评审学术总结的综合研究控制台。",
    fr: "Console de laboratoire unifiée regroupant formules classiques, états quantiques, et résumés académiques fondés sur la recherche.",
    de: "Einheitliche Laborkonsole, die klassische Formeln, Quantenzustände, relativistische Triebwerke und forschungsbasierte akademische Zusammenfassungen vereint."
  }
};

export function getTranslation(key: string, langCode: string): string {
  const dictionary = TRANSLATION_DICTIONARY[key];
  if (!dictionary) return key;
  return dictionary[langCode] || dictionary["en"] || key;
}

// Detect client browser language
export function detectBrowserLanguage(): string {
  if (typeof window === "undefined" || !window.navigator) return "en";
  const navLang = window.navigator.language.split("-")[0];
  const exists = SUPPORTED_LANGUAGES.some((lang) => lang.code === navLang);
  return exists ? navLang : "en";
}
