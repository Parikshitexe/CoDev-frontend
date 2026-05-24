import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Zap, Copy, Eye, Terminal, ArrowRight } from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/${newRoomId}`);
  };

  return (
    // Applied the "dark" class here so all dark mode CSS variables from theme-context.md activate.
    <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center font-sans overflow-x-hidden text-foreground">
      
      {/* Thematic Depth Background: Replaced Crimson with Theme Primary/Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)",
        }}
      />
      
      {/* Top Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between p-6 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="text-primary w-6 h-6" />
          <span className="text-xl font-bold tracking-wide">
            Code<span className="text-primary">V</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground font-medium text-sm">
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 z-10 mt-16 pb-24">
        
        {/* Pill Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-sm font-medium mb-8 cursor-pointer hover:bg-muted transition-colors">
          <div className="w-2 h-2 rounded-full bg-chart-2"></div>
          <span className="text-muted-foreground">CoDev v1.0 is Live</span>
          <Zap className="w-3.5 h-3.5 text-primary ml-1" />
          <span className="text-muted-foreground ml-1">Read More <ArrowRight className="inline w-3.5 h-3.5" /></span>
        </div>

        {/* Hero Title */}
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-center leading-tight mb-6 text-foreground">
          Code Collaboratively <br />
          <span className="text-muted-foreground">In Real-Time</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-12 font-light">
          Professional-grade real-time code editor. Easily generate a secure room link and seamlessly collaborate with your peers. Crafted for modern developers.
        </p>

        {/* Feature Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-2xl">
          <div className="flex-1 flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-[0_2px_10px_var(--shadow-color)]">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border">
              <Copy className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">One-Click Share</h3>
              <p className="text-xs text-muted-foreground">Ready-to-use environments</p>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-[0_2px_10px_var(--shadow-color)]">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Live Syncing</h3>
              <p className="text-xs text-muted-foreground">See code changes in action</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={handleCreateRoom}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-sidebar-primary text-primary-foreground font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          >
            <Zap className="w-5 h-5" />
            Create Workspace
          </button>
          
          <button className="flex items-center justify-center gap-2 px-8 py-3 bg-card hover:bg-muted border border-border text-foreground font-semibold rounded-lg transition-colors">
            <Terminal className="w-5 h-5 text-muted-foreground" />
            Join Existing Room
          </button>
        </div>

      </main>
    </div>
  );
}

export default LandingPage;
