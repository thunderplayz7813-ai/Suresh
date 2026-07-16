import React, { useState } from "react";
import {
  Sparkles,
  Code2,
  BrainCircuit,
  Plus,
  Pin,
  Folder,
  FolderPlus,
  Bookmark,
  Settings,
  ListTodo,
  FileText,
  ChevronRight,
  ChevronDown,
  Trash2,
  Command,
  HelpCircle,
  Activity,
  Workflow
} from "lucide-react";
import { ChatSession, Folder as FolderType, Mode, SURA_MODES } from "../types";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  folders: FolderType[];
  onSelectSession: (id: string) => void;
  onNewSession: (modeValue?: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onMoveToFolder: (sessionId: string, folderId: string | undefined) => void;
  onOpenSettings: () => void;
  onOpenProductivity: (tab: "tasks" | "notes") => void;
  onOpenCommandPalette: () => void;
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  folders,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onTogglePin,
  onToggleBookmark,
  onCreateFolder,
  onMoveToFolder,
  onOpenSettings,
  onOpenProductivity,
  onOpenCommandPalette,
  selectedMode,
  onSelectMode,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setShowFolderModal(false);
    }
  };

  const pinnedSessions = sessions.filter((s) => s.isPinned);
  const bookmarkedSessions = sessions.filter((s) => s.isBookmarked && !s.isPinned);
  const unassignedSessions = sessions.filter((s) => !s.isPinned && !s.folderId);

  return (
    <aside
      id="sura-sidebar"
      className={`h-screen transition-all duration-300 flex flex-col z-10 glass border-r border-white/5 ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sura-purple to-sura-blue p-[1px] flex items-center justify-center animate-pulse-glow">
              <div className="w-full h-full bg-[#050816] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sura-blue" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-display font-bold tracking-wider text-sura-text">
                SURA AI
              </h1>
              <p className="text-[10px] text-sura-text-sec font-medium tracking-tight">
                by Choco Software
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-tr from-sura-purple to-sura-blue flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sura-blue" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sura-text-sec hover:text-sura-blue transition-colors p-1 rounded hover:bg-white/5 text-[11px] font-mono hidden md:block"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          id="btn-new-chat"
          onClick={() => onNewSession(selectedMode)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sura-purple/20 to-sura-blue/20 hover:from-sura-purple/30 hover:to-sura-blue/30 border border-sura-blue/30 hover:border-sura-blue/60 text-sura-text font-medium text-xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(0,217,255,0.05)] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)]"
        >
          <Plus size={14} className="text-sura-blue" />
          {!collapsed && <span>New Session</span>}
        </button>
      </div>

      {/* Main Navigation/Scrollable area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-hidden">
        {/* Mode Selector pills (Icon only when collapsed) */}
        {!collapsed && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono tracking-widest text-sura-text-sec/60 uppercase">
              AI Engines
            </p>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/3 rounded-xl border border-white/5">
              {SURA_MODES.slice(0, 4).map((mode) => {
                const isActive = selectedMode === mode.value;
                return (
                  <button
                    key={mode.value}
                    onClick={() => {
                      onSelectMode(mode.value);
                      onNewSession(mode.value);
                    }}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-center transition-all ${
                      isActive
                        ? "bg-sura-blue/10 border border-sura-blue/20 text-sura-blue"
                        : "hover:bg-white/5 border border-transparent text-sura-text-sec"
                    }`}
                  >
                    {mode.value === "coding" ? (
                      <Code2 size={16} />
                    ) : mode.value === "reasoning" ? (
                      <BrainCircuit size={16} />
                    ) : mode.value === "research" ? (
                      <Workflow size={16} />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    <span className="text-[10px] font-medium mt-1 truncate max-w-full">
                      {mode.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Command Palette Indicator */}
        {!collapsed && (
          <button
            onClick={onOpenCommandPalette}
            className="w-full p-2 px-3 rounded-lg bg-white/3 border border-white/5 text-sura-text-sec/80 hover:text-sura-blue hover:border-sura-blue/20 text-[11px] font-mono flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-1.5">
              <Command size={12} /> Command Palette
            </span>
            <kbd className="bg-white/10 px-1 rounded text-[9px] text-white/50">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Pinned Section */}
        {pinnedSessions.length > 0 && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-mono tracking-widest text-sura-text-sec/60 uppercase flex items-center gap-1">
                <Pin size={10} className="text-sura-pink" /> Pinned Chats
              </p>
            )}
            <div className="space-y-0.5">
              {pinnedSessions.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-center justify-between p-2 rounded-lg transition-all ${
                    currentSessionId === s.id
                      ? "bg-sura-purple/10 border border-sura-purple/20 text-sura-purple"
                      : "hover:bg-white/5 text-sura-text-sec"
                  }`}
                >
                  <button
                    onClick={() => onSelectSession(s.id)}
                    className="flex-1 text-left truncate text-xs font-medium pl-1"
                  >
                    {collapsed ? "📌" : s.title}
                  </button>
                  {!collapsed && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <button
                        onClick={() => onTogglePin(s.id)}
                        className="p-1 hover:text-sura-pink rounded hover:bg-white/10"
                        title="Unpin Chat"
                      >
                        <Pin size={10} className="fill-sura-pink text-sura-pink" />
                      </button>
                      <button
                        onClick={() => onDeleteSession(s.id)}
                        className="p-1 hover:text-red-400 rounded hover:bg-white/10"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Folders Section */}
        <div className="space-y-1">
          <div className="px-3 flex items-center justify-between">
            {!collapsed && (
              <p className="text-[10px] font-mono tracking-widest text-sura-text-sec/60 uppercase">
                Folders
              </p>
            )}
            {!collapsed && (
              <button
                onClick={() => setShowFolderModal(true)}
                className="text-sura-text-sec hover:text-sura-blue p-0.5 rounded"
                title="Create Folder"
              >
                <FolderPlus size={12} />
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {folders.map((folder) => {
              const isExpanded = expandedFolders[folder.id];
              const folderSessions = sessions.filter((s) => s.folderId === folder.id);

              return (
                <div key={folder.id} className="space-y-0.5">
                  <div
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-sura-text-sec cursor-pointer"
                    onClick={() => !collapsed && toggleFolder(folder.id)}
                  >
                    <div className="flex items-center gap-1.5 truncate text-xs font-medium">
                      <Folder size={12} className="text-sura-blue" />
                      {!collapsed && <span className="truncate">{folder.name}</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        {folderSessions.length > 0 && (
                          <span className="text-[9px] font-mono bg-white/10 px-1 rounded">
                            {folderSessions.length}
                          </span>
                        )}
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </div>
                    )}
                  </div>

                  {/* Render Sessions in Folder */}
                  {!collapsed && isExpanded && (
                    <div className="pl-4 border-l border-white/5 ml-3 space-y-0.5">
                      {folderSessions.map((fs) => (
                        <div
                          key={fs.id}
                          className={`group flex items-center justify-between p-1.5 rounded-lg transition-all ${
                            currentSessionId === fs.id
                              ? "bg-sura-blue/10 border border-sura-blue/20 text-sura-blue"
                              : "hover:bg-white/5 text-sura-text-sec"
                          }`}
                        >
                          <button
                            onClick={() => onSelectSession(fs.id)}
                            className="flex-1 text-left truncate text-xs"
                          >
                            {fs.title}
                          </button>
                          <button
                            onClick={() => onMoveToFolder(fs.id, undefined)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-sura-blue rounded"
                            title="Remove from Folder"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Flat Recent Sessions flat list */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-mono tracking-widest text-sura-text-sec/60 uppercase">
              Recent Conversations
            </p>
          )}
          <div className="space-y-0.5">
            {unassignedSessions.map((s) => (
              <div
                key={s.id}
                className={`group flex items-center justify-between p-2 rounded-lg transition-all ${
                  currentSessionId === s.id
                    ? "bg-sura-blue/10 border border-sura-blue/20 text-sura-blue"
                    : "hover:bg-white/5 text-sura-text-sec"
                }`}
              >
                <button
                  onClick={() => onSelectSession(s.id)}
                  className="flex-1 text-left truncate text-xs font-medium"
                >
                  {collapsed ? "💬" : s.title}
                </button>
                {!collapsed && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(s.id)}
                      className="p-1 hover:text-sura-pink rounded hover:bg-white/10"
                      title="Pin Chat"
                    >
                      <Pin size={10} />
                    </button>
                    <button
                      onClick={() => onToggleBookmark(s.id)}
                      className={`p-1 rounded hover:bg-white/10 ${
                        s.isBookmarked ? "text-sura-blue" : "hover:text-sura-blue"
                      }`}
                      title="Favorite Chat"
                    >
                      <Bookmark size={10} className={s.isBookmarked ? "fill-sura-blue" : ""} />
                    </button>
                    <button
                      onClick={() => onDeleteSession(s.id)}
                      className="p-1 hover:text-red-400 rounded hover:bg-white/10"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {sessions.length === 0 && !collapsed && (
              <p className="text-[11px] text-center text-sura-text-sec/40 py-4 font-mono">
                No active streams.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Productivity Trigger Panels */}
      {!collapsed && (
        <div className="px-3 py-2 border-t border-white/5 space-y-1">
          <p className="px-3 text-[9px] font-mono tracking-widest text-sura-text-sec/40 uppercase">
            Work tools
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onOpenProductivity("tasks")}
              className="py-1.5 px-3 rounded-lg bg-white/3 border border-white/5 text-sura-text-sec hover:text-sura-emerald hover:border-sura-emerald/20 transition-all text-[11px] font-medium flex items-center justify-center gap-1.5"
            >
              <ListTodo size={12} />
              Planner
            </button>
            <button
              onClick={() => onOpenProductivity("notes")}
              className="py-1.5 px-3 rounded-lg bg-white/3 border border-white/5 text-sura-text-sec hover:text-sura-pink hover:border-sura-pink/20 transition-all text-[11px] font-medium flex items-center justify-center gap-1.5"
            >
              <FileText size={12} />
              Notes
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation bar */}
      <div className="p-3 border-t border-white/5 flex items-center justify-between">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sura-emerald animate-ping" />
              <div className="text-[10px] font-mono text-sura-emerald">
                SURA v2.5 SECURE
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="p-2 text-sura-text-sec hover:text-sura-blue rounded-lg hover:bg-white/5 transition-all"
              title="Sura AI Core Config"
            >
              <Settings size={15} />
            </button>
          </>
        ) : (
          <button
            onClick={onOpenSettings}
            className="mx-auto p-2 text-sura-text-sec hover:text-sura-blue rounded-lg hover:bg-white/5"
          >
            <Settings size={15} />
          </button>
        )}
      </div>

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateFolder}
            className="w-full max-w-sm glass rounded-2xl border border-white/10 p-6 space-y-4"
          >
            <h3 className="text-sm font-display font-semibold text-sura-text">
              Create New Folder
            </h3>
            <input
              type="text"
              required
              placeholder="e.g., Development, Content Strategy"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-sura-text text-xs focus:outline-none focus:border-sura-blue focus:ring-1 focus:ring-sura-blue"
            />
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 rounded-lg hover:bg-white/5 text-sura-text-sec"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sura-blue text-black font-semibold hover:bg-sura-blue/90"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
