import { Code2, Edit2, Clock, Play, Copy, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

// Language badge color map
const LANG_COLORS = {
  javascript: { label: "JS", color: "#e3b341" },
  python: { label: "PY", color: "#79c0ff" },
  cpp: { label: "C++", color: "#d2a8ff" },
  java: { label: "JV", color: "#f78166" },
};

export default function WorkspaceCard({
  workspace,
  editingRoomId,
  editWorkspaceName,
  setEditWorkspaceName,
  handleRenameWorkspace,
  setEditingRoomId,
  formatDate,
  handleCopyLink,
  copiedId,
  handleDelete
}) {
  const lang = LANG_COLORS["javascript"]; // default; can be extended later

  return (
    <motion.div
      whileHover={{ borderColor: "#333333" }}
      transition={{ duration: 0.2 }}
      className="border border-[#1a1a1a] rounded-xl p-4 flex flex-col group bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Top highlight line on hover */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-md border border-[#1a1a1a] bg-[#050505] flex items-center justify-center shrink-0">
          <Code2 className="w-3.5 h-3.5 text-[#737373]" />
        </div>

        {editingRoomId === workspace.roomId ? (
          <Input
            type="text"
            value={editWorkspaceName}
            onChange={(e) => setEditWorkspaceName(e.target.value)}
            onBlur={() => handleRenameWorkspace(workspace.roomId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameWorkspace(workspace.roomId);
              if (e.key === "Escape") setEditingRoomId(null);
            }}
            autoFocus
            className="flex-1 h-7 text-sm bg-[#050505] border-[#333] text-white"
          />
        ) : (
          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            <h3 className="font-medium text-white text-sm truncate tracking-tight">{workspace.name}</h3>
            <button
              onClick={() => {
                setEditingRoomId(workspace.roomId);
                setEditWorkspaceName(workspace.name);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#111] text-[#555] hover:text-[#737373] transition-all ml-auto shrink-0"
              title="Rename workspace"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Date + Language badge */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-[#555] flex items-center gap-1">
          <Clock className="w-3 h-3" /> {formatDate(workspace.savedAt)}
        </p>
        <span
          className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border"
          style={{ color: lang.color, borderColor: `${lang.color}33`, background: `${lang.color}11` }}
        >
          {lang.label}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-3 border-t border-[#1a1a1a] flex items-center gap-2">
        <Link
          to={`/${workspace.roomId}`}
          className="flex-1 flex items-center justify-center gap-1.5 h-7 rounded-md bg-white text-black text-xs font-medium hover:bg-[#ededed] transition-colors"
        >
          <Play className="w-3 h-3 fill-current" /> Open
        </Link>

        <button
          onClick={() => handleCopyLink(workspace.roomId)}
          className="h-7 w-7 rounded-md border border-[#1a1a1a] bg-transparent text-[#555] hover:text-white hover:border-[#333] flex items-center justify-center transition-colors"
          title="Copy link"
        >
          {copiedId === workspace.roomId
            ? <Check className="w-3 h-3 text-[#3fb950]" />
            : <Copy className="w-3 h-3" />}
        </button>

        <button
          onClick={() => handleDelete(workspace.roomId)}
          className="h-7 w-7 rounded-md border border-[#1a1a1a] bg-transparent text-[#555] hover:text-[#f78166] hover:border-[#f78166]/30 flex items-center justify-center transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
