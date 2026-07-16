import { useState, useEffect } from "react";
import {
  Folder,
  File,
  Play,
  Terminal as TerminalIcon,
  GitBranch,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Code2,
  FileCode,
  Check,
  Eye,
  HelpCircle,
  Settings
} from "lucide-react";
import { FileItem } from "../types";

interface CodingWorkspaceProps {
  onAskSura: (prompt: string) => void;
  isStreaming: boolean;
}

const INITIAL_FILES: FileItem[] = [
  {
    id: "f1",
    name: "package.json",
    type: "file",
    content: `{
  "name": "future-sura-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "motion": "^12.0.0"
  }
}`
  },
  {
    id: "f2",
    name: "App.jsx",
    type: "file",
    content: `// Developed by Sura Coding Engine
import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function App() {
  const [pulse, setPulse] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <motion.div 
        animate={{ scale: pulse ? 1.1 : 1 }}
        className="p-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center"
      >
        <h1 className="text-2xl font-bold tracking-wider text-cyan-400">SURA DYNAMIC APP</h1>
        <p className="text-slate-400 mt-2">Rendered smoothly in 120 FPS</p>
        <button 
          onClick={() => setPulse(!pulse)}
          className="mt-6 px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition-all"
        >
          Pulse State
        </button>
      </motion.div>
    </div>
  );
}`
  },
  {
    id: "f3",
    name: "api.py",
    type: "file",
    content: `# Choco Software Quantum Endpoint
from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/api/quantum")
def get_quantum_entropy():
    return {
        "entropy": random.uniform(0.95, 1.0),
        "status": "synchronized",
        "engine": "Sura-Q3"
    }
`
  },
  {
    id: "f4",
    name: "index.css",
    type: "file",
    content: `body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #020617;
  color: #f8fafc;
}`
  }
];

export default function CodingWorkspace({ onAskSura, isStreaming }: CodingWorkspaceProps) {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [selectedFileId, setSelectedFileId] = useState("f2");
  const [activeFile, setActiveFile] = useState<FileItem | undefined>(INITIAL_FILES[1]);
  const [editorContent, setEditorContent] = useState(INITIAL_FILES[1].content || "");
  const [logs, setLogs] = useState<string[]>([
    "[Sura Dev] Workspace synchronized successfully.",
    "[Git] On branch main. Ahead of origin/main by 1 commit.",
    "[NPM] Packages verified. Ready to deploy."
  ]);
  const [gitStatus, setGitStatus] = useState("Synchronized");
  const [isCompiling, setIsCompiling] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [lintErrors, setLintErrors] = useState<string[]>([]);
  const [previewPulse, setPreviewPulse] = useState(false);

  useEffect(() => {
    const file = files.find((f) => f.id === selectedFileId);
    setActiveFile(file);
    if (file) {
      setEditorContent(file.content || "");
    }
  }, [selectedFileId, files]);

  const handleEditorChange = (val: string) => {
    setEditorContent(val);
    setFiles((prev) =>
      prev.map((f) => (f.id === selectedFileId ? { ...f, content: val } : f))
    );
  };

  const executeRun = () => {
    setIsCompiling(true);
    setLogs((prev) => [...prev, "[Vite] Building static assets...", "[Vite] bundling app entrypoint /src/main.jsx"]);
    setTimeout(() => {
      setIsCompiling(false);
      setLogs((prev) => [
        ...prev,
        "[Vite] compilation complete in 42ms.",
        "[HMR] Devserver mounted on port 3000.",
        "[Mock Preview] App active rendering synced."
      ]);
    }, 800);
  };

  const runTest = () => {
    setLogs((prev) => [...prev, "[Vitest] Running unit test assertions..."]);
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "✓ App.test.jsx > basic state check (14ms)",
        "✓ api.test.py > health endpoint verify (8ms)",
        "Test run complete: 2 passed, 0 failed."
      ]);
    }, 500);
  };

  const handleGitPush = () => {
    setGitStatus("Pushing...");
    setLogs((prev) => [...prev, "[Git] git commit -am 'Sura AI optimization update'", "[Git] git push origin main"]);
    setTimeout(() => {
      setGitStatus("Synchronized");
      setLogs((prev) => [...prev, "[Git] remote: push complete. Branch synced on GitHub."]);
    }, 1200);
  };

  const runDiagnostics = () => {
    setLogs((prev) => [...prev, "[Linter] Auditing file contents..."]);
    setTimeout(() => {
      if (editorContent.includes("const") || editorContent.includes("def")) {
        setLintErrors([]);
        setLogs((prev) => [...prev, "✓ ES Audit complete: 0 warnings, 0 errors."]);
      } else {
        setLintErrors(["Missing standard function declarations or module variables"]);
        setLogs((prev) => [...prev, "⚠ ES Audit warning: code seems unstructured."]);
      }
    }, 600);
  };

  const triggerAiAutocomplete = async () => {
    if (!aiPrompt.trim()) return;
    setLogs((prev) => [...prev, `[AI Autocomplete] Generating: "${aiPrompt}"`]);

    const promptMessage = `In the context of this active code file:\n\`\`\`\n${editorContent}\n\`\`\`\nGenerate only the appended snippet or refactored version as requested by: "${aiPrompt}". Do not write any conversational filler, return ONLY the resulting code.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: promptMessage }],
          systemInstruction: "You are an elite code generator. Return ONLY raw executable code without markdown blocks or conversational introductions.",
        }),
      });

      if (!response.ok) throw new Error("Connection failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedCode = "";

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
                  accumulatedCode += parsed.text;
                }
              } catch (e) {}
            }
          }
        }
      }

      // Cleanup backticks if the model returned markdown
      let cleanCode = accumulatedCode.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");

      const updatedText = editorContent + "\n\n" + cleanCode;
      handleEditorChange(updatedText);
      setLogs((prev) => [...prev, "✓ Sura AI autocomplete appended successfully."]);
      setAiPrompt("");
    } catch (err: any) {
      setLogs((prev) => [...prev, `⚠ AI Autocomplete failure: ${err.message}`]);
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#050816]/95 text-sura-text z-0 overflow-hidden">
      {/* Top action bar */}
      <div className="h-12 border-b border-white/5 bg-[#0B1026]/80 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-sura-blue animate-pulse" />
          <h2 className="text-xs font-display font-semibold tracking-wider text-sura-text">
            SURA CODING SUITE
          </h2>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sura-blue/10 border border-sura-blue/20 text-sura-blue">
            Sandbox Active
          </span>
        </div>

        {/* Action button grouping */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={executeRun}
            disabled={isCompiling}
            className="p-1.5 px-3 rounded-lg bg-sura-blue/10 border border-sura-blue/20 text-sura-blue hover:bg-sura-blue/20 transition-all font-medium flex items-center gap-1 active:scale-95 disabled:opacity-50"
          >
            {isCompiling ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            Run dev
          </button>
          <button
            onClick={runTest}
            className="p-1.5 px-3 rounded-lg bg-sura-emerald/10 border border-sura-emerald/20 text-sura-emerald hover:bg-sura-emerald/20 transition-all font-medium flex items-center gap-1 active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Test Code
          </button>
          <button
            onClick={runDiagnostics}
            className="p-1.5 px-3 rounded-lg bg-sura-pink/10 border border-sura-pink/20 text-sura-pink hover:bg-sura-pink/20 transition-all font-medium flex items-center gap-1 active:scale-95 animate-pulse-glow"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Lint
          </button>
        </div>
      </div>

      {/* Workspace Inner panels split */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: File Explorer */}
        <div className="w-52 border-r border-white/5 bg-[#050816]/60 flex flex-col">
          <div className="p-3 border-b border-white/5 text-[9px] font-mono tracking-widest text-sura-text-sec/60 uppercase flex items-center justify-between">
            <span>Project Files</span>
            <GitBranch size={10} className="text-sura-purple" />
          </div>
          <div className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-hidden">
            {files.map((file) => {
              const isSelected = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-all ${
                    isSelected
                      ? "bg-sura-blue/10 text-sura-blue font-medium border-l border-sura-blue"
                      : "hover:bg-white/5 text-sura-text-sec"
                  }`}
                >
                  <FileCode size={13} className={isSelected ? "text-sura-blue" : "text-sura-text-sec/40"} />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* Git Sync Badge */}
          <div className="p-3 border-t border-white/5 bg-[#0B1026]/40 flex items-center justify-between text-[10px] font-mono">
            <span className="text-sura-text-sec/60">git status:</span>
            <button
              onClick={handleGitPush}
              className="text-sura-purple hover:text-sura-blue font-semibold flex items-center gap-1 transition-colors"
            >
              <GitBranch size={10} />
              {gitStatus}
            </button>
          </div>
        </div>

        {/* MIDDLE: Code Editor */}
        <div className="flex-1 flex flex-col border-r border-white/5 min-w-0">
          <div className="h-8 border-b border-white/5 bg-[#050816]/40 px-3 flex items-center justify-between text-[10px] font-mono text-sura-text-sec">
            <span>
              Editing: <strong className="text-sura-blue">{activeFile?.name}</strong>
            </span>
            <span>UTF-8</span>
          </div>

          <div className="flex-1 relative font-mono text-xs p-3 bg-black/20">
            {/* Row index mock counts */}
            <div className="absolute left-2 top-3 w-8 text-right text-white/10 select-none pr-2 border-r border-white/5 h-[90%] leading-5">
              {Array.from({ length: 40 }).map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Editable code text area */}
            <textarea
              value={editorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              spellCheck={false}
              className="w-full h-full pl-10 bg-transparent text-sura-blue border-none focus:outline-none resize-none leading-5 font-mono overflow-y-auto"
            />
          </div>

          {/* AI Autocomplete Input trigger */}
          <div className="p-2 border-t border-white/5 bg-[#0B1026]/60 flex items-center gap-1.5">
            <Sparkles size={14} className="text-sura-purple animate-pulse" />
            <input
              type="text"
              placeholder="Sura AI coding assistant: 'Add random password generator' or 'Optimize lines'..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerAiAutocomplete()}
              className="flex-1 bg-transparent text-xs text-sura-text border-none focus:outline-none placeholder-sura-text-sec/40"
            />
            <button
              onClick={triggerAiAutocomplete}
              disabled={!aiPrompt.trim()}
              className="p-1 px-3 rounded bg-sura-purple text-white text-[10px] font-semibold hover:bg-sura-purple/80 transition-colors disabled:opacity-40"
            >
              Generate
            </button>
          </div>
        </div>

        {/* RIGHT: Live Preview & Terminal split */}
        <div className="w-80 flex flex-col bg-[#050816]/80 min-w-[200px]">
          {/* Top block: Live visual component mock preview */}
          <div className="flex-1 flex flex-col border-b border-white/5 overflow-hidden">
            <div className="h-8 border-b border-white/5 bg-[#050816]/40 px-3 flex items-center justify-between text-[10px] font-mono text-sura-text-sec">
              <span className="flex items-center gap-1">
                <Eye size={12} className="text-sura-emerald" /> Live Render Preview
              </span>
              <span className="text-sura-emerald font-semibold">120 FPS</span>
            </div>

            <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center relative">
              {/* Actual render mock that responds to actions */}
              <div className="w-full text-center p-6 border border-white/10 rounded-xl bg-white/3 glass transition-transform duration-300">
                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-all ${
                    previewPulse
                      ? "bg-sura-blue text-black scale-110 shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                      : "bg-sura-blue/10 text-sura-blue border border-sura-blue/30"
                  }`}
                  onClick={() => setPreviewPulse(!previewPulse)}
                >
                  <Code2 size={20} className={previewPulse ? "animate-spin" : ""} />
                </div>
                <h3 className="text-sm font-semibold tracking-wide text-sura-text mt-3 font-display">
                  {selectedFileId === "f2" ? "App.jsx Sandbox" : `${activeFile?.name} Preview`}
                </h3>
                <p className="text-[10px] text-sura-text-sec/60 mt-1">
                  Click action triggers hot-state rendering
                </p>
                <button
                  onClick={() => setPreviewPulse(!previewPulse)}
                  className="mt-4 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-sura-text-sec transition-all"
                >
                  Toggle Component State
                </button>
              </div>

              {/* Glowing overlay */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-sura-bg to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom block: Live Terminal console logs */}
          <div className="h-44 flex flex-col overflow-hidden bg-black/60">
            <div className="h-7 border-b border-white/5 bg-black/40 px-3 flex items-center justify-between text-[9px] font-mono text-sura-text-sec">
              <span className="flex items-center gap-1">
                <TerminalIcon size={10} className="text-sura-pink" /> Sura Terminal CLI
              </span>
              <button
                onClick={() => setLogs([])}
                className="text-red-400 hover:text-red-300 hover:underline"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 p-3 font-mono text-[10px] text-[#00FFA3] space-y-1 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-white/30 mr-1">$</span>
                  {log}
                </div>
              ))}
              {isCompiling && (
                <div className="text-sura-blue animate-pulse">
                  $ [Compiling Engine] running optimization logic...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lint Warnings Dialog bar if errors exist */}
      {lintErrors.length > 0 && (
        <div className="bg-sura-warning/20 border-t border-sura-warning/30 p-2.5 px-4 flex items-center justify-between text-xs text-sura-warning">
          <span className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>Diagnostics Check: {lintErrors[0]}</span>
          </span>
          <button
            onClick={() => setLintErrors([])}
            className="font-semibold text-[10px] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
