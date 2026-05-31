import { useParams, useNavigate, Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { Code2, Users, Play, MessageSquare, Send } from "lucide-react";

const SERVER_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000"
  : `http://${window.location.hostname}:3000`;

const colors = ["#c4b5fd", "#6ee7b7", "#93c5fd", "#fcd34d", "#fca5a5"];
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
  const navigate = useNavigate();
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
    const cleanUrl = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(cleanUrl);
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
      console.log("Socket connected to room:", roomId);
      setIsRoomFull(false);
    };
    const handleConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      if (err.message === "ROOM_FULL") {
        setIsRoomFull(true);
      }
    };
    const handleDisconnect = (reason) => console.warn("Socket disconnected:", reason);

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
            color: #0d1117;
            font-family: 'Inter', sans-serif;
            font-size: 9px;
            font-weight: 600;
            padding: 1px 5px;
            border-radius: 3px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 10;
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
        <main className="z-10 w-full max-w-sm px-6 text-center">
          <Users className="w-10 h-10 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Room is full</h2>
          <p className="text-muted-foreground text-sm mb-6">
            This workspace is limited to 5 active participants.
          </p>
          <a href="/" className="text-sm text-primary hover:underline">
            Back to home
          </a>
        </main>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
        <main className="z-10 w-full max-w-sm px-6">
          <div className="text-center mb-6">
            <Code2 className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-1 text-foreground">Join workspace</h2>
            <p className="text-muted-foreground text-xs font-mono truncate">{roomId}</p>
          </div>
          <form onSubmit={handleJoin} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Display name</label>
              <input type="text" name="username" placeholder="Your name" className="p-2.5 rounded-md bg-input border border-border focus:border-primary outline-none transition-all text-foreground text-sm" autoFocus />
            </div>
            <button className="p-2.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors text-sm">Join</button>
          </form>
        </main>
      </div>
    );
  }

  if (username && (!ydoc || !provider)) {
    return (
      <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
        <main className="z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Connecting...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dark h-screen w-full bg-background flex flex-col font-sans overflow-hidden text-foreground">
      
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
            <span className="w-1.5 h-1.5 rounded-full bg-chart-2"></span>
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

      <main className="flex-1 flex overflow-hidden">
        
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

        <section className="flex-1 flex flex-col min-w-0">
          
          <div className="flex-[7] bg-[#0d1117] relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              onMount={handleMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                formatOnPaste: true,
                lineHeight: 22,
                letterSpacing: 0.3,
              }}
            />
          </div>

          <div className="flex-[3] bg-sidebar border-t border-border flex flex-col">
            <div className="px-3 py-1.5 border-b border-border flex items-center justify-between text-xs text-muted-foreground select-none shrink-0 bg-card">
              <span className="font-medium">Terminal</span>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                <input 
                  type="checkbox" 
                  checked={showCustomInput} 
                  onChange={(e) => setShowCustomInput(e.target.checked)}
                  className="accent-primary w-3 h-3"
                />
                <span>Stdin</span>
              </label>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-chart-2 whitespace-pre-wrap leading-relaxed">
                {terminalOutput || <span className="text-muted-foreground">No output yet. Click Run to execute.</span>}
              </div>
              
              {showCustomInput && (
                <div className="w-72 border-l border-border bg-sidebar flex flex-col shrink-0">
                  <div className="px-3 py-1.5 border-b border-border text-[10px] text-muted-foreground font-medium select-none shrink-0">
                    Input
                  </div>
                  <textarea 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter input..."
                    className="flex-1 p-2.5 bg-transparent text-xs text-foreground font-mono placeholder:text-muted-foreground/50 resize-none outline-none border-none"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="w-64 bg-sidebar border-l border-sidebar-border flex flex-col shrink-0 hidden lg:flex">
          <div className="px-3 py-2.5 border-b border-sidebar-border flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Chat</span>
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
          </div>

          <div className="p-2.5 border-t border-sidebar-border">
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

      </main>
    </div>
  );
}

export default Workspace;
