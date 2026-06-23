import { ArrowRight, Zap, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTASection({ isLoggedIn, handleCreateRoom }) {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 w-full border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest mb-4">Get started</p>
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-white mb-3">
            Ready to start building?
          </h2>
          <p className="text-[#737373] text-sm max-w-sm mx-auto">
            Choose your path — try it instantly as a guest, or create a free account to keep your work.
          </p>
        </div>

        {/* Two-path CTA */}
        {!isLoggedIn ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            
            {/* Guest path */}
            <motion.div
              whileHover={{ borderColor: "#333" }}
              transition={{ duration: 0.2 }}
              className="card-interactive rounded-xl p-6 bg-[#0a0a0a] flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#737373]" />
                <span className="text-sm font-medium text-[#737373]">Just exploring?</span>
              </div>
              <p className="text-xs text-[#555] mb-5 leading-relaxed">
                Jump straight in. No account needed. Note: your code won't be saved after you close the tab.
              </p>
              <button
                onClick={handleCreateRoom}
                className="btn-secondary text-sm py-2 mt-auto w-full"
              >
                Start coding as guest <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Account path */}
            <motion.div
              whileHover={{ borderColor: "#555" }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-6 bg-white flex flex-col relative overflow-hidden"
            >
              {/* Top highlight line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="w-4 h-4 text-black" />
                <span className="text-sm font-medium text-black">Want to save your work?</span>
              </div>
              <p className="text-xs text-[#555] mb-5 leading-relaxed">
                Create a free account. Your code is saved automatically, every session.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-[#111] transition-colors"
              >
                Create free account <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="text-center">
            <button onClick={handleCreateRoom} className="btn-primary px-8 py-3">
              Create new workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
