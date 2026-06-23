import { Zap, Play, Users, Globe, Shield, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Zero-lag sync",
    desc: "Every keystroke syncs in real time across all participants using conflict-free replicated data types (CRDTs). No merge conflicts, ever.",
    size: "large", // spans 2 cols on desktop
    color: "#fff",
    dim: "#ededed"
  },
  {
    icon: Play,
    title: "Run code in-browser",
    desc: "Execute JavaScript, Python, C++, and Java. Output is shared with everyone in the room instantly.",
    size: "small",
    color: "#3fb950",
    dim: "#3fb950"
  },
  {
    icon: Users,
    title: "Live cursors",
    desc: "Color-coded cursors and nametags show exactly who is editing what, in real time.",
    size: "small",
    color: "#d2a8ff",
    dim: "#d2a8ff"
  },
  {
    icon: Globe,
    title: "No setup needed",
    desc: "Share a link. Your teammate joins in one click. No downloads, no extensions, just a browser.",
    size: "small",
    color: "#79c0ff",
    dim: "#79c0ff"
  },
  {
    icon: Shield,
    title: "Persistent workspaces",
    desc: "Sign in and your code is saved automatically. Revisit any workspace from your dashboard anytime.",
    size: "small",
    color: "#e3b341",
    dim: "#e3b341"
  },
  {
    icon: MessageSquare,
    title: "Built-in chat",
    desc: "Discuss your code without leaving the editor. Room chat syncs alongside your code changes.",
    size: "small",
    color: "#f78166",
    dim: "#f78166"
  },
];

export default function FeaturesSection() {
  const largeFeature = features[0];
  const smallFeatures = features.slice(1);

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24">
      <div className="text-center mb-14">
        <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest mb-4">Features</p>
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-white mb-3">
          Everything you need to collaborate
        </h2>
        <p className="text-[#737373] max-w-md mx-auto text-sm">
          Built for speed and simplicity. No bloat, no config — just open and code.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Large hero card — spans 2 columns */}
        <motion.div
          whileHover={{ borderColor: "#333" }}
          transition={{ duration: 0.2 }}
          className="md:col-span-2 card-interactive rounded-xl p-7 bg-[#0a0a0a] flex flex-col justify-between min-h-[220px] group"
        >
          <div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 transition-colors duration-200"
              style={{ background: `${largeFeature.color}11`, border: `1px solid ${largeFeature.color}22` }}
            >
              <largeFeature.icon className="w-5 h-5" style={{ color: largeFeature.color }} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{largeFeature.title}</h3>
            <p className="text-sm text-[#737373] leading-relaxed max-w-sm">{largeFeature.desc}</p>
          </div>
          {/* Decorative CRDT visual */}
          <div className="mt-6 flex gap-2 items-center">
            {["A", "B", "C"].map((u, i) => (
              <div key={u} className="flex items-center gap-1">
                {i > 0 && <div className="w-8 h-px bg-gradient-to-r from-[#1a1a1a] to-[#333]" />}
                <div className="w-6 h-6 rounded-full border border-[#222] flex items-center justify-center text-[9px] font-semibold text-[#555]">{u}</div>
              </div>
            ))}
            <span className="text-[10px] text-[#555] ml-2 font-mono">syncing...</span>
          </div>
        </motion.div>

        {/* Small cards */}
        {smallFeatures.map((feat) => (
          <motion.div
            key={feat.title}
            whileHover={{ borderColor: "#333" }}
            transition={{ duration: 0.2 }}
            className="card-interactive rounded-xl p-6 bg-[#0a0a0a] flex flex-col group min-h-[180px]"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200"
              style={{ background: `${feat.dim}11`, border: `1px solid ${feat.dim}22` }}
            >
              <feat.icon className="w-4 h-4" style={{ color: feat.dim }} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5 tracking-tight">{feat.title}</h3>
            <p className="text-xs text-[#737373] leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
