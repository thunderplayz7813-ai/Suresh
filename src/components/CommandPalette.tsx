import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Sparkles,
  Code2,
  Settings,
  ListTodo,
  FileText,
  Terminal,
  Eraser,
  HelpCircle,
  BrainCircuit,
  Languages
} from "lucide-react";
import { Mode, SURA_MODES } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (modeValue: string) => void;
  onNewSession: (modeValue: string) => void;
  onOpenSettings: () => void;
  onOpenProductivity: (tab: "tasks" | "notes") => void;
  onClearChats: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectMode,
  onNewSession,
  onOpenSettings,
  onOpenProductivity,
  onClearChats,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands = [
    {
      id: "mode-general",
      title: "Switch to General Assistant",
      subtitle: "Ask general queries with Sura AI fast-processing model.",
      icon: <Sparkles className="w-4 h-4 text-sura-blue" />,
      action: () => {
        onSelectMode("general");
        onNewSession("general");
      },
    },
    {
      id: "mode-coding",
      title: "Activate Sura Coding Engine",
      subtitle: "Dedicated coding environment & software architect workspace.",
      icon: <Code2 className="w-4 h-4 text-sura-purple" />,
      action: () => {
        onSelectMode("coding");
        onNewSession("coding");
      },
    },
    {
      id: "mode-reasoning",
      title: "Toggle Deep Reasoning",
      subtitle: "Perform logical breakdown & step-by-step math proofing.",
      icon: <BrainCircuit className="w-4 h-4 text-sura-pink" />,
      action: () => {
        onSelectMode("reasoning");
        onNewSession("reasoning");
      },
    },
    {
      id: "mode-translator",
      title: "Open Universal Translator",
      subtitle: "Detect & translate mixed languages smoothly.",
      icon: <Languages className="w-4 h-4 text-sura-emerald" />,
      action: () => {
        onSelectMode("translator");
        onNewSession("translator");
      },
    },
    {
      id: "open-settings",
      title: "Open Settings Panel",
      subtitle: "Customize system instructions, view diagnostics & credits.",
      icon: <Settings className="w-4 h-4 text-sura-warning" />,
      action: () => onOpenSettings(),
    },
    {
      id: "open-tasks",
      title: "View Tasks & Planner",
      subtitle: "Manage dynamic checklist items for active workflows.",
      icon: <ListTodo className="w-4 h-4 text-sura-emerald" />,
      action: () => onOpenProductivity("tasks"),
    },
    {
      id: "open-notes",
      title: "Open Notes Notepad",
      subtitle: "Keep markdown scratchpads for references & coding logs.",
      icon: <FileText className="w-4 h-4 text-sura-pink" />,
      action: () => onOpenProductivity("notes"),
    },
    {
      id: "clear-chats",
      title: "Flush Conversations Cache",
      subtitle: "Clear all local chat histories securely.",
      icon: <Eraser className="w-4 h-4 text-red-400" />,
      action: () => {
        if (confirm("Are you sure you want to delete all Sura conversations?")) {
          onClearChats();
        }
      },
    },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050816]/75 backdrop-blur-md z-50 flex items-start justify-center pt-[15vh] p-4">
      {/* Backdrop Close action handler */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Main Palette */}
      <div
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg glass rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,217,255,0.15)] z-10 flex flex-col overflow-hidden animate-float"
      >
        {/* Search header bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0B1026]/40">
          <Search className="w-5 h-5 text-sura-blue animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search action..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none text-sura-text text-sm focus:outline-none placeholder-sura-text-sec/40"
          />
          <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-sura-text-sec/60">
            ESC
          </span>
        </div>

        {/* Results list */}
        <div className="max-h-[320px] overflow-y-auto p-2 space-y-1">
          {filtered.map((cmd, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-sura-purple/25 to-sura-blue/25 border-l-2 border-sura-blue text-sura-text pl-4"
                    : "hover:bg-white/5 text-sura-text-sec"
                }`}
              >
                <div className="mt-0.5 p-1 bg-white/5 rounded-lg">{cmd.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold tracking-wide">{cmd.title}</p>
                  <p className="text-[10px] text-sura-text-sec/70 mt-0.5 truncate">
                    {cmd.subtitle}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-[9px] font-mono bg-sura-blue/20 text-sura-blue px-1.5 py-0.5 rounded self-center">
                    ENTER
                  </span>
                )}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-sura-text-sec/40 font-mono">
              No diagnostics or commands matching "{query}"
            </div>
          )}
        </div>

        {/* Bottom instructions bar */}
        <div className="p-3 border-t border-white/5 bg-[#050816]/90 text-[10px] text-sura-text-sec/60 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigation</span>
            <span>↵ Select</span>
          </div>
          <span>Sura AI Universal Actions Engine</span>
        </div>
      </div>
    </div>
  );
}
