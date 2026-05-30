import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { Terminal, Users, Play, MessageSquare, Send } from "lucide-react";

function Workspace() {
  const { roomId } = useParams();
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setUsers] = useState([]);
  
  // Yjs Sync States
  const [language, setLanguage] = useState("javascript");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Shared document
  const ydoc = useMemo(() => new Y.Doc(), []);

  // Yjs Shared Types
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);
  const ySettings = useMemo(() => ydoc.getMap("settings"), [ydoc]);
  const yTerminal = useMemo(() => ydoc.getText("terminal"), [ydoc]);
  const yChat = useMemo(() => ydoc.getArray("chat"), [ydoc]);

  // SINGLE provider instance, using the roomId to separate sessions
  const provider = useMemo(() => {
    return new SocketIOProvider(
      "http://localhost:3000",
      roomId, // Connect to the specific room ID
      ydoc,
      { autoConnect: true }
    );
  }, [ydoc, roomId]);

  // Setup Yjs Observers
  useEffect(() => {
    if (!username) return;

    // 1. Awareness (Users)
    provider.awareness.setLocalStateField("user", { name: username });
    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const activeUsers = states.filter(state => state.user).map(state => state.user);
      setUsers(activeUsers);
    };
    provider.awareness.on("change", updateUsers);
    updateUsers();

    // 2. Settings (Language & Execution Lock)
    const updateSettings = () => {
      const lang = ySettings.get("language") || "javascript";
      const exec = ySettings.get("isExecuting") || false;
      setLanguage(lang);
      setIsExecuting(exec);
    };
    ySettings.observe(updateSettings);
    updateSettings();

    // 3. Terminal Output
    const updateTerminal = () => setTerminalOutput(yTerminal.toString());
    yTerminal.observe(updateTerminal);
    updateTerminal();

    // 4. Chat Messages
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
  }, [provider, username, ySettings, yTerminal, yChat]);

  // Editor mount
  const handleMount = (editor) => {
    editorRef.current = editor;
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

  // Join form
  const handleJoin = (e) => {
    e.preventDefault();
    const enteredUsername = e.target.username.value;
    if (!enteredUsername.trim()) return;
    setUsername(enteredUsername);
    window.history.replaceState({}, "", `/${roomId}?username=${enteredUsername}`);
  };

  // Actions
  const handleLanguageChange = (e) => {
    ySettings.set("language", e.target.value);
  };

  const handleRunCode = async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();
    if (!code.trim()) return;

    ySettings.set("isExecuting", true);
    yTerminal.delete(0, yTerminal.length);
    yTerminal.insert(0, "> Executing code...\n");

    try {
      const response = await fetch("http://localhost:3000/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, language })
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
    if (!chatInput.trim()) return;
    
    yChat.push([{
      sender: username,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setChatInput("");
  };

  // Global cleanup
  useEffect(() => {
    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  // --- LOGIN SCREEN ---
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

  // --- IDE UI ---
  return (
    <div className="dark h-screen w-full bg-background flex flex-col font-sans overflow-hidden text-foreground">
      
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-border pr-6">
            <Terminal className="text-primary w-5 h-5" />
            <span className="font-bold tracking-wide hidden sm:block">Code<span className="text-primary">V</span></span>
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
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-inner shrink-0" title={user.name}>
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
            <div className="bg-card px-4 py-2 border-b border-border flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Terminal className="w-4 h-4" /> Output Terminal
            </div>
            <div className="p-4 overflow-y-auto font-mono text-sm text-green-400 whitespace-pre-wrap flex-1">
              {terminalOutput || <span className="text-gray-600 italic">No output yet. Click 'Run Code' to execute.</span>}
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
