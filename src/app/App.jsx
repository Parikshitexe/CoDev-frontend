import "./App.css"
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo} from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"


function App() {

  const editor = userRef(null);
  const yDoc = useMemo(() => new Y.Doc(), []);
  const  yText = yDoc.getText(("monaco"), [ydoc]); 
  return (
    <main
    className="h-screen w-full bg-gray-700 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-50 rounded-lg">

      </aside>
      <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
        />
      </section>
    </main>
  )
}

export default App
