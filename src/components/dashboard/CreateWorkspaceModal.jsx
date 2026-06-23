import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreateWorkspaceModal({
  showCreateModal,
  setShowCreateModal,
  handleCreateNew,
  newWorkspaceName,
  setNewWorkspaceName
}) {
  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateNew} className="space-y-4 pt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <Input 
              type="text" 
              required
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="e.g. Landing page refactor"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => { setShowCreateModal(false); setNewWorkspaceName(""); }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
