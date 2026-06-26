import { Link } from "react-router-dom";
import { SERVER_URL } from "../config/api";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import codevLogo from "../assets/codev-logo.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to send reset link");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden text-foreground bg-black px-6">
      
      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2 mb-10">
        <img src={codevLogo} alt="CoDev Logo" className="h-10 w-auto object-contain rounded-md" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Reset Password</h1>
          {!success && (
            <p className="text-sm text-[#737373]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          )}
        </div>

        {error && (
          <div className="w-full p-3 mb-5 text-xs bg-[#f78166]/5 border border-[#f78166]/20 text-[#f78166] rounded-md text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center">
            <div className="w-12 h-12 bg-[#3fb950]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#3fb950]" />
            </div>
            <h2 className="text-white font-medium mb-2">Check your email</h2>
            <p className="text-sm text-[#737373] mb-6">
              If an account exists for that email, we have sent password reset instructions.
            </p>
            <Link to="/login" className="btn-primary w-full py-2.5">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleForgot} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#737373]">Email Address</label>
              <Input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-10 text-sm"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-xs text-[#737373] hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3 mr-1.5" />
              Back to login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
