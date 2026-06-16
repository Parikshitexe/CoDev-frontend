export default function HowItWorks() {
  return (
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
  );
}
