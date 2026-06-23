import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Clock, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import WorkspaceCard from "../components/dashboard/WorkspaceCard";
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workspaces");
  const { user, logout, handleAuthError } = useAuth({ requireAuth: true });

  useEffect(() => {
    if (!user) return;

    const fetchWorkspaces = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/workspaces", {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
        } else if (response.status === 401 || response.status === 400) {
          handleAuthError();
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

    const newRoomId = uuidv4();

    try {
      const response = await fetch("http://localhost:3000/api/workspaces", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          roomId: newRoomId,
          name: newWorkspaceName.trim()
        })
      });

      if (response.ok) {
        navigate(`/${newRoomId}`);
      } else if (response.status === 401 || response.status === 400) {
        handleAuthError();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/workspaces/${roomId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (response.ok) {
        setWorkspaces(prev => prev.filter(w => w.roomId !== roomId));
      } else if (response.status === 401 || response.status === 400) {
        handleAuthError();
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

  const handleRenameWorkspace = async (roomId) => {
    if (!editWorkspaceName.trim()) {
      setEditingRoomId(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/workspaces/${roomId}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: editWorkspaceName.trim() })
      });

      if (response.ok) {
        setWorkspaces(prev => prev.map(w => w.roomId === roomId ? { ...w, name: editWorkspaceName.trim() } : w));
      } else if (response.status === 401 || response.status === 400) {
        handleAuthError();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingRoomId(null);
    }
  };

  const handleSignOut = () => {
    logout();
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
      
      <DashboardSidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleSignOut={handleSignOut} 
      />

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
                    <WorkspaceCard
                      key={idx}
                      workspace={workspace}
                      editingRoomId={editingRoomId}
                      editWorkspaceName={editWorkspaceName}
                      setEditWorkspaceName={setEditWorkspaceName}
                      handleRenameWorkspace={handleRenameWorkspace}
                      setEditingRoomId={setEditingRoomId}
                      formatDate={formatDate}
                      handleCopyLink={handleCopyLink}
                      copiedId={copiedId}
                      handleDelete={handleDelete}
                    />
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

      <CreateWorkspaceModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        handleCreateNew={handleCreateNew}
        newWorkspaceName={newWorkspaceName}
        setNewWorkspaceName={setNewWorkspaceName}
      />
    </div>
  );
}

export default Dashboard;
