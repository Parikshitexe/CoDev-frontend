import { Users } from "lucide-react";

export default function ParticipantList({ users, username }) {
  return (
    <aside className="w-14 md:w-48 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all">
      <div className="px-3 py-2.5 border-b border-sidebar-border flex items-center justify-center md:justify-start gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium hidden md:block">Participants ({users.length})</span>
      </div>
      <ul className="p-1.5 md:p-2 flex-1 overflow-y-auto space-y-1">
        {users.map((user, index) => (
          <li key={index} className="px-2 py-1.5 rounded-md flex items-center justify-center md:justify-start gap-2.5 hover:bg-sidebar-accent transition-colors">
            <div 
              className="w-6 h-6 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0" 
              style={{ backgroundColor: user.color + "30", color: user.color }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-sidebar-foreground truncate hidden md:block">{user.name}</span>
            {user.name === username && <span className="text-[9px] text-muted-foreground ml-auto shrink-0 hidden md:block">you</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
