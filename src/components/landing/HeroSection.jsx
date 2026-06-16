import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection({ isLoggedIn, handleCreateRoom }) {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
      
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium mb-8 text-primary">
        <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse"></span>
        Now in public beta
      </div>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 max-w-3xl">
        Write code together,{" "}
        <span className="bg-gradient-to-r from-primary via-chart-5 to-primary bg-clip-text text-transparent">in real time</span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
        A fast, minimal collaborative editor. Create a room, share the link, and code side-by-side with your team no setup needed.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-opacity text-sm"
            >
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCreateRoom}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-card hover:bg-muted border border-border text-foreground font-medium rounded-lg transition-colors text-sm"
            >
              Quick workspace
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCreateRoom}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-opacity text-sm"
            >
              Start coding it's free! <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-card hover:bg-muted border border-border text-foreground font-medium rounded-lg transition-colors text-sm"
            >
              Sign in
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground">No credit card required. Works in your browser.</p>
    </section>
  );
}
