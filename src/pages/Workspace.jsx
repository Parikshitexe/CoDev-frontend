import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { Terminal, Users } from "lucide-react";

function Workspace() {
  const { roomId } = useParams();
  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });

  const [users, setUsers] = useState([]);

  // Shared document
  const ydoc = useMemo(() => new Y.Doc(), []);

  // Shared text
  const yText = useMemo(() => {
    return ydoc.getText("monaco");
  }, [ydoc]);

  // SINGLE provider instance, using the roomId to separate sessions
  const provider = useMemo(() => {
    return new SocketIOProvider(
      "http://localhost:3000",
      roomId, // Connect to the specific room ID
      ydoc,
      {
        autoConnect: true
      }
    );
  }, [ydoc, roomId]);

  // Setup awareness
  useEffect(() => {
    if (!username) return;

    provider.awareness.setLocalStateField("user", {
      name: username
    });

    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const activeUsers = states
        .filter(state => state.user)
        .map(state => state.user);
      setUsers(activeUsers);
    };

    provider.awareness.on("change", updateUsers);
    updateUsers();

    const handleBeforeUnload = () => {
      provider.awareness.setLocalStateField("user", null);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      provider.awareness.off("change", updateUsers);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [provider, username]);

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
    // Keep the roomId in the URL, just add the username query parameter
    window.history.replaceState({}, "", `/${roomId}?username=${enteredUsername}`);
  };

  // Global cleanup
  useEffect(() => {
    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  // Login screen if no username is set yet
  if (!username) {
    return (
      <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
        
        {/* Subtle background gradient matching the theme */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 60%)",
          }}
        />

        <main className="z-10 w-full max-w-md p-8 bg-card border border-border shadow-[0_4px_20px_var(--shadow-color)] rounded-2xl flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border mb-6 shadow-sm">
             <Terminal className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2 text-foreground text-center">Join Workspace</h2>
          <p className="text-muted-foreground text-sm mb-8 text-center truncate w-full px-4">
            Room: {roomId}
          </p>
          
          <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground ml-1">Display Name</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="p-3 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground"
                autoFocus
              />
            </div>
            <button className="mt-2 p-3 rounded-lg bg-primary hover:brightness-110 text-primary-foreground font-bold transition-all shadow-md">
              Enter Room
            </button>
          </form>
        </main>
      </div>
    );
  }

  // Workspace Editor UI
  return (
    <div className="dark h-screen w-full bg-background flex flex-col font-sans overflow-hidden text-foreground">
      
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="text-primary w-5 h-5" />
          <span className="font-bold tracking-wide">
            Code<span className="text-primary">V</span>
          </span>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          Room: <span className="font-mono text-foreground">{roomId}</span>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className="h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
          <div className="p-4 border-b border-sidebar-border bg-sidebar flex items-center gap-2">
            <Users className="w-4 h-4 text-sidebar-primary" />
            <h2 className="text-sm font-bold text-sidebar-foreground uppercase tracking-wider">Active Users ({users.length})</h2>
          </div>
          
          <ul className="p-3 flex-1 overflow-y-auto space-y-2">
            {users.map((user, index) => (
              <li
                key={index}
                className="p-2.5 bg-card border border-border rounded-lg flex items-center gap-3 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm text-foreground truncate">{user.name}</span>
                {user.name === username && (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm ml-auto shrink-0">You</span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor Area */}
        <section className="flex-1 h-full relative bg-[#1e1e1e]">
          {/* Monaco background matches #1e1e1e by default in vs-dark */}
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontFamily: 'var(--font-mono), monospace',
              padding: { top: 24 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              formatOnPaste: true,
            }}
          />
        </section>
      </main>
    </div>
  );
}

export default Workspace;
