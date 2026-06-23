import { Link, useNavigate } from "react-router-dom";
import { Code2, Folder, Settings, Clock, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardSidebar({ user, activeTab, setActiveTab, handleSignOut }) {
  const navigate = useNavigate();

  return (
    <aside className="w-60 bg-sidebar/50 backdrop-blur-md border-r border-sidebar-border flex flex-col shrink-0">
      
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

      <nav className="flex-1 px-3 py-3 space-y-1">
        <Button 
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Button>

        <div className="h-px bg-sidebar-border my-2" />

        <Button 
          variant={activeTab === "workspaces" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("workspaces")}
          className={`w-full justify-start ${activeTab !== "workspaces" ? "text-muted-foreground" : ""}`}
        >
          <Folder className="w-4 h-4 mr-2" />
          Workspaces
        </Button>
        
        <Button 
          variant={activeTab === "recent" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("recent")}
          className={`w-full justify-start ${activeTab !== "recent" ? "text-muted-foreground" : ""}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Recent
        </Button>

        <Button 
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("settings")}
          className={`w-full justify-start ${activeTab !== "settings" ? "text-muted-foreground" : ""}`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <Button 
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
