import { Link, useNavigate } from "react-router-dom";
import { Code2, Folder, Settings, Clock, LogOut, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { id: "workspaces", label: "Workspaces", icon: Folder },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar({ user, activeTab, setActiveTab, handleSignOut }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#050505] border-r border-[#1a1a1a] flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a1a1a]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-[5px] bg-white flex items-center justify-center">
            <Code2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">CoDev</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-[#1a1a1a] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] flex items-center justify-center text-sm font-bold text-[#888] shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{user.username}</p>
          <p className="text-[11px] text-[#555] truncate">{user.email}</p>
        </div>
      </div>

      {/* Back to home */}
      <div className="px-3 pt-4">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[#555] hover:text-[#737373] hover:bg-[#0a0a0a] transition-colors text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
        <div className="h-px bg-[#1a1a1a] my-2.5" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? "text-white bg-[#0f0f0f] border border-[#222]"
                  : "text-[#555] hover:text-[#888] hover:bg-[#0a0a0a]"
              }`}
            >
              {/* VS Code-style active left border */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full" />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-[#1a1a1a]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[#555] hover:text-[#f78166] hover:bg-[#f78166]/5 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
