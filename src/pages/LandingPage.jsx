import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import EditorPreview from "../components/landing/EditorPreview";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import { useAuth } from "../hooks/useAuth";
import { SERVER_URL } from "../config/api";

function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleCreateRoom = async () => {
    const newRoomId = uuidv4();
    if (isLoggedIn) {
      try {
        await fetch(`${SERVER_URL}/api/workspaces`, {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: newRoomId, name: `Quick Room ${newRoomId.slice(0, 6)}` })
        });
      } catch (err) {
        console.error(err);
      }
    }
    navigate(`/${newRoomId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dark min-h-screen w-full dot-grid-bg relative flex flex-col font-sans overflow-x-hidden text-foreground"
    >
      {/* Subtle white radial glow at top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)" }}
      />

      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} handleCreateRoom={handleCreateRoom} />
      <EditorPreview />
      <FeaturesSection />
      <HowItWorks />
      <CTASection isLoggedIn={isLoggedIn} handleCreateRoom={handleCreateRoom} />
      <Footer />
    </motion.div>
  );
}

export default LandingPage;
