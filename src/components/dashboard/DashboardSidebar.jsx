import { Link, useNavigate } from "react-router-dom";
import { Code2, Folder, Settings, Clock, LogOut, ArrowLeft } from "lucide-react";

export default function DashboardSidebar({ user, activeTab, setActiveTab, handleSignOut }) {
  const navigate = useNavigate();

  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      
      <div className="px-5 py-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sidebar-foreground">
          <Code2 className="text-primary w-5 h-5" />
          <span className="font-semibold tracking-tight text-sm">CoDev</span>
        </Link>
      </div>

      <div className="px-5 py-4 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user.username}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <button 
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm text-left"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="h-px bg-sidebar-border my-2" />

        <button 
          onClick={() => setActiveTab("workspaces")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm
            ${activeTab === "workspaces" 
              ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}
        >
          <Folder className="w-4 h-4" />
          Workspaces
        </button>
        
        <button 
          onClick={() => setActiveTab("recent")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm
            ${activeTab === "recent" 
              ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}
        >
          <Clock className="w-4 h-4" />
          Recent
        </button>

        <button 
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm
            ${activeTab === "settings" 
              ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"}`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
