import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../config/api";
import { Zap, Shield, BookMarked } from "lucide-react";
import codevLogo from "../assets/codev-logo.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PERKS = [
  { icon: BookMarked, text: "Persistent workspaces — your code never disappears" },
  { icon: Zap, text: "Real-time collaboration with up to 5 participants" },
  { icon: Shield, text: "Secure, private sessions with unique room IDs" },
];

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Login failed");

      localStorage.setItem("user", JSON.stringify(data?.user));
      navigate("/dashboard");
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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={codevLogo} alt="CoDev Logo" className="h-8 w-auto object-contain rounded-[5px]" />
        </Link>

        {/* Middle: value props */}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Welcome back.
          </h2>
          <p className="text-sm text-[#737373] mb-8">Sign in to access your workspaces and collaborations.</p>
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

        {/* Bottom */}
        <p className="text-[11px] text-[#555] font-mono">
          © {new Date().getFullYear()} CoDev · Built with Yjs + React
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
          <img src={codevLogo} alt="CoDev Logo" className="h-6 w-auto object-contain rounded-[4px]" />
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-white mb-1 tracking-tight">Sign in</h1>
            <p className="text-sm text-[#737373]">Enter your credentials to continue.</p>
          </div>

          {/* Session expired notice */}
          {new URLSearchParams(window.location.search).get("expired") === "true" && !error && (
            <div className="w-full p-3 mb-5 text-xs border border-[#1a1a1a] bg-[#0a0a0a] text-[#737373] rounded-md text-center">
              Your session has expired. Please sign in again.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="w-full p-3 mb-5 text-xs bg-[#f78166]/5 border border-[#f78166]/20 text-[#f78166] rounded-md text-center">
              {error}
            </div>
          )}

          {/* OAuth buttons (Commented out for MVP)
          <div className="flex flex-col gap-2.5 mb-6">
            <Button variant="outline" className="w-full bg-transparent border-[#1a1a1a] text-[#737373] hover:text-white hover:border-[#333] hover:bg-[#0a0a0a]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </Button>
            <Button variant="outline" className="w-full bg-transparent border-[#1a1a1a] text-[#737373] hover:text-white hover:border-[#333] hover:bg-[#0a0a0a]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="flex items-center w-full mb-6">
            <div className="flex-1 border-t border-[#1a1a1a]" />
            <span className="px-3 text-xs text-[#555]">or</span>
            <div className="flex-1 border-t border-[#1a1a1a]" />
          </div>
          */}

          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#737373]">Email</label>
              <Input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-9 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#737373] flex justify-between">
                Password
                <Link to="/forgot-password" className="text-[#555] hover:text-white transition-colors font-normal">Forgot?</Link>
              </label>
              <Input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-9 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-1 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-xs text-[#555] text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-[#ededed] transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
