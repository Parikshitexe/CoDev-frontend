export default function CreateWorkspaceModal({
  showCreateModal,
  setShowCreateModal,
  handleCreateNew,
  newWorkspaceName,
  setNewWorkspaceName
}) {
  if (!showCreateModal) return null;

  return (
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
  );
}
