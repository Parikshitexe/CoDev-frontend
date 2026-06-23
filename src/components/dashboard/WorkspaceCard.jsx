import { Code2, Edit2, Clock, Play, Copy, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col group bg-card/80 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
          <Code2 className="w-4 h-4 text-primary" />
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
            className="flex-1 h-8"
          />
        ) : (
          <div className="flex-1 flex items-center gap-2 overflow-hidden">
            <h3 className="font-medium text-foreground text-sm truncate">{workspace.name}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingRoomId(workspace.roomId);
                setEditWorkspaceName(workspace.name);
              }}
              className="opacity-0 group-hover:opacity-100 h-6 w-6 ml-auto"
              title="Rename workspace"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1 mt-2">
        <Clock className="w-3 h-3" /> {formatDate(workspace.savedAt)}
      </p>

      <div className="mt-auto pt-3 border-t border-border flex items-center gap-2">
        <Button asChild className="flex-1 h-8" variant="default">
          <Link to={`/${workspace.roomId}`}>
            <Play className="w-3.5 h-3.5 mr-1.5" /> Open
          </Link>
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={() => handleCopyLink(workspace.roomId)}
          className="h-8 w-8 text-muted-foreground"
          title="Copy link"
        >
          {copiedId === workspace.roomId ? <Check className="w-3.5 h-3.5 text-chart-2" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={() => handleDelete(workspace.roomId)}
          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
