import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Folder, Settings, Clock, LogOut, Plus, Trash2, Copy, Play } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workspaces");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleCreateNew = () => {
    const newRoomId = uuidv4();
    navigate(`/${newRoomId}`);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return null;
  }

  const mockWorkspaces = [
    { id: "e8f3a1-9b2c", language: "JavaScript", date: "2 hours ago" },
    { id: "b47c92-1a5d", language: "Python", date: "Yesterday" },
    { id: "f1a9b8-3c4e", language: "C++", date: "May 20, 2026" },
  ];

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
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 bg-primary hover:brightness-110 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <Plus className="w-5 h-5" />
                  New Workspace
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockWorkspaces.map((workspace, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-xl p-5 shadow-[0_2px_10px_var(--shadow-color)] hover:border-primary/50 transition-colors flex flex-col group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                        <Terminal className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
                        {workspace.language}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-card-foreground text-lg mb-1 truncate">Room: {workspace.id}</h3>
                    <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Created {workspace.date}
                    </p>

                    <div className="mt-auto pt-4 border-t border-border flex items-center gap-2">
                      <Link to={`/${workspace.id}`} className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground py-2 rounded-md font-medium text-sm transition-colors">
                        <Play className="w-4 h-4" /> Join
                      </Link>
                      <button className="p-2 bg-background hover:bg-muted text-muted-foreground rounded-md border border-border transition-colors group-hover:text-foreground">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-background hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-md border border-border transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                      <input type="text" defaultValue={user.username} className="p-2.5 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 outline-none text-foreground" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                      <input type="email" defaultValue={user.email} className="p-2.5 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 outline-none text-foreground" />
                    </div>
                    <button className="mt-2 bg-primary hover:brightness-110 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors w-max">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-card-foreground mb-4">Security</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground ml-1">New Password</label>
                      <input type="password" placeholder="••••••••" className="p-2.5 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 outline-none text-foreground" />
                    </div>
                    <button className="mt-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors w-max border border-border">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-destructive/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
                  <h3 className="text-lg font-bold text-destructive mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg font-medium transition-colors w-max">
                    Delete Account
                  </button>
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

    </div>
  );
}

export default Dashboard;
