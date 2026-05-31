import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { Terminal, Users, Play, MessageSquare, Send } from "lucide-react";

const SERVER_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000"
  : `http://${window.location.hostname}:3000`;

const colors = ["#f97316", "#e11d48", "#2563eb", "#16a34a", "#9333ea"];
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

function Workspace() {
  const { roomId } = useParams();
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    const urlName = new URLSearchParams(window.location.search).get("username");
    if (urlName) return urlName;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.username) {
          return parsed.username;
        }
      } catch (err) {
        // Fallback
      }
    }
    return "";
  });

  const [users, setUsers] = useState([]);
  
  // Yjs Sync States
  const [language, setLanguage] = useState("javascript");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);

  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);

  const yText = useMemo(() => ydoc ? ydoc.getText("monaco") : null, [ydoc]);
  const ySettings = useMemo(() => ydoc ? ydoc.getMap("settings") : null, [ydoc]);
  const yTerminal = useMemo(() => ydoc ? ydoc.getText("terminal") : null, [ydoc]);
  const yChat = useMemo(() => ydoc ? ydoc.getArray("chat") : null, [ydoc]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const checkBookmark = async () => {
        try {
          const response = await fetch(`${SERVER_URL}/api/workspaces/${roomId}/status`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setIsBookmarked(data.bookmarked);
          }
        } catch (err) {
          console.error(err);
        }
      };
      checkBookmark();
    }
  }, [roomId]);

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${SERVER_URL}/api/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId,
          name: `Workspace ${roomId.slice(0, 6)}`
        })
      });
      if (response.ok) {
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareWorkspace = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  useEffect(() => {
    if (!username) return;

    const doc = new Y.Doc();
    const prov = new SocketIOProvider(
      SERVER_URL,
      roomId,
      doc,
      {
        autoConnect: true,
        transports: ["websocket"]
      }
    );

    setYdoc(doc);
    setProvider(prov);

    return () => {
      prov.disconnect();
      doc.destroy();
      setYdoc(null);
      setProvider(null);
    };
  }, [username, roomId]);

  useEffect(() => {
    if (!provider) return;

    const handleConnect = () => {
      console.log("⚡ Socket connected successfully to room:", roomId);
      setIsRoomFull(false);
    };
    const handleConnectError = (err) => {
      console.error("❌ Socket connection error:", err.message);
      if (err.message === "ROOM_FULL") {
        setIsRoomFull(true);
      }
    };
    const handleDisconnect = (reason) => console.warn("⚠️ Socket disconnected:", reason);

    provider.socket.on("connect", handleConnect);
    provider.socket.on("connect_error", handleConnectError);
    provider.socket.on("disconnect", handleDisconnect);

    if (provider.socket.connected) {
      handleConnect();
    }

    return () => {
      provider.socket.off("connect", handleConnect);
      provider.socket.off("connect_error", handleConnectError);
      provider.socket.off("disconnect", handleDisconnect);
    };
  }, [provider, roomId]);

  useEffect(() => {
    if (!ydoc || !provider || !username || !ySettings || !yTerminal || !yChat) return;

    const userColor = stringToColor(username);
    provider.awareness.setLocalStateField("user", { name: username, color: userColor });
    
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates());
      const sortedStates = states.filter(([_, s]) => s.user && s.user.name).sort((a, b) => a[0] - b[0]);
      
      const seen = new Set();
      const activeUsers = [];
      sortedStates.forEach(([clientId, state], index) => {
        if (!seen.has(state.user.name)) {
          seen.add(state.user.name);
          const color = colors[index % colors.length];
          activeUsers.push({
            name: state.user.name,
            color: color
          });
        }
      });
      setUsers(activeUsers);

      sortedStates.forEach(([clientId, state], index) => {
        const color = colors[index % colors.length];
        const name = state.user.name;
        const styleId = `yjs-cursor-style-${clientId}`;
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
          styleEl = document.createElement("style");
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }
        styleEl.innerText = `
          .yRemoteSelection-${clientId} {
            background-color: ${color}2B;
          }
          .yRemoteSelectionHead-${clientId} {
            position: absolute;
            border-left: 2px solid ${color};
            border-top: 2px solid ${color};
            border-bottom: 2px solid ${color};
            height: 100%;
            box-sizing: border-box;
          }
          .yRemoteSelectionHead-${clientId}::after {
            content: '${name}';
            position: absolute;
            top: -14px;
            left: -2px;
            background-color: ${color};
            color: white;
            font-family: sans-serif;
            font-size: 8px;
            font-weight: bold;
            padding: 0 4px;
            border-radius: 2px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 10;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
        `;
      });

      const activeClientIds = new Set(sortedStates.map(([clientId]) => clientId));
      const styleElements = document.querySelectorAll("[id^='yjs-cursor-style-']");
      styleElements.forEach(el => {
        const id = parseInt(el.id.replace("yjs-cursor-style-", ""));
        if (!activeClientIds.has(id)) {
          el.remove();
        }
      });
    };
    provider.awareness.on("change", updateUsers);
    updateUsers();

    const updateSettings = () => {
      const lang = ySettings.get("language") || "javascript";
      const exec = ySettings.get("isExecuting") || false;
      setLanguage(lang);
      setIsExecuting(exec);
    };
    ySettings.observe(updateSettings);
    updateSettings();

    const updateTerminal = () => setTerminalOutput(yTerminal.toString());
    yTerminal.observe(updateTerminal);
    updateTerminal();

    const updateChat = () => setChatMessages(yChat.toArray());
    yChat.observe(updateChat);
    updateChat();

    const handleBeforeUnload = () => provider.awareness.setLocalStateField("user", null);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      provider.awareness.off("change", updateUsers);
      ySettings.unobserve(updateSettings);
      yTerminal.unobserve(updateTerminal);
      yChat.unobserve(updateChat);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [provider, ydoc, username, ySettings, yTerminal, yChat]);

  const handleMount = (editor) => {
    editorRef.current = editor;
    if (!yText || !provider) return;

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    editor.onDidDispose(() => {
      binding.destroy();
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const enteredUsername = e.target.username.value;
    if (!enteredUsername.trim()) return;
    setUsername(enteredUsername);
    window.history.replaceState({}, "", `/${roomId}?username=${enteredUsername}`);
  };

  const handleLanguageChange = (e) => {
    if (!ySettings) return;
    ySettings.set("language", e.target.value);
  };

  const handleRunCode = async () => {
    if (!editorRef.current || !ySettings || !yTerminal) return;

    const code = editorRef.current.getValue();
    if (!code.trim()) return;

    ySettings.set("isExecuting", true);
    yTerminal.delete(0, yTerminal.length);
    yTerminal.insert(0, "> Executing code...\n");

    try {
      const response = await fetch(`${SERVER_URL}/api/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          code, 
          language,
          input: showCustomInput ? customInput : "" 
        })
      });

      const data = await response.json();

      yTerminal.delete(0, yTerminal.length);

      if (!response.ok) {
        yTerminal.insert(0, `> Error: ${data.error || "Execution failed"}\n`);
      } else {
        if (data.stdout) {
          yTerminal.insert(0, data.stdout);
        }
        if (data.stderr) {
          yTerminal.insert(yTerminal.length, data.stderr);
        }
        if (!data.stdout && !data.stderr) {
          yTerminal.insert(0, "> Program completed with no output.\n");
        }
      }
    } catch (err) {
      yTerminal.delete(0, yTerminal.length);
      yTerminal.insert(0, `> Error: ${err.message || "Could not connect to execution server."}\n`);
    } finally {
      ySettings.set("isExecuting", false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !yChat) return;
    
    yChat.push([{
      sender: username,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setChatInput("");
  };

  if (isRoomFull) {
    return (
      <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)" }} />
        <main className="z-10 w-full max-w-md p-8 bg-card border border-border shadow-xl rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-red-950/40 text-red-500 rounded-2xl flex items-center justify-center border border-red-900/50 mb-6 shadow-sm">
             <Users className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-foreground text-center">Room is Full</h2>
          <p className="text-muted-foreground text-sm mb-8 text-center px-4">
            This collaborative workspace is limited to 5 active members to ensure peak real-time performance.
          </p>
          <a href="/dashboard" className="w-full text-center p-3 rounded-lg bg-primary hover:brightness-110 text-primary-foreground font-bold transition-all shadow-md">
            Back to Dashboard
          </a>
        </main>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)" }} />
        <main className="z-10 w-full max-w-md p-8 bg-card border border-border shadow-xl rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border mb-6 shadow-sm">
             <Terminal className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-foreground text-center">Join Workspace</h2>
          <p className="text-muted-foreground text-sm mb-8 text-center truncate w-full px-4">Room: {roomId}</p>
          <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground ml-1">Display Name</label>
              <input type="text" name="username" placeholder="Enter your username" className="p-3 rounded-lg bg-input border border-border focus:border-ring outline-none transition-all text-foreground" autoFocus />
            </div>
            <button className="mt-2 p-3 rounded-lg bg-primary hover:brightness-110 text-primary-foreground font-bold transition-all shadow-md">Enter Room</button>
          </form>
        </main>
      </div>
    );
  }

  if (username && (!ydoc || !provider)) {
    return (
      <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)" }} />
        <main className="z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm font-semibold tracking-wide">Connecting to room namespace...</p>
        </main>
      </div>
    );
  }

  // --- IDE UI ---
  return (
    <div className="dark h-screen w-full bg-background flex flex-col font-sans overflow-hidden text-foreground">
      
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-border pr-6">
            <button 
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none outline-none cursor-pointer text-foreground"
            >
              <Terminal className="text-primary w-5 h-5" />
              <span className="font-bold tracking-wide hidden sm:block">Code<span className="text-primary">V</span></span>
            </button>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-muted px-2.5 py-1 rounded-md border border-border cursor-pointer"
              >
                Dashboard
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-input border border-border text-foreground text-sm rounded-md px-3 py-1.5 focus:border-ring outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Room: <span className="font-mono text-foreground">{roomId}</span>
          </div>
          
          {isLoggedIn && (
            <button
              onClick={handleBookmark}
              disabled={isBookmarked}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-bold text-sm border transition-all
                ${isBookmarked
                  ? "bg-transparent text-primary border-primary/20 cursor-default"
                  : "bg-primary hover:brightness-110 text-primary-foreground border-transparent shadow-[0_0_10px_rgba(249,115,22,0.3)]"}`}
            >
              ⭐ {isBookmarked ? "Saved" : "Save to Dashboard"}
            </button>
          )}

          <div className="relative">
            <button
              onClick={handleShareWorkspace}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md font-bold text-sm border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              Share
            </button>
            {showShareTooltip && (
              <div className="absolute right-0 top-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md select-none animate-in fade-in slide-in-from-top-2 duration-150 shrink-0 whitespace-nowrap">
                Link Copied!
              </div>
            )}
          </div>

          <button 
            onClick={handleRunCode}
            disabled={isExecuting}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-md font-bold text-sm transition-all shadow-sm
              ${isExecuting 
                ? "bg-muted text-muted-foreground cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_10px_rgba(22,163,74,0.3)]"}`}
          >
            {isExecuting ? (
              <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isExecuting ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Users */}
        <aside className="w-16 md:w-56 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all">
          <div className="p-4 border-b border-sidebar-border bg-sidebar flex items-center justify-center md:justify-start gap-2">
            <Users className="w-5 h-5 text-sidebar-primary" />
            <h2 className="text-sm font-bold text-sidebar-foreground uppercase tracking-wider hidden md:block">Users ({users.length})</h2>
          </div>
          <ul className="p-2 md:p-3 flex-1 overflow-y-auto space-y-2">
            {users.map((user, index) => (
              <li key={index} className="p-2 md:p-2.5 bg-card border border-border rounded-lg flex items-center justify-center md:justify-start gap-3 shadow-sm hover:border-primary/50 transition-colors">
                <div 
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0" 
                  style={{ backgroundColor: user.color || "#f97316" }}
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm text-foreground truncate hidden md:block">{user.name}</span>
                {user.name === username && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm ml-auto shrink-0 hidden md:block">You</span>}
              </li>
            ))}
          </ul>
        </aside>

        {/* Center - Editor & Terminal */}
        <section className="flex-1 flex flex-col min-w-0">
          
          {/* Editor Area (Top 70%) */}
          <div className="flex-[7] bg-[#1e1e1e] relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              onMount={handleMount}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                fontFamily: 'var(--font-mono), monospace',
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Terminal Area (Bottom 30%) */}
          <div className="flex-[3] bg-black border-t-2 border-border flex flex-col">
            <div className="bg-card px-4 py-2 border-b border-border flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider select-none shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Output Terminal
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                <input 
                  type="checkbox" 
                  checked={showCustomInput} 
                  onChange={(e) => setShowCustomInput(e.target.checked)}
                  className="accent-primary w-3 h-3 rounded bg-input border border-border"
                />
                Custom Input
              </label>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
                {terminalOutput || <span className="text-gray-600 italic">No output yet. Click 'Run Code' to execute.</span>}
              </div>
              
              {showCustomInput && (
                <div className="w-80 border-l border-border bg-[#121212] flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-300">
                  <div className="px-4 py-1.5 border-b border-border bg-card text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none shrink-0">
                    Input Stdin
                  </div>
                  <textarea 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter inputs here (one per line)..."
                    className="flex-1 p-3 bg-transparent text-sm text-foreground font-mono placeholder:text-gray-600 resize-none outline-none border-none"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Sidebar - Chat */}
        <aside className="w-72 bg-sidebar border-l border-sidebar-border flex flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-sidebar-border bg-sidebar flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sidebar-primary" />
            <h2 className="text-sm font-bold text-sidebar-foreground uppercase tracking-wider">Room Chat</h2>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {chatMessages.length === 0 ? (
              <p className="text-center text-muted-foreground text-xs italic mt-10">Start the conversation...</p>
            ) : (
              chatMessages.map((msg, idx) => {
                const isMe = msg.sender === username;
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-muted-foreground mb-1 ml-1">{msg.sender} • {msg.time}</span>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] break-words ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border border-border text-foreground rounded-bl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-card border-t border-sidebar-border">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-ring outline-none"
              />
              <button type="submit" disabled={!chatInput.trim()} className="p-2 bg-primary hover:brightness-110 text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </aside>

      </main>
    </div>
  );
}

export default Workspace;
