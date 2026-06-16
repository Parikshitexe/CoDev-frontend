import { Zap, Play, Users, Globe, Shield, Terminal } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need to collaborate</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Built for speed and simplicity. No bloat, no configuration just open and code.</p>
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
  );
}
