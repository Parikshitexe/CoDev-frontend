import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Create a room",
    desc: "Click \"Start coding\" and you're dropped into a fresh workspace instantly. No account required.",
    detail: "Powered by a unique room ID that acts as your session key.",
  },
  {
    number: "02",
    title: "Share the link",
    desc: "Hit Share, copy the URL, send it to your teammates. They join in one click.",
    detail: "Works across any device, anywhere in the world.",
  },
  {
    number: "03",
    title: "Code together",
    desc: "Write, run, and discuss code in real time. Every change syncs instantly across all participants.",
    detail: "Conflict-free — two people can type on the same line simultaneously.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 w-full border-t border-[#1a1a1a] bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-white mb-3">
            Three steps. That's it.
          </h2>
          <p className="text-[#737373] text-sm">From zero to collaborating in under 10 seconds.</p>
        </div>

        {/* Connected timeline */}
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-[22px] left-[calc(16.666%+22px)] right-[calc(16.666%+22px)] h-px bg-[#1a1a1a] z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#333] via-white/20 to-[#333] origin-left"
            />
          </div>

          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="flex-1 flex flex-col items-center text-center px-4 relative z-10"
            >
              {/* Step number circle */}
              <div className="w-11 h-11 rounded-full border border-[#1a1a1a] bg-black flex items-center justify-center mb-5 shrink-0">
                <span className="text-xs font-mono font-medium text-[#737373]">{step.number}</span>
              </div>

              <h3 className="text-base font-semibold text-white mb-2 tracking-tight">{step.title}</h3>
              <p className="text-sm text-[#737373] leading-relaxed mb-3">{step.desc}</p>
              <p className="text-[11px] text-[#444] leading-relaxed font-mono">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
