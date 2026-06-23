import { Users } from "lucide-react";
import { useEffect, useState } from "react";

// Animated typing effect for the mock editor
const CODE_LINES = [
  { parts: [{ color: "#d2a8ff", text: "const " }, { color: "#79c0ff", text: "greet" }, { color: "#ededed", text: " = (" }, { color: "#ffa657", text: "name" }, { color: "#ededed", text: ") => {" }] },
  { parts: [{ color: "#ededed", text: "  " }, { color: "#d2a8ff", text: "return" }, { color: "#ededed", text: " " }, { color: "#a5d6ff", text: "`Hello, ${name}! 👋`" }] },
  { parts: [{ color: "#ededed", text: "};" }] },
  { parts: [] }, // empty line
  { parts: [{ color: "#ededed", text: "console." }, { color: "#79c0ff", text: "log" }, { color: "#ededed", text: "(" }, { color: "#79c0ff", text: "greet" }, { color: "#ededed", text: '("CoDev"));' }] },
];

export default function EditorPreview() {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = CODE_LINES.reduce((acc, line) =>
    acc + line.parts.reduce((a, p) => a + p.text.length, 0) + 1, 0
  );

  useEffect(() => {
    if (visibleChars >= totalChars) return;
    const timer = setTimeout(() => setVisibleChars(v => v + 2), 40);
    return () => clearTimeout(timer);
  }, [visibleChars, totalChars]);

  // Convert flat char count to rendered lines
  let charBudget = visibleChars;
  const renderedLines = CODE_LINES.map((line) => {
    const renderedParts = [];
    for (const part of line.parts) {
      if (charBudget <= 0) break;
      const visible = part.text.slice(0, charBudget);
      charBudget -= part.text.length;
      renderedParts.push({ color: part.color, text: visible });
    }
    charBudget -= 1; // newline
    return renderedParts;
  });

  const showCursor = visibleChars < totalChars;

  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24">
      {/* Section label */}
      <p className="text-xs text-[#555] font-mono text-center mb-5 tracking-widest uppercase">
        Live preview
      </p>

      <div className="rounded-xl border border-[#1a1a1a] overflow-hidden shadow-2xl shadow-black/60">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[11px] text-[#555] font-mono ml-2">my-project — CoDev</span>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-[#3fb950]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
            3 users connected
          </div>
        </div>

        {/* Editor area */}
        <div className="flex">
          {/* Left: Participants sidebar */}
          <div className="w-44 border-r border-[#1a1a1a] bg-[#050505] p-3 hidden md:block shrink-0">
            <p className="text-[10px] text-[#555] font-medium mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="w-3 h-3" /> Participants
            </p>
            <div className="space-y-2.5">
              {[
                { initial: "A", name: "Adarsh", color: "#d2a8ff", tag: "you" },
                { initial: "R", name: "Ravina", color: "#3fb950", tag: null },
                { initial: "M", name: "Manish", color: "#79c0ff", tag: null },
              ].map(({ initial, name, color, tag }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full text-[9px] font-semibold flex items-center justify-center shrink-0"
                    style={{ background: `${color}22`, color }}
                  >
                    {initial}
                  </div>
                  <span className="text-xs text-[#737373] truncate">{name}</span>
                  {tag && <span className="text-[9px] text-[#555] ml-auto shrink-0">{tag}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Center: Code editor */}
          <div className="flex-1 p-5 font-mono text-sm leading-7 min-h-[260px] bg-[#0d1117] relative">
            {/* Line numbers */}
            <div className="absolute left-0 top-5 bottom-5 w-10 flex flex-col items-end pr-3 gap-[3px] select-none">
              {CODE_LINES.map((_, i) => (
                <span key={i} className="text-[#333] text-xs leading-7">{i + 1}</span>
              ))}
            </div>
            {/* Code */}
            <div className="ml-10">
              {renderedLines.map((parts, lineIdx) => (
                <div key={lineIdx} className="min-h-[28px]">
                  {parts.map((part, pIdx) => (
                    <span key={pIdx} style={{ color: part.color }}>{part.text}</span>
                  ))}
                  {/* Blinking cursor on last visible line */}
                  {showCursor && lineIdx === renderedLines.findIndex(
                    (_, i) => renderedLines.slice(i + 1).every(p => p.length === 0)
                  ) && (
                    <span className="inline-block w-[2px] h-[14px] bg-white align-middle ml-px cursor-blink" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat sidebar */}
          <div className="w-52 border-l border-[#1a1a1a] bg-[#050505] p-3 hidden lg:flex flex-col shrink-0">
            <p className="text-[10px] text-[#555] font-medium mb-3 uppercase tracking-wider">Chat</p>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-[9px] text-[#555] mb-1">Manish · 2:14 PM</p>
                <p className="text-[11px] bg-[#111] border border-[#1a1a1a] rounded-md px-2.5 py-1.5 text-[#737373]">
                  your nested loop is wrong
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[9px] text-[#555] mb-1">Adarsh · 2:15 PM</p>
                <p className="text-[11px] bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-[#ededed]">
                  let's fix it together
                </p>
              </div>
              <div>
                <p className="text-[9px] text-[#555] mb-1">Ravina · 2:15 PM</p>
                <p className="text-[11px] bg-[#111] border border-[#1a1a1a] rounded-md px-2.5 py-1.5 text-[#737373]">
                  I'll refactor the loop 👍
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
