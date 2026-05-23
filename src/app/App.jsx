import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {

  const editorRef = useRef(null);

  const [username, setUsername] = useState(() => {
    return (
      new URLSearchParams(window.location.search)
        .get("username") || ""
    );
  });

  const [users, setUsers] = useState([]);

  // Shared document
  const ydoc = useMemo(() => new Y.Doc(), []);

  // Shared text
  const yText = useMemo(() => {
    return ydoc.getText("monaco");
  }, [ydoc]);

  // SINGLE provider instance
  const provider = useMemo(() => {

    return new SocketIOProvider(
      "http://localhost:3000",
      "monaco-demo",
      ydoc,
      {
        autoConnect: true
      }
    );

  }, [ydoc]);

  // Setup awareness
  useEffect(() => {

    if (!username) return;

    provider.awareness.setLocalStateField("user", {
      name: username
    });

    const updateUsers = () => {

      const states = Array.from(
        provider.awareness.getStates().values()
      );

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

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {

      provider.awareness.off("change", updateUsers);

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
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

    const enteredUsername =
      e.target.username.value;

    setUsername(enteredUsername);

    window.history.pushState(
      {},
      "",
      "?username=" + enteredUsername
    );
  };

  // Global cleanup
  useEffect(() => {

    return () => {

      provider.disconnect();
      ydoc.destroy();
    };

  }, [provider, ydoc]);

  // Login screen
  if (!username) {

    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">

        <form
          onSubmit={handleJoin}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            className="p-2 rounded-lg bg-gray-800 text-white"
          />

          <button className="p-2 rounded-lg bg-amber-500 text-black font-bold">
            Let's Code!
          </button>

        </form>

      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-700 flex gap-4 p-4">

      <aside className="h-full w-1/4 bg-amber-50 rounded-lg">

        <h2 className="text-2xl font-bold p-4 border-b border-gray-300">
          Active Users
        </h2>

        <ul className="p-4">

          {users.map((user, index) => (

            <li
              key={index}
              className="p-2 bg-amber-100 rounded-lg mb-2"
            >
              {user.name}
            </li>

          ))}

        </ul>

      </aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">

        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Start coding..."
          theme="vs-dark"
          onMount={handleMount}
        />

      </section>

    </main>
  );
}

export default App;