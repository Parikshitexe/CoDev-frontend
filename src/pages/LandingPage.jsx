import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import EditorPreview from "../components/landing/EditorPreview";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const SERVER_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : `http://${window.location.hostname}:3000`;

  const handleCreateRoom = async () => {
    const newRoomId = uuidv4();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${SERVER_URL}/api/workspaces`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            roomId: newRoomId,
            name: "Quick Room"
          })
        });
      } catch (err) {
        console.error(err);
      }
    }
    navigate(`/${newRoomId}`);
  };

  return (
    <div className="dark min-h-screen w-full bg-background relative flex flex-col font-sans overflow-x-hidden text-foreground">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        opacity: 0.3,
      }} />
      
      {/* Gradient Orb */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse, rgba(129,140,248,0.12) 0%, transparent 70%)",
          animation: "pulse-glow 6s ease-in-out infinite",
        }}
      />

      <Navbar isLoggedIn={isLoggedIn} />
      
      <HeroSection 
        isLoggedIn={isLoggedIn} 
        handleCreateRoom={handleCreateRoom} 
      />
      
      <EditorPreview />
      
      <FeaturesSection />
      
      <HowItWorks />
      
      <CTASection 
        isLoggedIn={isLoggedIn} 
        handleCreateRoom={handleCreateRoom} 
      />
      
      <Footer />

    </div>
  );
}

export default LandingPage;
