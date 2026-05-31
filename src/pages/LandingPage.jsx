import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Code2, ArrowRight, Users, Zap, Shield, Globe, Terminal, Play } from "lucide-react";

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

      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <Code2 className="text-primary w-5 h-5" />
            <span className="text-base font-semibold tracking-tight">CoDev</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {isLoggedIn ? (
              <Link to="/dashboard" className="flex items-center gap-1.5 text-foreground bg-card hover:bg-muted border border-border px-3.5 py-1.5 rounded-lg transition-colors font-medium text-sm">
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-1.5">Sign in</Link>
                <Link to="/register" className="bg-primary text-primary-foreground hover:opacity-90 px-3.5 py-1.5 rounded-lg transition-opacity font-medium">Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
          A fast, minimal collaborative editor. Create a room, share the link, and code side-by-side with your team — no setup needed.
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
                Start coding — it's free <ArrowRight className="w-4 h-4" />
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

      {/* Editor Preview */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-xl border border-border overflow-hidden shadow-2xl shadow-primary/5 bg-card">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-mono">workspace — CoDev</span>
          </div>
          {/* Content area */}
          <div className="flex">
            {/* Sidebar mock */}
            <div className="w-44 border-r border-border bg-sidebar p-3 hidden md:block">
              <p className="text-[10px] text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Participants (3)
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#d2a8ff]/30 text-[#d2a8ff] text-[9px] font-semibold flex items-center justify-center">A</div>
                  <span className="text-xs text-sidebar-foreground">alice</span>
                  <span className="text-[9px] text-muted-foreground ml-auto">you</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#7ee787]/30 text-[#7ee787] text-[9px] font-semibold flex items-center justify-center">B</div>
                  <span className="text-xs text-sidebar-foreground">bob</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#79c0ff]/30 text-[#79c0ff] text-[9px] font-semibold flex items-center justify-center">C</div>
                  <span className="text-xs text-sidebar-foreground">charlie</span>
                </div>
              </div>
            </div>
            {/* Editor mock */}
            <div className="flex-1 p-4 font-mono text-sm leading-7 min-h-[280px]" style={{ background: "#09090b" }}>
              <div><span className="text-chart-4">const</span> <span className="text-chart-2">greet</span> <span className="text-muted-foreground">=</span> <span className="text-chart-4">(</span><span className="text-foreground">name</span><span className="text-chart-4">)</span> <span className="text-chart-4">=&gt;</span> <span className="text-chart-4">{"{"}</span></div>
              <div>  <span className="text-chart-4">return</span> <span className="text-chart-3">`Hello, </span><span className="text-chart-4">${"{"}</span><span className="text-foreground">name</span><span className="text-chart-4">{"}"}</span><span className="text-chart-3">! 👋`</span><span className="text-muted-foreground">;</span></div>
              <div><span className="text-chart-4">{"}"}</span><span className="text-muted-foreground">;</span></div>
              <div className="mt-2"><span className="text-foreground">console</span><span className="text-muted-foreground">.</span><span className="text-chart-2">log</span><span className="text-chart-4">(</span><span className="text-chart-2">greet</span><span className="text-chart-4">(</span><span className="text-chart-3">"CoDev"</span><span className="text-chart-4">)</span><span className="text-chart-4">)</span><span className="text-muted-foreground">;</span></div>
              <div className="mt-4 text-muted-foreground/50 text-xs">// 3 users editing • JavaScript • Connected</div>
            </div>
            {/* Chat mock */}
            <div className="w-52 border-l border-border bg-sidebar p-3 hidden lg:flex flex-col">
              <p className="text-[10px] text-muted-foreground font-medium mb-3">Chat</p>
              <div className="space-y-2 flex-1">
                <div>
                  <p className="text-[9px] text-muted-foreground">bob · 2:14 PM</p>
                  <p className="text-xs bg-card border border-border rounded-md px-2 py-1 mt-0.5 text-foreground">refactored the greet fn</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-muted-foreground">alice · 2:15 PM</p>
                  <p className="text-xs bg-primary/15 rounded-md px-2 py-1 mt-0.5 text-foreground inline-block">looks great! 🚀</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need to collaborate</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Built for speed and simplicity. No bloat, no configuration — just open and code.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Instant sync</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Every keystroke syncs in real time across all participants. Zero lag, powered by conflict-free replicated data types.</p>
          </div>
          
          <div className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4 group-hover:bg-chart-2/15 transition-colors">
              <Play className="w-5 h-5 text-chart-2" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Run code in-browser</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Execute JavaScript, Python, C++, and Java directly. Output is shared with everyone in the room instantly.</p>
          </div>
          
          <div className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4 group-hover:bg-chart-5/15 transition-colors">
              <Users className="w-5 h-5 text-chart-5" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">See who's typing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Color-coded cursors and labels show exactly who is editing what. Up to 5 participants per room.</p>
          </div>

          <div className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4 group-hover:bg-chart-3/15 transition-colors">
              <Globe className="w-5 h-5 text-chart-3" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">No setup needed</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Share a link and your teammate is in. No downloads, no extensions, no configuration. Just a browser.</p>
          </div>

          <div className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Persistent workspaces</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Save workspaces to your dashboard and revisit anytime. Your code persists across sessions automatically.</p>
          </div>

          <div className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4 group-hover:bg-chart-2/15 transition-colors">
              <Terminal className="w-5 h-5 text-chart-2" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Built-in chat</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Discuss your code without leaving the editor. Room chat syncs in real time alongside your code changes.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 w-full border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Three steps. That's it.</h2>
            <p className="text-muted-foreground">From zero to collaborating in under 10 seconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">1</div>
              <h3 className="font-semibold mb-2 text-foreground">Create a room</h3>
              <p className="text-sm text-muted-foreground">Click "Start coding" and you're instantly dropped into a fresh workspace with a unique room ID.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-chart-2/10 text-chart-2 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-chart-2/20">2</div>
              <h3 className="font-semibold mb-2 text-foreground">Share the link</h3>
              <p className="text-sm text-muted-foreground">Hit the Share button, copy the link, and send it to your teammates. They join with one click.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-chart-5/10 text-chart-5 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-chart-5/20">3</div>
              <h3 className="font-semibold mb-2 text-foreground">Code together</h3>
              <p className="text-sm text-muted-foreground">Write, run, and discuss code in real time. Every change syncs instantly. It just works.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 w-full border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to start building?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Create a free workspace in seconds. No sign-up required for guest access.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCreateRoom}
              className="flex items-center justify-center gap-2 px-7 py-3 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg transition-opacity text-sm"
            >
              Create a workspace <ArrowRight className="w-4 h-4" />
            </button>
            {!isLoggedIn && (
              <button 
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-2 px-7 py-3 bg-card hover:bg-muted border border-border text-foreground font-medium rounded-lg transition-colors text-sm"
              >
                Create free account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Code2 className="w-4 h-4 text-primary" />
            <span>CoDev</span>
            <span className="text-muted-foreground/50">·</span>
            <span>Built for developers</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <span className="text-muted-foreground/30">·</span>
            <span>© 2025</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
