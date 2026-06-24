import { Link, useNavigate } from "react-router-dom";
import { Code2, Zap, Shield, BookMarked, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const PERKS = [
  { icon: BookMarked, text: "Persistent workspaces — your code never disappears" },
  { icon: Zap, text: "Real-time collaboration with up to 5 participants" },
  { icon: Shield, text: "Secure, private sessions with unique room IDs" },
];

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen w-full flex font-sans overflow-hidden text-foreground bg-black">

      {/* Left: Brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-10 border-r border-[#1a1a1a] bg-[#050505] dot-grid-bg"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[5px] bg-white flex items-center justify-center">
            <Code2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">CoDev</span>
        </Link>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Start for free.
          </h2>
          <p className="text-sm text-[#737373] mb-8">
            Create your account and get persistent workspaces, saved sessions, and real-time collaboration.
          </p>
          <div className="space-y-4">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-[#737373]" />
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#555] font-mono">
          © {new Date().getFullYear()} CoDev · Free forever for individuals
        </p>
      </motion.div>

      {/* Right: Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 flex flex-col items-center justify-center px-6 bg-black"
      >
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="w-6 h-6 rounded-[4px] bg-white flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-white">CoDev</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-white mb-1 tracking-tight">Create your account</h1>
            <p className="text-sm text-[#737373]">Free forever. No credit card required.</p>
          </div>

          {error && (
            <div className="w-full p-3 mb-5 text-xs bg-[#f78166]/5 border border-[#f78166]/20 text-[#f78166] rounded-md text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
              <div className="w-12 h-12 bg-[#3fb950]/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-[#3fb950]" />
              </div>
              <h2 className="text-white font-medium mb-2">Check your email</h2>
              <p className="text-sm text-[#737373] mb-6">
                We've sent a verification link to your email address. Please click the link to activate your account.
              </p>
              <Link to="/login" className="btn-primary w-full py-2.5">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#737373]">Username</label>
                <Input
                  type="text"
                  name="username"
                  required
                  placeholder="johndoe"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-9 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#737373]">Email</label>
                <Input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-9 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#737373]">Password</label>
                <Input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-9 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 mt-1 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create free account"}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-[#555] text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-[#ededed] transition-colors">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-[11px] text-[#444] text-center leading-relaxed">
            By creating an account you agree to our terms of service and privacy policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
