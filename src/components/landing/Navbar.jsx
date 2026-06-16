import { Link } from "react-router-dom";
import { Code2, ArrowRight } from "lucide-react";

export default function Navbar({ isLoggedIn }) {
  return (
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
  );
}
