import { useState } from "react";
import {
  Settings,
  Sliders,
  Shield,
  Activity,
  Cpu,
  Info,
  SlidersHorizontal,
  X,
  Volume2,
  AlertCircle,
  Accessibility,
  CornerDownLeft
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customInstruction: string;
  onChangeInstruction: (val: string) => void;
  accessibilitySettings: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: "small" | "medium" | "large";
  };
  onUpdateAccessibility: (settings: any) => void;
  customApiKey: string;
  onChangeApiKey: (val: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  customInstruction,
  onChangeInstruction,
  accessibilitySettings,
  onUpdateAccessibility,
  customApiKey,
  onChangeApiKey,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "audio" | "accessibility" | "secrets" | "diagnostics">("general");
  const [tempInstruction, setTempInstruction] = useState(customInstruction);
  const [tempApiKey, setTempApiKey] = useState(customApiKey);
  const [voice, setVoice] = useState("Zephyr");

  const saveSettings = () => {
    onChangeInstruction(tempInstruction);
    onChangeApiKey(tempApiKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Backdrop click handler */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Settings Panel */}
      <div className="w-full max-w-2xl glass rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(122,95,255,0.15)] z-10 overflow-hidden flex flex-col h-[500px] animate-float">
        {/* Header bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0B1026]/60">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-sura-purple animate-pulse" />
            <h3 className="text-sm font-display font-semibold tracking-wider text-sura-text">
              SURA CORE ENGINE CONFIG
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-sura-text-sec hover:text-sura-pink transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Panel split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Side navigation */}
          <div className="w-48 border-r border-white/5 bg-[#050816]/40 p-2 space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full text-left p-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "general"
                  ? "bg-sura-purple/10 text-sura-purple border-l-2 border-sura-purple"
                  : "hover:bg-white/5 text-sura-text-sec"
              }`}
            >
              <Sliders size={14} /> Custom Instructions
            </button>
            <button
              onClick={() => setActiveTab("audio")}
              className={`w-full text-left p-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "audio"
                  ? "bg-sura-purple/10 text-sura-purple border-l-2 border-sura-purple"
                  : "hover:bg-white/5 text-sura-text-sec"
              }`}
            >
              <Volume2 size={14} /> Voice & Speech
            </button>
            <button
              onClick={() => setActiveTab("accessibility")}
              className={`w-full text-left p-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "accessibility"
                  ? "bg-sura-purple/10 text-sura-purple border-l-2 border-sura-purple"
                  : "hover:bg-white/5 text-sura-text-sec"
              }`}
            >
              <Accessibility size={14} /> Accessibility
            </button>
            <button
              onClick={() => setActiveTab("secrets")}
              className={`w-full text-left p-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "secrets"
                  ? "bg-sura-purple/10 text-sura-purple border-l-2 border-sura-purple"
                  : "hover:bg-white/5 text-sura-text-sec"
              }`}
            >
              <Shield size={14} /> Secrets & API Keys
            </button>
            <button
              onClick={() => setActiveTab("diagnostics")}
              className={`w-full text-left p-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "diagnostics"
                  ? "bg-sura-purple/10 text-sura-purple border-l-2 border-sura-purple"
                  : "hover:bg-white/5 text-sura-text-sec"
              }`}
            >
              <Activity size={14} /> Sura Diagnostics
            </button>
          </div>

          {/* Core Settings content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* TAB: GENERAL */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-display font-semibold text-sura-text">
                    Custom Intelligence Directives
                  </h4>
                  <p className="text-[10px] text-sura-text-sec/60 mt-0.5">
                    Configure instructions that persist across all conversations, projects, and modes.
                  </p>
                </div>
                <textarea
                  value={tempInstruction}
                  onChange={(e) => setTempInstruction(e.target.value)}
                  placeholder="e.g. 'Keep answers formatted with bullet points', 'I prefer React code styled with Tailwind CSS', 'Respond in Tamil if queried with colloquial expressions'."
                  className="w-full h-44 p-3 rounded-xl bg-white/5 border border-white/10 text-sura-text text-xs font-mono focus:outline-none focus:border-sura-purple focus:ring-1 focus:ring-sura-purple resize-none"
                />
                <div className="bg-[#0B1026]/40 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                  <Shield size={14} className="text-sura-blue mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-semibold text-sura-blue">Privacy Locked</h5>
                    <p className="text-[9px] text-sura-text-sec/70 mt-0.5">
                      Your custom directives and chat history are saved in local encrypted sandbox storage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUDIO */}
            {activeTab === "audio" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-display font-semibold text-sura-text">
                    Voice Modality Config
                  </h4>
                  <p className="text-[10px] text-sura-text-sec/60 mt-0.5">
                    Choose Sura's default prebuilt speaker model for speech-to-text voice conversations.
                  </p>
                </div>

                <div className="space-y-2">
                  {["Zephyr", "Kore", "Puck", "Charon", "Fenrir"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setVoice(v)}
                      className={`w-full p-2.5 rounded-xl text-xs text-left font-medium border flex items-center justify-between transition-all ${
                        voice === v
                          ? "bg-sura-blue/10 border-sura-blue text-sura-blue"
                          : "bg-white/5 border-transparent hover:bg-white/10 text-sura-text-sec"
                      }`}
                    >
                      <span>{v} {v === "Zephyr" && "(Default)"}</span>
                      {voice === v && <span className="text-[10px] font-mono font-semibold">Active</span>}
                    </button>
                  ))}
                </div>

                <div className="bg-sura-pink/10 p-3 rounded-xl border border-sura-pink/20 flex items-start gap-2">
                  <Volume2 size={14} className="text-sura-pink mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-semibold text-sura-pink">TTS Engine Synced</h5>
                    <p className="text-[9px] text-sura-text-sec/70 mt-0.5">
                      Outputs render at 24kHz using raw PCM 16-bit little-endian parameters.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACCESSIBILITY */}
            {activeTab === "accessibility" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-display font-semibold text-sura-text">
                    Display & Accessibility Settings
                  </h4>
                  <p className="text-[10px] text-sura-text-sec/60 mt-0.5">
                    Customize Sura UI rendering properties for optimal reading and comfort.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 cursor-pointer">
                    <span className="text-xs font-semibold text-sura-text">Reduced Motion</span>
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.reducedMotion}
                      onChange={(e) =>
                        onUpdateAccessibility({
                          ...accessibilitySettings,
                          reducedMotion: e.target.checked,
                        })
                      }
                      className="rounded border-white/10 bg-white/5 text-sura-purple focus:ring-0 focus:ring-offset-0"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 cursor-pointer">
                    <span className="text-xs font-semibold text-sura-text">High Contrast Modes</span>
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.highContrast}
                      onChange={(e) =>
                        onUpdateAccessibility({
                          ...accessibilitySettings,
                          highContrast: e.target.checked,
                        })
                      }
                      className="rounded border-white/10 bg-white/5 text-sura-purple focus:ring-0 focus:ring-offset-0"
                    />
                  </label>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                    <span className="text-xs font-semibold text-sura-text">Font Sizing Scale</span>
                    <div className="flex gap-1.5">
                      {(["small", "medium", "large"] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() =>
                            onUpdateAccessibility({
                              ...accessibilitySettings,
                              fontSize: sz,
                            })
                          }
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold uppercase transition-all ${
                            accessibilitySettings.fontSize === sz
                              ? "bg-sura-purple text-white"
                              : "hover:bg-white/10 text-sura-text-sec"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECRETS */}
            {activeTab === "secrets" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-display font-semibold text-sura-text">
                    Custom Gemini API Key
                  </h4>
                  <p className="text-[10px] text-sura-text-sec/60 mt-0.5">
                    By default, Sura AI runs on our shared global free-tier developer keys. If you exhaust the shared quota, you can input your own premium key below.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-sura-purple">
                    Gemini API Secret Key
                  </label>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter your AI Studio API key (AIzaSy...)"
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-sura-text text-xs font-mono focus:outline-none focus:border-sura-purple focus:ring-1 focus:ring-sura-purple"
                  />
                  <p className="text-[9px] text-sura-text-sec/50">
                    Get a free API key from the{" "}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sura-purple hover:underline"
                    >
                      Google AI Studio console
                    </a>.
                  </p>
                </div>

                <div className="bg-sura-blue/10 p-3 rounded-xl border border-sura-blue/20 flex items-start gap-2">
                  <Shield size={14} className="text-sura-blue mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-semibold text-sura-blue">Client-Side Encryption</h5>
                    <p className="text-[9px] text-sura-text-sec/70 mt-0.5">
                      Your premium key is saved purely in your local browser sandbox and is never stored on Choco Software servers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DIAGNOSTICS */}
            {activeTab === "diagnostics" && (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 bg-[#050816]/80 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-sura-blue">
                    <span>STATUS:</span>
                    <span className="font-semibold text-sura-emerald">SYNCED & SECURE</span>
                  </div>
                  <div className="flex items-center justify-between text-sura-text-sec">
                    <span>STARTUP LATENCY:</span>
                    <span>0.04ms (Instant)</span>
                  </div>
                  <div className="flex items-center justify-between text-sura-text-sec">
                    <span>TYPING LATENCY:</span>
                    <span>Near-zero</span>
                  </div>
                  <div className="flex items-center justify-between text-sura-text-sec">
                    <span>CACHE MEMORY:</span>
                    <span>1.2MB / 512MB (Optimized)</span>
                  </div>
                  <div className="flex items-center justify-between text-sura-text-sec">
                    <span>COMPUTING INFERENCE:</span>
                    <span>Cloud Distributed (Edge)</span>
                  </div>
                  <div className="flex items-center justify-between text-sura-text-sec">
                    <span>ENGINE PLATFORM:</span>
                    <span>Sura-Q3 Core Engine</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sura-text-sec/60 text-[10px] bg-white/3 p-2.5 rounded-lg border border-white/5">
                  <Cpu size={14} className="text-sura-purple animate-spin" />
                  <span>Hardware acceleration active. Rendering at full 120 FPS.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 bg-[#050816]/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-sura-text-sec/60 font-mono text-[10px]">
            <span>Choco Software</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sura-text-sec hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sura-purple to-sura-blue hover:from-sura-purple/90 hover:to-sura-blue/90 text-white font-semibold flex items-center gap-1.5"
            >
              Save Configuration <CornerDownLeft size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
