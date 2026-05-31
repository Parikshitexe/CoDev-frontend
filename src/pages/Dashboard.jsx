import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Folder, Settings, Clock, LogOut, Plus, Trash2, Copy, Play, Check, ArrowLeft } from "lucide-react";
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

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto">
          
          {activeTab === "workspaces" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-foreground mb-1">Workspaces</h1>
                  <p className="text-sm text-muted-foreground">Your saved collaborative environments</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-2 rounded-md font-medium transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New workspace
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-sm gap-3">
                  <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </div>
              ) : workspaces.length === 0 ? (
                <div className="border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
                  <Folder className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
                  <h3 className="text-sm font-medium text-foreground mb-1">No workspaces yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mb-5">Create a workspace to start collaborating in real time.</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 text-primary hover:underline text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Create one now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workspaces.map((workspace, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors flex flex-col group bg-card">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Code2 className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="font-medium text-foreground text-sm truncate flex-1">{workspace.name}</h3>
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
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-lg">
              <h1 className="text-xl font-semibold text-foreground mb-6">Settings</h1>
              
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-5">
                  <h3 className="text-sm font-medium text-foreground mb-4">Profile</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">Display name</label>
                      <input type="text" readOnly defaultValue={user.username} className="p-2 rounded-md bg-muted border border-border outline-none text-foreground text-sm opacity-70 cursor-not-allowed" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">Email</label>
                      <input type="email" readOnly defaultValue={user.email} className="p-2 rounded-md bg-muted border border-border outline-none text-foreground text-sm opacity-70 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recent" && (
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-6">Recent activity</h1>
              <div className="border border-border rounded-lg p-10 flex flex-col items-center justify-center text-center">
                <Clock className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
                <h3 className="text-sm font-medium text-foreground mb-1">Nothing here yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs">Activity from your workspaces will show up here.</p>
              </div>
            </div>
          )}

        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-5 w-96 shadow-xl">
            <h3 className="text-sm font-semibold text-foreground mb-4">New workspace</h3>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Name</label>
                <input 
                  type="text" 
                  required
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g. Landing page refactor"
                  className="p-2.5 rounded-md bg-input border border-border focus:border-primary outline-none text-foreground text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => { setShowCreateModal(false); setNewWorkspaceName(""); }}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium"
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
