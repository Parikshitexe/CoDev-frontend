import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection({ isLoggedIn, handleCreateRoom }) {
  const navigate = useNavigate();

  return (
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
  );
}
