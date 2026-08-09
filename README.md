# CoDev Frontend

CoDev is a real-time collaborative code editor platform. This frontend application provides the user interface and connects to the backend to synchronize code, cursors, and presence in real time.

<img width="1912" height="868" alt="Screenshot 2026-08-09 124052" src="https://github.com/user-attachments/assets/1b0707da-b902-4bef-b46f-5d92402c9944" />
<img width="1916" height="910" alt="Screenshot 2026-08-09 124320" src="https://github.com/user-attachments/assets/ed4742bd-5242-457c-9893-1a58cc5103a4" />
<img width="1910" height="860" alt="Screenshot 2026-08-09 132029" src="https://github.com/user-attachments/assets/6e10d007-a451-4b74-ad4c-6b3c6f41b03c" />

## 🧠 Engineering & Architecture

### 1. Collaborative Editing Engine (Yjs + Monaco)
Building a reliable collaborative editor is notoriously difficult due to latency and merge conflicts. 
- **CRDTs over OT**: We use **Yjs** (a Conflict-Free Replicated Data Type) to manage the shared state. This guarantees that all users will eventually see the exact same document, regardless of the order in which network messages arrive.
- **Monaco Editor Integration**: The core editing experience is powered by Microsoft's **Monaco Editor** (`@monaco-editor/react`), the exact same web-based editor that powers VS Code.
- **The Binding**: We use `y-monaco` to bind the Yjs shared text type (`Y.Text`) directly to the Monaco editor's internal model. This abstraction automatically translates local keystrokes into Yjs operations and vice-versa, while also rendering remote users' cursors and text selections natively in the editor.

### 2. Network Provider
- We use `y-socket.io` as the network provider. It connects the local Yjs document to the backend server via WebSockets. It handles the initial state synchronization (exchanging state vectors) and continuously streams incremental updates to and from the server and peers.

### 3. UI and State Layer
- **React 19 & Vite**: Provides a blazing-fast development environment and optimized production builds. 
- **Component Styling**: Built using **Tailwind CSS v4** for utility-first styling, ensuring a highly maintainable and responsive design.
- **Accessible Components**: We leverage **Radix UI** primitives for complex interactive components (Dialogs, Dropdowns, Selects) to guarantee keyboard accessibility and screen-reader support without sacrificing design freedom.
- **Animations**: **Framer Motion** is used for layout animations and smooth UI transitions.

## 🛠️ Technologies Used
- **React 19, Vite, React Router**
- **Monaco Editor & y-monaco**
- **Yjs & y-socket.io**
- **Tailwind CSS v4, Radix UI, Framer Motion**
- **Axios** (for REST API calls like Auth)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` (or `.env.local`) file to point the client to the backend API and WebSocket server:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Development Server**:
   Start the Vite dev server (accessible on the local network via the `--host` flag):
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```
