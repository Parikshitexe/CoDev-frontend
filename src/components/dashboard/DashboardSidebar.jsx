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
    <aside className="w-56 bg-[#050505] border-r border-[#1a1a1a] flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1a1a1a]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-[4px] bg-white flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">CoDev</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-3.5 border-b border-[#1a1a1a] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center text-xs font-semibold text-[#737373] shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-white truncate">{user.username}</p>
          <p className="text-[10px] text-[#555] truncate">{user.email}</p>
        </div>
      </div>

      {/* Back to home */}
      <div className="px-2 pt-3">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[#555] hover:text-[#737373] hover:bg-[#0a0a0a] transition-colors text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </button>
        <div className="h-px bg-[#1a1a1a] my-2" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                isActive
                  ? "text-white bg-[#0a0a0a] border border-[#1a1a1a]"
                  : "text-[#555] hover:text-[#737373] hover:bg-[#0a0a0a]"
              }`}
            >
              {/* VS Code-style active left border */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-r-full" />
              )}
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 py-3 border-t border-[#1a1a1a]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[#555] hover:text-[#f78166] hover:bg-[#f78166]/5 transition-colors text-xs font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
