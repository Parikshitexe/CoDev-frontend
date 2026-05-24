import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

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
      <main className="h-screen w-full bg-gray-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-6 text-amber-500">Join Room: {roomId}</h2>
        <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500 focus:outline-none transition-colors"
            autoFocus
          />
          <button className="p-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors">
            Enter Workspace
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-900 flex gap-4 p-4 text-white">
      <aside className="h-full w-1/4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-bold text-amber-500">Active Users</h2>
          <p className="text-xs text-gray-400 mt-1 truncate">Room: {roomId}</p>
        </div>
        <ul className="p-4 flex-1 overflow-y-auto space-y-2">
          {users.map((user, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      <section className="w-3/4 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            padding: { top: 16 }
          }}
        />
      </section>
    </main>
  );
}

export default Workspace;
