import { useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [chatInput]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.trim()) {
        handleSendMessage(e);
      }
    }
  };

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
        className={`fixed sm:static top-0 right-0 h-full w-72 sm:w-80 glass-panel border-l border-sidebar-border flex flex-col shrink-0 z-30 transition-transform duration-300 ease-in-out
          ${isChatOpen ? "translate-x-0" : "translate-x-full hidden"}`}
        style={{ display: isChatOpen ? 'flex' : 'none' }}
      >
        <div className="px-3 py-2.5 border-b border-sidebar-border/50 flex items-center justify-between bg-card/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-xs text-foreground font-semibold uppercase tracking-wider">Room Chat</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleChat} className="h-6 w-6 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
        
        <div className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-2.5">
          {chatMessages.length === 0 ? (
            <p className="text-center text-muted-foreground text-xs mt-10">No messages yet</p>
          ) : (
            chatMessages.map((msg, idx) => {
              if (msg.type === "system") {
                return (
                  <div key={idx} className="flex justify-center my-1">
                    <span className="text-[10px] text-muted-foreground/70 italic bg-card/50 px-2 py-0.5 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.sender === username;
              const prevMsg = chatMessages[idx - 1];
              const showHeader = !prevMsg || prevMsg.type === "system" || prevMsg.sender !== msg.sender || prevMsg.time !== msg.time;

              return (
                <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${!showHeader ? 'mt-0' : 'mt-1.5'}`}>
                  {showHeader && <span className="text-[10px] text-muted-foreground/60 mb-0.5">{msg.sender} · {msg.time}</span>}
                  <div className={`px-3 py-2 rounded-xl text-xs max-w-[85%] break-words whitespace-pre-wrap shadow-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border text-foreground rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 border-t border-sidebar-border/50 bg-card/40 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            <textarea 
              ref={textareaRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message..." 
              className="flex-1 bg-input/50 backdrop-blur-sm border border-border/50 rounded-xl px-3 py-2 text-xs text-foreground focus:border-primary/50 focus:bg-input transition-all outline-none resize-none overflow-hidden min-h-[36px]"
              rows={1}
            />
            <Button type="submit" size="icon" disabled={!chatInput.trim()} className="h-9 w-9 rounded-xl shrink-0">
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
