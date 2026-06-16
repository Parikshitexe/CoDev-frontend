import { Code2, Edit2, Clock, Play, Copy, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <div className="border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors flex flex-col group bg-card">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
          <Code2 className="w-4 h-4 text-primary" />
        </div>
        {editingRoomId === workspace.roomId ? (
          <input
            type="text"
            value={editWorkspaceName}
            onChange={(e) => setEditWorkspaceName(e.target.value)}
            onBlur={() => handleRenameWorkspace(workspace.roomId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameWorkspace(workspace.roomId);
              if (e.key === "Escape") setEditingRoomId(null);
            }}
            autoFocus
            className="flex-1 bg-input border border-border text-foreground text-sm rounded-md px-2 py-0.5 focus:border-primary outline-none min-w-0"
          />
        ) : (
          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            <h3 className="font-medium text-foreground text-sm truncate">{workspace.name}</h3>
            <button
              onClick={() => {
                setEditingRoomId(workspace.roomId);
                setEditWorkspaceName(workspace.name);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted text-muted-foreground rounded transition-all"
              title="Rename workspace"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-[11px] text-muted-foreground font-mono truncate mb-3 select-all bg-muted px-2 py-1 rounded w-fit max-w-full">
        {workspace.roomId}
      </p>
      
      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
        <Clock className="w-3 h-3" /> {formatDate(workspace.savedAt)}
      </p>

      <div className="mt-auto pt-3 border-t border-border flex items-center gap-2">
        <Link to={`/${workspace.roomId}`} className="flex-1 flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary py-1.5 rounded-md text-sm font-medium transition-colors">
          <Play className="w-3.5 h-3.5" /> Open
        </Link>
        
        <button 
          onClick={() => handleCopyLink(workspace.roomId)}
          className="p-1.5 hover:bg-muted text-muted-foreground rounded-md border border-border transition-colors"
          title="Copy link"
        >
          {copiedId === workspace.roomId ? <Check className="w-3.5 h-3.5 text-chart-2" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        
        <button 
          onClick={() => handleDelete(workspace.roomId)}
          className="p-1.5 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-md border border-border transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
