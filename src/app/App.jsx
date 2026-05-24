import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Workspace from "../pages/Workspace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:roomId" element={<Workspace />} />
      </Routes>
    </Router>
  );
}

export default App;