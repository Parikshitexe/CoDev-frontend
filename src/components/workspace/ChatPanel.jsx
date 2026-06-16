import { MessageSquare, Send, X } from "lucide-react";

export default function ChatPanel({
  isChatOpen,
  toggleChat,
  chatMessages,
  username,
  chatInput,
  setChatInput,
  handleSendMessage,
  chatEndRef
}) {
  return (
    <>
      {/* Mobile Overlay Background */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 sm:hidden"
          onClick={toggleChat}
        />
      )}

      <aside 
        className={`fixed sm:static top-0 right-0 h-full w-72 sm:w-80 bg-sidebar border-l border-sidebar-border flex flex-col shrink-0 z-30 transition-transform duration-300 ease-in-out
          ${isChatOpen ? "translate-x-0" : "translate-x-full hidden"}`}
        style={{ display: isChatOpen ? 'flex' : 'none' }}
      >
        <div className="px-3 py-2.5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Room Chat</span>
          </div>
          <button onClick={toggleChat} className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-2.5">
          {chatMessages.length === 0 ? (
            <p className="text-center text-muted-foreground text-xs mt-10">No messages yet</p>
          ) : (
            chatMessages.map((msg, idx) => {
              const isMe = msg.sender === username;
              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-muted-foreground mb-0.5">{msg.sender} · {msg.time}</span>
                  <div className={`px-2.5 py-1.5 rounded-md text-xs max-w-[85%] break-words ${isMe ? 'bg-primary/15 text-foreground' : 'bg-card border border-border text-foreground'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-2.5 border-t border-sidebar-border bg-sidebar">
          <form onSubmit={handleSendMessage} className="flex gap-1.5">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message..." 
              className="flex-1 bg-input border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground focus:border-primary outline-none"
            />
            <button type="submit" disabled={!chatInput.trim()} className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
