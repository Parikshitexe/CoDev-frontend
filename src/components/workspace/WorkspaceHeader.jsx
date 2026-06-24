import { Code2, Play, MessageSquare, Share2, BookmarkPlus, ChevronRight } from "lucide-react";
import LanguageIcon from "../icons/LanguageIcon";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkspaceHeader({
  roomId,
  roomName,
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
    <header className="h-12 glass-header flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border-r border-[#1a1a1a] pr-4">
          <Button 
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent px-2 h-8"
          >
            <div className="w-5 h-5 rounded-[3px] bg-white flex items-center justify-center">
              <Code2 className="w-3 h-3 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight text-sm hidden sm:block text-white">CoDev</span>
          </Button>
          {isLoggedIn && (
            <Button
              variant="link"
              onClick={() => navigate("/dashboard")}
              className="text-xs text-[#555] hover:text-[#737373] transition-colors px-2 h-8"
            >
              Dashboard
            </Button>
          )}
        </div>
        {/* Breadcrumb: CoDev / workspace-name */}
        {roomName && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#737373]">
            <ChevronRight className="w-3 h-3 text-[#333]" />
            <span className="font-medium text-[#555] truncate max-w-[160px]">{roomName}</span>
          </div>
        )}
        <Select value={language} onValueChange={(val) => handleLanguageChange({ target: { value: val } })}>
          <SelectTrigger className="w-[130px] h-8 text-xs font-medium bg-[#050505] border-[#1a1a1a] hover:bg-[#111] transition-colors text-white">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-[#050505] border-[#1a1a1a] text-white">
            <SelectItem value="javascript">
              <div className="flex items-center gap-2">
                <LanguageIcon language="javascript" className="w-3.5 h-3.5" />
                JavaScript
              </div>
            </SelectItem>
            <SelectItem value="python">
              <div className="flex items-center gap-2">
                <LanguageIcon language="python" className="w-3.5 h-3.5" />
                Python
              </div>
            </SelectItem>
            <SelectItem value="cpp">
              <div className="flex items-center gap-2">
                <LanguageIcon language="cpp" className="w-3.5 h-3.5" />
                C++
              </div>
            </SelectItem>
            <SelectItem value="java">
              <div className="flex items-center gap-2">
                <LanguageIcon language="java" className="w-3.5 h-3.5" />
                Java
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1.5 px-2 py-1 border border-border rounded-md">
          <span className={`w-1.5 h-1.5 rounded-full ${
            connectionStatus === "connected" ? "bg-chart-2" :
            connectionStatus === "connecting" ? "bg-chart-3 animate-pulse" : "bg-destructive animate-ping"
          }`}></span>
          <span className="font-medium">
            {connectionStatus === "connected" ? "Connected" : 
             connectionStatus === "connecting" ? "Connecting..." : "Disconnected"}
          </span>
        </div>
        
        {isLoggedIn && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            disabled={isBookmarked}
            className={`h-8 px-3 text-xs ${isBookmarked ? "text-muted-foreground" : "text-primary border-primary/30 hover:bg-primary/10"}`}
          >
            <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        )}

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareWorkspace}
            className="h-8 px-3 text-xs text-muted-foreground"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share
          </Button>
          {showShareTooltip && (
            <div className="absolute right-0 top-10 bg-card text-foreground text-[10px] font-medium px-2 py-1 rounded border border-border shadow-sm whitespace-nowrap">
              Copied!
            </div>
          )}
        </div>

        {/* Phase 2: Chat Toggle */}
        <Button
          variant={isChatOpen ? "secondary" : "outline"}
          size="sm"
          onClick={toggleChat}
          className="relative h-8 px-3 text-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          <span className="hidden sm:inline">Chat</span>
          {!isChatOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        <Button 
          id="run-code-btn"
          title="Ctrl+Enter (or Cmd+Enter) to run"
          size="sm"
          onClick={handleRunCode}
          disabled={isExecuting}
          className={`h-8 px-4 text-xs font-medium ${isExecuting ? "" : "bg-[#238636] hover:bg-[#2ea043] text-white"}`}
        >
          {isExecuting ? (
            <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full mr-1.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current mr-1.5" />
          )}
          <div className="flex flex-col items-start justify-center leading-none mt-px">
            <span>{isExecuting ? "Running" : "Run"}</span>
            {!isExecuting && (
              <span className="hidden sm:block text-[8px] opacity-60 font-mono mt-[3px]">
                Ctrl+Enter
              </span>
            )}
          </div>
        </Button>
      </div>
    </header>
  );
}
