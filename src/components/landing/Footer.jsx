import { Code2 } from "lucide-react";

export default function Footer() {
  return (
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
  );
}
