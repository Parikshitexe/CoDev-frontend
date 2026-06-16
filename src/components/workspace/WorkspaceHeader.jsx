import { Code2, Play, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkspaceHeader({
  roomId,
  connectionStatus,
  isLoggedIn,
  language,
  handleLanguageChange,
  isBookmarked,
  handleBookmark,
  handleShareWorkspace,
  showShareTooltip,
  isExecuting,
  handleRunCode,
  isChatOpen,
  toggleChat,
  unreadCount
}) {
  const navigate = useNavigate();

  return (
    <header className="h-12 border-b border-border bg-card flex items-center justify-between px-3 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border-r border-border pr-4">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none outline-none cursor-pointer text-foreground"
          >
            <Code2 className="text-primary w-4 h-4" />
            <span className="font-semibold tracking-tight text-sm hidden sm:block">CoDev</span>
          </button>
          {isLoggedIn && (
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none outline-none"
            >
              Dashboard
            </button>
          )}
        </div>
        <select 
          value={language}
          onChange={handleLanguageChange}
          className="bg-input border border-border text-foreground text-xs rounded-md px-2 py-1 focus:border-primary outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1.5 px-2 py-1 border border-border rounded-md">
          <span className={`w-1.5 h-1.5 rounded-full ${
            connectionStatus === "connected" ? "bg-chart-2" :
            connectionStatus === "connecting" ? "bg-chart-3 animate-pulse" : "bg-destructive animate-ping"
          }`}></span>
          <span className="font-mono">{roomId.slice(0, 8)}</span>
        </div>
        
        {isLoggedIn && (
          <button
            onClick={handleBookmark}
            disabled={isBookmarked}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors
              ${isBookmarked
                ? "text-muted-foreground border-border cursor-default"
                : "text-primary border-primary/30 hover:bg-primary/10"}`}
          >
            {isBookmarked ? "Saved" : "Save"}
          </button>
        )}

        <div className="relative">
          <button
            onClick={handleShareWorkspace}
            className="flex items-center px-2.5 py-1 rounded-md text-xs border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Share
          </button>
          {showShareTooltip && (
            <div className="absolute right-0 top-8 bg-card text-foreground text-[10px] font-medium px-2 py-1 rounded border border-border shadow-sm whitespace-nowrap">
              Copied!
            </div>
          )}
        </div>

        {/* Phase 2: Chat Toggle */}
        <button
          onClick={toggleChat}
          className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors
            ${isChatOpen ? "bg-muted text-foreground border-border" : "text-muted-foreground border-border hover:bg-muted"}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Chat</span>
          {!isChatOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white shadow-sm ring-1 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button 
          onClick={handleRunCode}
          disabled={isExecuting}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors
            ${isExecuting 
              ? "bg-muted text-muted-foreground cursor-not-allowed" 
              : "bg-[#238636] hover:bg-[#2ea043] text-white"}`}
        >
          {isExecuting ? (
            <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Play className="w-3 h-3 fill-current" />
          )}
          {isExecuting ? "Running" : "Run"}
        </button>
      </div>
    </header>
  );
}
