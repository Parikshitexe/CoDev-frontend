import { ArrowRight, Zap, Lock, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection({ isLoggedIn, handleCreateRoom }) {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">

      {/* Announcement pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] text-xs font-medium mb-8 cursor-default"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
        <span className="shimmer-text">Now in public beta · Free to use</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.05] mb-5 max-w-3xl text-white"
      >
        The collaborative IDE
        <br />
        <span className="text-[#737373]">that gets out of your way.</span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-[#737373] max-w-lg mb-10 leading-relaxed"
      >
        Create a room in one click. Share the link. Code together in real time.
        <br className="hidden sm:block" />
        No installs, no sign-up required to try.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mb-10"
      >
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate("/dashboard")} className="btn-primary px-6 py-2.5">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={handleCreateRoom} className="btn-secondary px-6 py-2.5">
              Quick workspace
            </button>
          </>
        ) : (
          <>
            <button onClick={handleCreateRoom} className="btn-primary px-6 py-2.5 text-sm">
              Start coding — it's free <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary px-6 py-2.5 text-sm">
              Sign in
            </button>
          </>
        )}
      </motion.div>

      {/* Guest vs Account clarity box */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="w-full max-w-2xl rounded-xl border border-[#1a1a1a] overflow-hidden"
        >
          <div className="grid grid-cols-2 divide-x divide-[#1a1a1a]">
            
            {/* Guest column */}
            <div className="p-5 bg-[#0a0a0a]">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#737373]" />
                <span className="text-sm font-medium text-[#737373]">Guest (no account)</span>
              </div>
              <ul className="space-y-2.5 text-left">
                {[
                  "Create instant rooms",
                  "Real-time collaboration",
                  "Run code in-browser",
                  "Share via link",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#737373]">
                    <span className="w-3.5 h-3.5 rounded-full border border-[#333] flex items-center justify-center text-[9px] text-[#555] shrink-0">✓</span>
                    {item}
                  </li>
                ))}
                <div className="pt-1 border-t border-[#1a1a1a] mt-2" />
                {[
                  "Code is lost when you close",
                  "No workspace history",
                  "No saved projects",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#555]">
                    <span className="w-3.5 h-3.5 rounded-full border border-[#222] flex items-center justify-center text-[9px] text-[#444] shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Account column */}
            <div className="p-5 bg-[#080808] relative">
              {/* Subtle top glow */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Free account</span>
                <span className="text-[10px] font-medium text-[#3fb950] bg-[#3fb950]/10 border border-[#3fb950]/20 px-1.5 py-0.5 rounded-full ml-auto">Recommended</span>
              </div>
              <ul className="space-y-2.5 text-left">
                {[
                  "Everything in Guest, plus:",
                  "Code saved automatically",
                  "Persistent workspace dashboard",
                  "Manage & revisit projects",
                  "Your work never disappears",
                ].map((item, i) => (
                  <li key={item} className={`flex items-center gap-2 text-xs ${i === 0 ? "text-[#737373] font-medium" : "text-[#ededed]"}`}>
                    {i !== 0 && (
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center text-[9px] text-white shrink-0">✓</span>
                    )}
                    {i === 0 && <span className="w-3.5 h-3.5 shrink-0" />}
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="mt-5 w-full btn-primary text-xs py-2"
              >
                Create free account <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
