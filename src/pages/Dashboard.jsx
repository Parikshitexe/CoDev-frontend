import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Folder, Settings, Clock, LogOut, Plus, Trash2, Copy, Play, Check } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workspaces");
  const [user, setUser] = useState(null);
  
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/workspaces", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user]);

  const handleCreateNew = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const token = localStorage.getItem("token");
    const newRoomId = uuidv4();

    try {
      const response = await fetch("http://localhost:3000/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: newRoomId,
          name: newWorkspaceName.trim()
        })
      });

      if (response.ok) {
        navigate(`/${newRoomId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (roomId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/workspaces/${roomId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWorkspaces(prev => prev.filter(w => w.roomId !== roomId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (roomId) => {
    const link = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="dark min-h-screen w-full bg-background flex font-sans text-foreground overflow-hidden">
      
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        
        <div className="p-6 border-b border-sidebar-border flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg mb-3">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-bold text-sidebar-foreground text-lg">{user.username}</h2>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("workspaces")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm
              ${activeTab === "workspaces" 
                ? "bg-primary/10 text-sidebar-primary" 
                : "text-sidebar-foreground hover:bg-muted"}`}
          >
            <Folder className="w-5 h-5" />
            My Workspaces
          </button>
          
          <button 
            onClick={() => setActiveTab("recent")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm
              ${activeTab === "recent" 
                ? "bg-primary/10 text-sidebar-primary" 
                : "text-sidebar-foreground hover:bg-muted"}`}
          >
            <Clock className="w-5 h-5" />
            Recent Activity
          </button>

          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm
              ${activeTab === "settings" 
                ? "bg-primary/10 text-sidebar-primary" 
                : "text-sidebar-foreground hover:bg-muted"}`}
          >
            <Settings className="w-5 h-5" />
            Account Settings
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors font-medium text-sm text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="p-10 max-w-6xl mx-auto">
          
          {activeTab === "workspaces" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back, {user.username}!</h1>
                  <p className="text-muted-foreground">Manage your permanent collaborative environments.</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-primary hover:brightness-110 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <Plus className="w-5 h-5" />
                  New Workspace
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-sm font-semibold gap-3">
                  <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  Loading workspaces...
                </div>
              ) : workspaces.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                  <Folder className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-bold text-card-foreground">No workspaces saved yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-6">Create a new workspace or join your friends to start writing code in real time.</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors border border-primary/20"
                  >
                    <Plus className="w-4 h-4" /> Create One Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workspaces.map((workspace, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-[0_2px_10px_var(--shadow-color)] hover:border-primary/50 transition-colors flex flex-col group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <Terminal className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-card-foreground text-lg mb-1 truncate">{workspace.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono truncate mb-4 select-all bg-background border border-border px-2 py-0.5 rounded w-max">
                        {workspace.roomId}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Bookmarked {formatDate(workspace.savedAt)}
                      </p>

                      <div className="mt-auto pt-4 border-t border-border flex items-center gap-2">
                        <Link to={`/${workspace.roomId}`} className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground py-2 rounded-md font-medium text-sm transition-colors">
                          <Play className="w-4 h-4" /> Join
                        </Link>
                        
                        <button 
                          onClick={() => handleCopyLink(workspace.roomId)}
                          className="p-2 bg-background hover:bg-muted text-muted-foreground rounded-md border border-border transition-colors group-hover:text-foreground relative"
                          title="Copy Workspace Link"
                        >
                          {copiedId === workspace.roomId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(workspace.roomId)}
                          className="p-2 bg-background hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-md border border-border transition-colors"
                          title="Remove Workspace"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-card-foreground mb-4">Public Profile</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground ml-1">Display Name</label>
                      <input type="text" readOnly defaultValue={user.username} className="p-2.5 rounded-lg bg-input border border-border outline-none text-foreground select-none opacity-80" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                      <input type="email" readOnly defaultValue={user.email} className="p-2.5 rounded-lg bg-input border border-border outline-none text-foreground select-none opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recent" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-foreground mb-8">Recent Activity</h1>
              <div className="bg-card border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
                <Clock className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-card-foreground">No recent activity</h3>
                <p className="text-muted-foreground text-sm max-w-sm mt-1">When you join or edit workspaces, your history will appear here.</p>
              </div>
            </div>
          )}

        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl p-6 w-96 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-card-foreground mb-4">Create New Workspace</h3>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Workspace Name</label>
                <input 
                  type="text" 
                  required
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g. Landing Page Refactor"
                  className="p-2.5 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowCreateModal(false); setNewWorkspaceName(""); }}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-xs font-semibold bg-primary hover:brightness-110 text-primary-foreground rounded-lg transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
