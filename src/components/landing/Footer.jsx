import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-[#1a1a1a] overflow-hidden" style={{ background: "#050505" }}>

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Green radial glow from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(63,185,80,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Top info bar */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[3px] bg-white flex items-center justify-center">
            <Code2 className="w-3 h-3 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">CoDev</span>
        </div>
        <p className="text-xs text-[#555] font-medium text-center">
          Crafted for modern engineering teams.
        </p>
        <p className="text-xs text-[#555]">
          © {new Date().getFullYear()} CoDev
        </p>
      </div>

      {/* Giant brand text — visible dark gray like the reference */}
      <div className="relative z-10 w-full flex justify-center items-end select-none pointer-events-none overflow-hidden" style={{ lineHeight: 0.85 }}>
        <span
          className="font-black tracking-tighter"
          style={{
            fontSize: "clamp(90px, 22vw, 280px)",
            color: "#1e1e1e",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
          }}
        >
          CoDev
        </span>
      </div>

    </footer>
  );
}
