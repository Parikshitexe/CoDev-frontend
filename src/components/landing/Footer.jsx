import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-[#1a1a1a] bg-black">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[3px] bg-white flex items-center justify-center">
            <Code2 className="w-3 h-3 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">CoDev</span>
        </div>

        <p className="text-xs text-[#555] font-mono text-center">
          Built with Yjs · React · Node.js · MongoDB
        </p>

        <p className="text-xs text-[#555]">
          © {new Date().getFullYear()} CoDev
        </p>
      </div>
    </footer>
  );
}
