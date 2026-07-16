import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  Clock,
  Copy,
  Plus,
  CornerDownLeft,
  Settings,
  Terminal,
  BrainCircuit,
  Languages,
  Code2,
  Trash2,
  Bookmark,
  Pin,
  ListTodo,
  FileText,
  User,
  Workflow,
  PenTool,
  GraduationCap,
  TrendingUp,
  Stethoscope,
  Info,
  Check,
  Zap,
  HelpCircle
} from "lucide-react";
import { ChatSession, Message, Folder, Mode, SURA_MODES } from "./types";
import Sidebar from "./components/Sidebar";
import ParticleBackground from "./components/ParticleBackground";
import CodingWorkspace from "./components/CodingWorkspace";
import SettingsModal from "./components/SettingsModal";
import ProductivityHub from "./components/ProductivityHub";
import CommandPalette from "./components/CommandPalette";

// Custom light-weight markdown & code-block renderer
function SuraMarkdown({ text }: { text: string }) {
  if (!text) return null;

  // Split content by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-xs">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // It's a code block
          const lines = part.split("\n");
          const header = lines[0].replace("```", "").trim();
          const code = lines.slice(1, -1).join("\n");
          
          return (
            <div key={index} className="rounded-xl border border-white/10 bg-black/50 overflow-hidden font-mono text-[11px] my-2 shadow-inner">
              <div className="bg-white/5 px-4 py-1.5 flex items-center justify-between text-[10px] text-sura-text-sec border-b border-white/5">
                <span className="font-semibold uppercase tracking-wider text-sura-blue">{header || "code"}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="hover:text-white transition-colors flex items-center gap-1 text-[9px]"
                >
                  <Copy size={10} /> Copy
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-[#00FFA3] scrollbar-hidden leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Standard text rendering - support bold, lists, headers, inline code
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              // Header detection
              if (line.startsWith("### ")) {
                return <h4 key={lIdx} className="text-sm font-semibold text-sura-blue font-display mt-2">{line.replace("### ", "")}</h4>;
              }
              if (line.startsWith("## ")) {
                return <h3 key={lIdx} className="text-base font-bold text-sura-purple font-display mt-3">{line.replace("## ", "")}</h3>;
              }
              if (line.startsWith("# ")) {
                return <h2 key={lIdx} className="text-lg font-bold text-sura-pink font-display mt-4">{line.replace("# ", "")}</h2>;
              }
              
              // Bullet point detection
              if (line.startsWith("* ") || line.startsWith("- ")) {
                return (
                  <li key={lIdx} className="list-none pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-sura-blue">
                    {parseInline(line.substring(2))}
                  </li>
                );
              }

              return <p key={lIdx}>{parseInline(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

// Inline formatting parser (bold, inline code)
function parseInline(line: string) {
  // Bold parser **text**
  const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px] text-sura-pink border border-white/5">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: "s1",
    title: "Quantum Cryptography Synapses",
    mode: "general",
    isPinned: true,
    isBookmarked: false,
    timestamp: "10:15 AM",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Explain quantum cryptography protocols in 20 words.",
        timestamp: "10:15 AM"
      },
      {
        id: "m2",
        role: "assistant",
        content: "Quantum cryptography secures transmission using photon states; any interception alters quantum properties, immediately exposing intruders via physics-based laws.",
        timestamp: "10:15 AM"
      }
    ]
  },
  {
    id: "s2",
    title: "Multilingual Colloquialisms",
    mode: "translator",
    isPinned: false,
    isBookmarked: true,
    timestamp: "Yesterday",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "Translate 'Welcome to the Future of speed and intelligence' to Tamil and Hindi.",
        timestamp: "Yesterday"
      },
      {
        id: "m4",
        role: "assistant",
        content: "### Multilingual Translations\n\n* **Tamil:** 'வேகம் மற்றும் அறிவாற்றலின் எதிர்காலத்திற்கு உங்களை வரவேற்கிறோம்.' (Vegam matrrum arivaatralin edhirkalathirku ungalai varaverkirom.)\n* **Hindi:** 'गति और बुद्धिमत्ता के भविष्य में आपका स्वागत है।'\n\nThese translations capture the dynamic, futuristic essence naturally.",
        timestamp: "Yesterday"
      }
    ]
  }
];

export default function App() {
  // Main state loaders from LocalStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("sura_sessions");
    return saved ? JSON.parse(saved) : DEFAULT_SESSIONS;
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || "s1";
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem("sura_folders");
    return saved ? JSON.parse(saved) : [{ id: "f_work", name: "Development Workspace" }];
  });

  const [selectedMode, setSelectedMode] = useState<string>("general");
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [customInstruction, setCustomInstruction] = useState(() => {
    return localStorage.getItem("sura_custom_instruction") || "";
  });
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem("sura_custom_api_key") || "";
  });

  // Modal displays
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProductivityOpen, setIsProductivityOpen] = useState(false);
  const [productivityTab, setProductivityTab] = useState<"tasks" | "notes">("tasks");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Productivity states
  const [tasks, setTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem("sura_tasks");
    return saved ? JSON.parse(saved) : [
      { id: "t1", title: "Complete Sura AI core integration with Gemini API", completed: true },
      { id: "t2", title: "Refactor Choco Software Quantum Endpoint algorithms", completed: false }
    ];
  });

  const [notes, setNotes] = useState<any[]>(() => {
    const saved = localStorage.getItem("sura_notes");
    return saved ? JSON.parse(saved) : [
      {
        id: "n1",
        title: "Workspace Reference Logs",
        content: "Sura AI Engine v2.5 Sandbox Environment compiled.\nEngine: Choco Software Core System Q3.\nPlatform URL: https://ai.studio/build",
        timestamp: "July 16, 2026"
      }
    ];
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium" as "small" | "medium" | "large",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize LocalStorage
  useEffect(() => {
    localStorage.setItem("sura_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("sura_folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("sura_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("sura_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("sura_custom_instruction", customInstruction);
  }, [customInstruction]);

  useEffect(() => {
    localStorage.setItem("sura_custom_api_key", customApiKey);
  }, [customApiKey]);

  // Command Palette hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-scroll on chat message streams
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, currentSessionId, isStreaming]);

  const activeSession = sessions.find((s) => s.id === currentSessionId);

  // New Chat session initiation
  const handleNewSession = (modeValue?: string) => {
    const mode = modeValue || selectedMode;
    const newSession: ChatSession = {
      id: "session_" + Date.now(),
      title: `Draft Workspace ${sessions.length + 1}`,
      mode,
      isPinned: false,
      isBookmarked: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  const handleTogglePin = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  const handleToggleBookmark = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );
  };

  const handleCreateFolder = (name: string) => {
    setFolders((prev) => [...prev, { id: "folder_" + Date.now(), name }]);
  };

  const handleMoveToFolder = (sessionId: string, folderId: string | undefined) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, folderId } : s))
    );
  };

  const handleClearAllChats = () => {
    setSessions([]);
    localStorage.removeItem("sura_sessions");
    handleNewSession();
  };

  // Productivity dispatch handlers
  const handleAddTask = (title: string) => {
    setTasks((prev) => [{ id: "t_" + Date.now(), title, completed: false }, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddNote = (title: string, content: string) => {
    setNotes((prev) => [
      ...prev,
      {
        id: "n_" + Date.now(),
        title,
        content,
        timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      }
    ]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content } : n))
    );
  };

  // Send Conversational message to Server-Side SSE Chat endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isStreaming) return;

    setInputMessage("");

    // Setup User message
    const userMsg: Message = {
      id: "msg_user_" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    let sessionToUpdate = activeSession;
    if (!sessionToUpdate) {
      // Create session on the fly if none is active
      const newSession: ChatSession = {
        id: "session_" + Date.now(),
        title: text.length > 25 ? text.substring(0, 25) + "..." : text,
        mode: selectedMode,
        isPinned: false,
        isBookmarked: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [userMsg]
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      sessionToUpdate = newSession;
    } else {
      // Append to active session
      const updatedMessages = [...sessionToUpdate.messages, userMsg];
      const titleUpdate = sessionToUpdate.messages.length === 0
        ? (text.length > 25 ? text.substring(0, 25) + "..." : text)
        : sessionToUpdate.title;

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionToUpdate!.id
            ? { ...s, title: titleUpdate, messages: updatedMessages }
            : s
        )
      );
    }

    // Prepare Assistant placeholder
    const assistantMsgId = "msg_asst_" + Date.now();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionToUpdate!.id
          ? { ...s, messages: [...s.messages, assistantMsg] }
          : s
      )
    );

    setIsStreaming(true);

    try {
      const activeModePrompt = SURA_MODES.find((m) => m.value === selectedMode)?.systemPrompt || "";
      const combinedSystemPrompt = activeModePrompt + (customInstruction ? `\n\nUser Custom Directive: ${customInstruction}` : "");

      const chatHistory = sessionToUpdate.messages.concat(userMsg);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          systemInstruction: combinedSystemPrompt,
          mode: selectedMode,
          apiKey: customApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Sura Engine response failure. Is your API secret configured?");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split("\n");

          for (let line of lines) {
            if (line.startsWith("data: ")) {
              const dataText = line.substring(6);
              if (dataText === "[DONE]") continue;

              try {
                const parsed = JSON.parse(dataText);
                if (parsed.text) {
                  streamText += parsed.text;
                  setSessions((prev) =>
                    prev.map((s) =>
                      s.id === sessionToUpdate!.id
                        ? {
                            ...s,
                            messages: s.messages.map((m) =>
                              m.id === assistantMsgId ? { ...m, content: streamText } : m
                            )
                          }
                        : s
                    )
                  );
                } else if (parsed.error) {
                  streamText += `\n\n[System Diagnostic Notice: ${parsed.error}]`;
                  setSessions((prev) =>
                    prev.map((s) =>
                      s.id === sessionToUpdate!.id
                        ? {
                            ...s,
                            messages: s.messages.map((m) =>
                              m.id === assistantMsgId ? { ...m, content: streamText } : m
                            )
                          }
                        : s
                    )
                  );
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Inference fetch error:", err);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionToUpdate!.id
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content: `**Core Connection Disruption:** Sura AI cannot stream content without an API key. Please check that a legitimate key is attached to your sandbox workspace environment.`
                      }
                    : m
                )
              }
            : s
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handlePresetPrompt = (preset: string) => {
    handleSendMessage(preset);
  };

  const handleOpenProductivity = (tab: "tasks" | "notes") => {
    setProductivityTab(tab);
    setIsProductivityOpen(true);
  };

  return (
    <main
      id="sura-core-shell"
      className={`relative min-h-screen bg-sura-bg overflow-hidden flex flex-row ${
        accessibilitySettings.highContrast ? "border-4 border-white" : ""
      } ${accessibilitySettings.fontSize === "small" ? "text-xs" : accessibilitySettings.fontSize === "large" ? "text-lg" : "text-sm"}`}
    >
      {/* 3D Animated Aurora Flow backgrounds */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sura-blue/10 animate-aurora-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sura-purple/10 animate-aurora-fast" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-sura-pink/5 animate-aurora-slow" />
      </div>

      {/* Neural network Particle canvas */}
      <ParticleBackground />

      {/* Sidebar navigation */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        folders={folders}
        onSelectSession={(id) => {
          const session = sessions.find((s) => s.id === id);
          if (session) {
            setSelectedMode(session.mode);
            setCurrentSessionId(id);
          }
        }}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onTogglePin={handleTogglePin}
        onToggleBookmark={handleToggleBookmark}
        onCreateFolder={handleCreateFolder}
        onMoveToFolder={handleMoveToFolder}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProductivity={handleOpenProductivity}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
      />

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col relative z-0 h-screen overflow-hidden">
        {/* CONDITIONAL RENDERING: Sura Coding Engine workspace */}
        {selectedMode === "coding" ? (
          <CodingWorkspace
            onAskSura={handleSendMessage}
            isStreaming={isStreaming}
          />
        ) : (
          /* STANDARD: Conversational stream workspace */
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top glass header navigation */}
            <header className="h-14 border-b border-white/5 bg-[#0B1026]/40 backdrop-blur-md px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sura-blue animate-pulse" />
                <div>
                  <h3 className="text-xs font-display font-semibold tracking-wider text-sura-text uppercase">
                    {SURA_MODES.find((m) => m.value === selectedMode)?.label || "Sura AI Engine"}
                  </h3>
                  <p className="text-[9px] text-sura-text-sec/60 font-mono">
                    Session: {activeSession?.title || "Draft"}
                  </p>
                </div>
              </div>

              {/* Engine metadata indicators */}
              <div className="flex items-center gap-4 text-[10px] font-mono text-sura-text-sec">
                <span className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  <Clock size={11} className="text-sura-blue" /> Typing latency: near-zero
                </span>
                <span className="flex items-center gap-1.5 bg-sura-blue/10 border border-sura-blue/20 px-2 py-0.5 rounded text-sura-blue">
                  <Zap size={11} className="animate-bounce" /> Ultra speed Active
                </span>
              </div>
            </header>

            {/* Conversation list viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hidden">
              {activeSession && activeSession.messages.length > 0 ? (
                activeSession.messages.map((message) => {
                  const isAssistant = message.role === "assistant";
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-4 max-w-3xl ${
                        isAssistant ? "" : "ml-auto flex-row-reverse"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isAssistant
                            ? "bg-gradient-to-tr from-sura-purple to-sura-blue border-sura-blue/30 shadow-[0_0_10px_rgba(0,217,255,0.2)]"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        {isAssistant ? (
                          <Sparkles className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-sura-text-sec" />
                        )}
                      </div>

                      {/* Text Bubble content */}
                      <div className="space-y-1 max-w-[85%]">
                        <div className="flex items-center gap-2 font-mono text-[9px] text-sura-text-sec/60">
                          <span>{isAssistant ? "SURA AI" : "USER"}</span>
                          <span>•</span>
                          <span>{message.timestamp}</span>
                        </div>
                        <div
                          className={`p-4 rounded-2xl leading-relaxed text-sura-text ${
                            isAssistant
                              ? "glass border border-white/5 shadow-md"
                              : "bg-gradient-to-tr from-sura-purple/20 to-sura-blue/20 border border-sura-blue/20"
                          }`}
                        >
                          {isAssistant ? (
                            <SuraMarkdown text={message.content} />
                          ) : (
                            <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* EMPTY STATE: Quick presets and welcome layout */
                <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sura-purple to-sura-blue p-[1px] flex items-center justify-center animate-pulse-glow shadow-[0_0_40px_rgba(0,217,255,0.2)]">
                    <div className="w-full h-full bg-sura-bg rounded-[15px] flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-sura-blue animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-2xl font-display font-bold tracking-tight text-glow-blue text-sura-text">
                      Sura AI Intelligence Engine
                    </h1>
                    <p className="text-xs text-sura-text-sec mt-2 max-w-sm mx-auto leading-relaxed">
                      "Beyond Intelligence. Beyond Speed. Welcome to the Future." Experience immediate streaming answers and elite reasoning pipelines.
                    </p>
                  </div>

                  {/* Preset prompt pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-4">
                    <button
                      onClick={() => handlePresetPrompt("Explain quantum cryptography protocols in 20 words.")}
                      className="p-3 text-left rounded-xl bg-[#0B1026]/40 border border-white/5 hover:border-sura-blue/30 text-xs text-sura-text-sec hover:text-sura-text transition-all active:scale-95"
                    >
                      <span className="font-semibold text-sura-blue block mb-1">Quantum Synapses</span>
                      Explain quantum cryptography protocols in 20 words.
                    </button>
                    <button
                      onClick={() => handlePresetPrompt("Translate 'Welcome to the Future of speed and intelligence' to Tamil.")}
                      className="p-3 text-left rounded-xl bg-[#0B1026]/40 border border-white/5 hover:border-sura-purple/30 text-xs text-sura-text-sec hover:text-sura-text transition-all active:scale-95"
                    >
                      <span className="font-semibold text-sura-purple block mb-1">Universal Translator</span>
                      Translate "Welcome to the Future" to Tamil colloquial style.
                    </button>
                    <button
                      onClick={() => handlePresetPrompt("Draft a space law legal scenario regarding lunar asteroid mining.")}
                      className="p-3 text-left rounded-xl bg-[#0B1026]/40 border border-white/5 hover:border-sura-pink/30 text-xs text-sura-text-sec hover:text-sura-text transition-all active:scale-95"
                    >
                      <span className="font-semibold text-sura-pink block mb-1">Space Law Scenario</span>
                      Draft a space law legal scenario regarding lunar asteroid mining.
                    </button>
                    <button
                      onClick={() => handlePresetPrompt("Formulate a step-by-step mathematical proof of the Pythagorean theorem.")}
                      className="p-3 text-left rounded-xl bg-[#0B1026]/40 border border-white/5 hover:border-sura-emerald/30 text-xs text-sura-text-sec hover:text-sura-text transition-all active:scale-95"
                    >
                      <span className="font-semibold text-sura-emerald block mb-1">Math Proof</span>
                      Step-by-step logical proof of Pythagorean theorem.
                    </button>
                  </div>
                </div>
              )}

              {/* Streaming loading typing indicator */}
              {isStreaming && (
                <div className="flex gap-4 max-w-3xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sura-purple to-sura-blue flex items-center justify-center shrink-0 border border-sura-blue/30 shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                    <Sparkles className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-sura-text-sec/60">SURA AI STREAMING</span>
                    <div className="p-4 rounded-2xl glass border border-white/5 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sura-blue animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-sura-purple animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-sura-pink animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Conversational text input footer */}
            <footer className="p-4 border-t border-white/5 bg-[#050816]/60 backdrop-blur-md">
              <div className="max-w-3xl mx-auto relative flex items-center bg-[#0B1026]/80 glass rounded-2xl border border-white/10 p-1.5 focus-within:border-sura-blue/40 focus-within:shadow-[0_0_15px_rgba(0,217,255,0.08)] transition-all">
                <input
                  type="text"
                  placeholder={`Consult Sura AI: ask a question or write a prompt (${SURA_MODES.find((m) => m.value === selectedMode)?.label})...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isStreaming}
                  className="flex-1 bg-transparent p-2.5 text-xs text-sura-text border-none focus:outline-none placeholder-sura-text-sec/40 min-w-0"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isStreaming}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-sura-purple to-sura-blue hover:from-sura-purple/90 hover:to-sura-blue/90 text-white font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 flex items-center justify-center shrink-0"
                  title="Send Stream Query"
                >
                  <Send size={13} />
                </button>
              </div>

              {/* Sub-footer instructions */}
              <div className="max-w-3xl mx-auto flex items-center justify-between text-[9px] font-mono text-sura-text-sec/40 px-3 mt-1.5">
                <span>Ctrl+K to launch universal action center</span>
                <span>Powered by Choco Software</span>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* Settings Panel Portal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customInstruction={customInstruction}
        onChangeInstruction={setCustomInstruction}
        accessibilitySettings={accessibilitySettings}
        onUpdateAccessibility={setAccessibilitySettings}
        customApiKey={customApiKey}
        onChangeApiKey={setCustomApiKey}
      />

      {/* Productivity Hub Panel Portal */}
      <ProductivityHub
        isOpen={isProductivityOpen}
        onClose={() => setIsProductivityOpen(false)}
        activeTab={productivityTab}
        onChangeTab={setProductivityTab}
        tasks={tasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        notes={notes}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onUpdateNote={handleUpdateNote}
      />

      {/* Command Actions Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectMode={setSelectedMode}
        onNewSession={handleNewSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProductivity={handleOpenProductivity}
        onClearChats={handleClearAllChats}
      />
    </main>
  );
}
