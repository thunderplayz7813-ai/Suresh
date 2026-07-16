import React, { useState } from "react";
import {
  ListTodo,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  FileEdit,
  X,
  FilePlus,
  Bookmark,
  Calendar,
  Check
} from "lucide-react";
import { TaskItem, NoteItem } from "../types";

interface ProductivityHubProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "tasks" | "notes";
  onChangeTab: (tab: "tasks" | "notes") => void;
  tasks: TaskItem[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  notes: NoteItem[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
}

export default function ProductivityHub({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
}: ProductivityHubProps) {
  // Task State
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Note State
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [activeNoteTitle, setActiveNoteTitle] = useState("");
  const [activeNoteContent, setActiveNoteContent] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteTitle.trim()) {
      onAddNote(newNoteTitle.trim(), "Start drafting note here...");
      setNewNoteTitle("");
      setShowAddNoteForm(false);
      // Select the newly created note
      setTimeout(() => {
        if (notes.length > 0) {
          setSelectedNoteId(notes[notes.length - 1].id);
        }
      }, 50);
    }
  };

  const handleSelectNote = (note: NoteItem) => {
    setSelectedNoteId(note.id);
    setActiveNoteTitle(note.title);
    setActiveNoteContent(note.content);
    setIsEditingNote(true);
  };

  const handleSaveNote = () => {
    if (selectedNoteId) {
      onUpdateNote(selectedNoteId, activeNoteTitle, activeNoteContent);
      setIsEditingNote(false);
    }
  };

  const currentNote = notes.find((n) => n.id === selectedNoteId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Backdrop handler */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Main Productivity Hub container */}
      <div className="w-full max-w-3xl glass rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,255,163,0.1)] z-10 overflow-hidden flex flex-col h-[520px] animate-float">
        {/* Header bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0B1026]/60">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-display font-bold tracking-wider text-sura-text">
              PRODUCTIVITY SUITE
            </h3>
            <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg border border-white/5">
              <button
                onClick={() => onChangeTab("tasks")}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold uppercase flex items-center gap-1 transition-all ${
                  activeTab === "tasks"
                    ? "bg-sura-emerald text-black"
                    : "hover:bg-white/5 text-sura-text-sec"
                }`}
              >
                <ListTodo size={11} /> Tasks Planner
              </button>
              <button
                onClick={() => onChangeTab("notes")}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold uppercase flex items-center gap-1 transition-all ${
                  activeTab === "notes"
                    ? "bg-sura-pink text-black"
                    : "hover:bg-white/5 text-sura-text-sec"
                }`}
              >
                <FileText size={11} /> Notes Workspace
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-sura-text-sec hover:text-sura-pink transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* TAB: TASKS PLANNER */}
          {activeTab === "tasks" && (
            <div className="flex-1 p-6 flex flex-col space-y-4">
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Schedule a new milestone, code refactor, or meeting notes run..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/10 text-sura-text text-xs focus:outline-none focus:border-sura-emerald"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sura-emerald text-black font-semibold text-xs flex items-center gap-1 hover:bg-sura-emerald/90 transition-all active:scale-95"
                >
                  <Plus size={14} /> Add Task
                </button>
              </form>

              {/* Task Items Scroll list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hidden">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      task.completed
                        ? "bg-white/2 border-white/5 opacity-55"
                        : "bg-[#0B1026]/40 border-sura-emerald/15 hover:border-sura-emerald/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          task.completed
                            ? "bg-sura-emerald border-sura-emerald text-black"
                            : "border-white/20 hover:border-sura-emerald"
                        }`}
                      >
                        {task.completed && <Check size={11} strokeWidth={3} />}
                      </button>
                      <span
                        className={`text-xs text-sura-text ${
                          task.completed ? "line-through text-sura-text-sec/50" : ""
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-sura-text-sec/40 hover:text-red-400 p-1 rounded hover:bg-white/5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center text-xs text-sura-text-sec/30 py-16 font-mono">
                    No active workflows or planned items.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: NOTES WORKSPACE */}
          {activeTab === "notes" && (
            <div className="flex-1 flex overflow-hidden">
              {/* Notes sidebar tree */}
              <div className="w-56 border-r border-white/5 bg-[#050816]/40 p-3 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-wider text-sura-text-sec/50 uppercase">
                    Saved Notes ({notes.length})
                  </span>
                  <button
                    onClick={() => setShowAddNoteForm(true)}
                    className="text-sura-pink hover:text-sura-blue p-0.5 rounded hover:bg-white/5"
                    title="Add Note"
                  >
                    <FilePlus size={13} />
                  </button>
                </div>

                {/* New note small form toggle */}
                {showAddNoteForm && (
                  <form onSubmit={handleCreateNote} className="flex gap-1">
                    <input
                      type="text"
                      required
                      placeholder="Note Title..."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="flex-1 p-1 px-2 rounded bg-white/5 border border-white/10 text-sura-text text-[11px] focus:outline-none focus:border-sura-pink"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded bg-sura-pink text-black"
                    >
                      <Plus size={11} />
                    </button>
                  </form>
                )}

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hidden">
                  {notes.map((note) => {
                    const isSelected = note.id === selectedNoteId;
                    return (
                      <div
                        key={note.id}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between group transition-all ${
                          isSelected
                            ? "bg-sura-pink/10 border border-sura-pink/25 text-sura-pink"
                            : "hover:bg-white/5 text-sura-text-sec"
                        }`}
                        onClick={() => handleSelectNote(note)}
                      >
                        <span className="text-xs font-medium truncate flex-1 pl-1">
                          {note.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                            if (selectedNoteId === note.id) {
                              setSelectedNoteId(notes[0]?.id || null);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-sura-text-sec/40 hover:text-red-400 rounded hover:bg-white/10"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Note Content Editor */}
              <div className="flex-1 p-4 flex flex-col space-y-3 bg-[#050816]/20">
                {selectedNoteId && isEditingNote ? (
                  <>
                    <input
                      type="text"
                      value={activeNoteTitle}
                      onChange={(e) => setActiveNoteTitle(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-sura-text border-b border-white/10 pb-2 focus:outline-none focus:border-sura-pink"
                    />
                    <textarea
                      value={activeNoteContent}
                      onChange={(e) => setActiveNoteContent(e.target.value)}
                      className="flex-1 w-full bg-transparent text-xs text-sura-text font-mono focus:outline-none resize-none leading-relaxed overflow-y-auto"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-1.5 rounded-lg bg-sura-pink text-black font-semibold text-[11px] hover:bg-sura-pink/90 transition-all flex items-center gap-1.5 active:scale-95 shadow-[0_0_10px_rgba(255,79,234,0.15)]"
                      >
                        <Check size={12} /> Save Draft
                      </button>
                    </div>
                  </>
                ) : currentNote ? (
                  <div onClick={() => handleSelectNote(currentNote)} className="flex-1 flex flex-col space-y-2 cursor-pointer group">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-sm font-semibold text-sura-text">
                        {currentNote.title}
                      </h4>
                      <span className="text-[10px] text-sura-text-sec/40 font-mono">
                        {currentNote.timestamp}
                      </span>
                    </div>
                    <div className="flex-1 text-xs text-sura-text-sec/80 font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto">
                      {currentNote.content}
                    </div>
                    <div className="text-[10px] text-sura-pink font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <FileEdit size={10} /> Click to edit note content
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-sura-text-sec/30 font-mono py-12">
                    <FileText size={24} className="mb-2 text-sura-text-sec/20" />
                    <span>Create or select a notepad draft.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-white/5 bg-[#050816]/90 text-[10px] text-sura-text-sec/40 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={11} className="text-sura-emerald" />
            <span>Productivity Sync: Local Storage Sandbox Active</span>
          </div>
          <span>Choco Software</span>
        </div>
      </div>
    </div>
  );
}
