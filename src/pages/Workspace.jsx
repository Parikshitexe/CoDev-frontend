import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { Code2, Users } from "lucide-react";

import WorkspaceHeader from "../components/workspace/WorkspaceHeader";
import ParticipantList from "../components/workspace/ParticipantList";
import TerminalPanel from "../components/workspace/TerminalPanel";
import ChatPanel from "../components/workspace/ChatPanel";

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
  const terminalEndRef = useRef(null);
  const chatEndRef = useRef(null);

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
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  // Advanced Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isChatOpenRef = useRef(isChatOpen);

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (!isChatOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalOutput]);

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
          } else if (response.status === 401 || response.status === 400) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login?expired=true");
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
      } else if (response.status === 401 || response.status === 400) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login?expired=true");
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
      setConnectionStatus("connected");
    };
    const handleConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      if (err.message === "ROOM_FULL") {
        setIsRoomFull(true);
      } else {
        setConnectionStatus("disconnected");
      }
    };
    const handleDisconnect = (reason) => {
      console.warn("Socket disconnected:", reason);
      setConnectionStatus("disconnected");
    };
    const handleReconnectAttempt = () => {
      setConnectionStatus("connecting");
    };

    provider.socket.on("connect", handleConnect);
    provider.socket.on("connect_error", handleConnectError);
    provider.socket.on("disconnect", handleDisconnect);
    provider.socket.on("reconnect_attempt", handleReconnectAttempt);

    if (provider.socket.connected) {
      handleConnect();
    }

    return () => {
      provider.socket.off("connect", handleConnect);
      provider.socket.off("connect_error", handleConnectError);
      provider.socket.off("disconnect", handleDisconnect);
      provider.socket.off("reconnect_attempt", handleReconnectAttempt);
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

    const updateChat = (event) => {
      const messages = yChat.toArray();
      setChatMessages(messages);
      
      // If triggered by a remote change (event exists) and chat is closed
      if (event && !isChatOpenRef.current) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender !== username) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    };
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

    const startTime = performance.now();

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
      const endTime = performance.now();
      const executionTime = ((endTime - startTime) / 1000).toFixed(2);

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
        yTerminal.insert(yTerminal.length, `\n> Executed in ${executionTime}s.\n`);
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
      {connectionStatus === "disconnected" && (
        <div className="bg-destructive/15 border-b border-destructive/20 text-destructive text-[11px] sm:text-xs py-1.5 px-3 flex items-center justify-center font-medium gap-1.5 select-none shrink-0 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping shrink-0" />
          <span>Offline. Changes are saved locally but not syncing. Attempting to reconnect...</span>
        </div>
      )}
      
      <WorkspaceHeader
        roomId={roomId}
        connectionStatus={connectionStatus}
        isLoggedIn={isLoggedIn}
        language={language}
        handleLanguageChange={handleLanguageChange}
        isBookmarked={isBookmarked}
        handleBookmark={handleBookmark}
        handleShareWorkspace={handleShareWorkspace}
        showShareTooltip={showShareTooltip}
        isExecuting={isExecuting}
        handleRunCode={handleRunCode}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        unreadCount={unreadCount}
      />

      <main className="flex-1 flex overflow-hidden relative">
        <ParticipantList users={users} username={username} />

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

          <TerminalPanel
            showCustomInput={showCustomInput}
            setShowCustomInput={setShowCustomInput}
            terminalOutput={terminalOutput}
            terminalEndRef={terminalEndRef}
            customInput={customInput}
            setCustomInput={setCustomInput}
          />
        </section>

        <ChatPanel
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          chatMessages={chatMessages}
          username={username}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          chatEndRef={chatEndRef}
        />
      </main>
    </div>
  );
}

export default Workspace;
