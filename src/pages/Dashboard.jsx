import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { 
  Code2, 
  Terminal, 
  LogOut, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  ExternalLink,
  MoreVertical,
  Check,
  Edit2,
  Folder,
  Clock
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import ConfirmModal from "../components/dashboard/ConfirmModal";
import { toast } from "sonner";
import WorkspaceCard from "../components/dashboard/WorkspaceCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workspaces");
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({ isOpen: false, roomId: null });
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
          setWorkspaces(Array.isArray(data) ? data : []);
        } else if (response.status === 401) {
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
    const trimmedName = newWorkspaceName.trim();
    if (!trimmedName) return;

    if (workspaces?.some(w => w?.name?.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("A workspace with this name already exists. Please choose a unique name.");
      return;
    }

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
          name: trimmedName
        })
      });

      if (response.ok) {
        navigate(`/${newRoomId}`);
      } else if (response.status === 401) {
        handleAuthError();
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData?.error || "Bad request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = (roomId) => {
    setDeleteModalData({ isOpen: true, roomId });
  };

  const handleDelete = async () => {
    const roomId = deleteModalData.roomId;
    if (!roomId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/workspaces/${roomId}`, {
        method: "DELETE",
        credentials: 'include'
      });

      if (response.ok) {
        setWorkspaces(prev => prev.filter(w => w.roomId !== roomId));
        toast.success("Workspace deleted successfully");
      } else if (response.status === 401) {
        handleAuthError();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete workspace");
    } finally {
      setDeleteModalData({ isOpen: false, roomId: null });
    }
  };

  const handleCopyLink = (roomId) => {
    const link = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(roomId);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRenameWorkspace = async (roomId) => {
    const trimmedName = editWorkspaceName.trim();
    if (!trimmedName) {
      setEditingRoomId(null);
      return;
    }

    if (workspaces.some(w => w.roomId !== roomId && w.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error("A workspace with this name already exists.");
      // Don't reset editingRoomId here so they can fix the name
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/workspaces/${roomId}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: trimmedName })
      });

      if (response.ok) {
        setWorkspaces(prev => prev?.map(w => w?.roomId === roomId ? { ...w, name: trimmedName } : w) ?? []);
      } else if (response.status === 401) {
        handleAuthError();
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData?.error || "Bad request");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEditingRoomId(null);
    }
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dark min-h-screen w-full bg-black flex font-sans text-foreground overflow-hidden"
    >
      
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
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New workspace
                </Button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-sm gap-3">
                  <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </div>
              ) : workspaces?.length === 0 ? (
                <div className="border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
                  <Folder className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
                  <h3 className="text-sm font-medium text-foreground mb-1">No workspaces yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mb-5">Create a workspace to start collaborating in real time.</p>
                  <Button 
                    variant="link"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create one now
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workspaces?.map((workspace, idx) => (
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
                      handleDelete={confirmDelete}
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
                      <Input type="text" readOnly defaultValue={user?.username} className="opacity-70 cursor-not-allowed" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-muted-foreground">Email</label>
                      <Input type="email" readOnly defaultValue={user?.email} className="opacity-70 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recent" && (
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-6">Recent activity</h1>
              {workspaces?.length === 0 ? (
                <div className="border border-border rounded-lg p-10 flex flex-col items-center justify-center text-center">
                  <Clock className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
                  <h3 className="text-sm font-medium text-foreground mb-1">Nothing here yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">Activity from your workspaces will show up here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workspaces?.slice(0, 6).map((workspace, idx) => (
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
                      handleDelete={confirmDelete}
                    />
                  ))}
                </div>
              )}
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

      <ConfirmModal
        isOpen={showLogoutModal}
        setIsOpen={setShowLogoutModal}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        variant="destructive"
        onConfirm={() => logout()}
      />

      <ConfirmModal
        isOpen={deleteModalData.isOpen}
        setIsOpen={(isOpen) => setDeleteModalData(prev => ({ ...prev, isOpen }))}
        title="Delete Workspace"
        description="Are you sure you want to delete this workspace? This action cannot be undone and you will lose access to it."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}

export default Dashboard;
