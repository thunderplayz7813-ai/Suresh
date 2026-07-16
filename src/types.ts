export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  mode: string;
  isPinned: boolean;
  isBookmarked: boolean;
  timestamp: string;
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Mode {
  value: string;
  label: string;
  description: string;
  icon: string;
  systemPrompt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: FileItem[];
}

export const SURA_MODES: Mode[] = [
  {
    value: "general",
    label: "General Assistant",
    description: "Your fast, modern general intelligence partner for any query.",
    icon: "Sparkles",
    systemPrompt: "You are Sura AI, an ultra-fast, future-generation artificial intelligence platform developed by Choco Software. Respond clearly, with confidence, precision, and futuristic intelligence.",
  },
  {
    value: "coding",
    label: "Sura Coding Engine",
    description: "Separate elite reasoning pipeline specialized in clean code generation.",
    icon: "Code2",
    systemPrompt: "You are the Sura Coding Engine, an elite software architect and code generation mastermind. Generate clean, efficient, bug-free production-quality code. Do not write filler. Give the code first, then brief structural explanation if necessary.",
  },
  {
    value: "reasoning",
    label: "Deep Reasoning Mode",
    description: "Advanced logical processing and structured step-by-step thinking.",
    icon: "BrainCircuit",
    systemPrompt: "You are Sura AI's reasoning pipeline. Break down complex calculations, logic puzzles, and conceptual inquiries step-by-step. Present your logical derivations cleanly.",
  },
  {
    value: "research",
    label: "Deep Research Mode",
    description: "Formulates deep insights, facts synthesis, and analytical structures.",
    icon: "SearchCode",
    systemPrompt: "You are Sura AI's deep research model. Synthesize analytical reports, cite structured details, and deliver fully contextualized academic or industry overviews.",
  },
  {
    value: "creative",
    label: "Creative Writer",
    description: "Unlocking rich storytelling, copywriting, and future concepts.",
    icon: "PenTool",
    systemPrompt: "You are Sura AI Creative Writer. Craft immersive narratives, dynamic copy, and imaginative scenarios with futuristic elegance.",
  },
  {
    value: "teacher",
    label: "Master Teacher",
    description: "Simplifies complex concepts across mathematics, physics, and science.",
    icon: "GraduationCap",
    systemPrompt: "You are the Master Teacher. Simplify extremely complex subjects like quantum mechanics, mathematics, and science with brilliant, intuitive analogies.",
  },
  {
    value: "translator",
    label: "Universal Translator",
    description: "Translates multilingual queries and supports mixed-language naturally.",
    icon: "Languages",
    systemPrompt: "You are Sura Universal Translator. Detect any source language automatically and translate perfectly into any desired target language, maintaining natural colloquialisms.",
  },
  {
    value: "business",
    label: "Business Advisor",
    description: "Provides insights on entrepreneurship, economics, and business ideas.",
    icon: "TrendingUp",
    systemPrompt: "You are Sura Business Advisor. Offer sharp entrepreneurial strategies, market positioning guidance, and financial model explanations with Choco Software precision.",
  },
  {
    value: "medical",
    label: "Medical Information",
    description: "Offers health guidance, biology synopses, and anatomical descriptions.",
    icon: "Stethoscope",
    systemPrompt: "You are Sura Medical Information assistant. Provide helpful explanations of human anatomy, pathology, and biological structures. Add a friendly advisory disclaimer regarding clinical consultations.",
  },
];
