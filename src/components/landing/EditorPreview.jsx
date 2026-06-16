import { Users } from "lucide-react";

export default function EditorPreview() {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24">
      <div className="rounded-xl border border-border overflow-hidden shadow-2xl shadow-primary/5 bg-card">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2 font-mono">workspace CoDev</span>
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
                <span className="text-xs text-sidebar-foreground">Adarsh</span>
                <span className="text-[9px] text-muted-foreground ml-auto">you</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#7ee787]/30 text-[#7ee787] text-[9px] font-semibold flex items-center justify-center">B</div>
                <span className="text-xs text-sidebar-foreground">Ravina</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#79c0ff]/30 text-[#79c0ff] text-[9px] font-semibold flex items-center justify-center">C</div>
                <span className="text-xs text-sidebar-foreground">Manish</span>
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
                <p className="text-[9px] text-muted-foreground">Manish · 2:14 PM</p>
                <p className="text-xs bg-card border border-border rounded-md px-2 py-1 mt-0.5 text-foreground">your nested loop logic is wrong</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground">Adarsh · 2:15 PM</p>
                <p className="text-xs bg-primary/15 rounded-md px-2 py-1 mt-0.5 text-foreground inline-block">lets fix it</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
