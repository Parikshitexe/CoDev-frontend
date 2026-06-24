import { Users } from "lucide-react";

export default function ParticipantList({ users, username }) {
  return (
    <aside className="w-16 md:w-56 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-sidebar-border flex items-center justify-center md:justify-start gap-2.5">
        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest hidden md:block">
          Participants ({users.length})
        </span>
      </div>

      {/* User list */}
      <ul className="p-2 flex-1 overflow-y-auto space-y-0.5">
        {users.map((user, index) => (
          <li
            key={index}
            className="px-2.5 py-2.5 rounded-md flex items-center justify-center md:justify-start gap-3 hover:bg-sidebar-accent transition-colors"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: user.color + "25", color: user.color, border: `1px solid ${user.color}40` }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + you badge */}
            <div className="min-w-0 flex-1 hidden md:flex items-center gap-2">
              <span className="text-sm text-sidebar-foreground truncate">{user.name}</span>
              {user.name === username && (
                <span className="text-[10px] text-muted-foreground bg-sidebar-accent px-1.5 py-0.5 rounded shrink-0">
                  you
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
