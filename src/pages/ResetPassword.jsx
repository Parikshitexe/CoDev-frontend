import { Link, useParams, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../config/api";
import { CheckCircle2 } from "lucide-react";
import codevLogo from "../assets/codev-logo.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to reset password");

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
          <img src={codevLogo} alt="CoDev Logo" className="h-8 w-auto object-contain rounded-md" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Create New Password</h1>
          {!success && (
            <p className="text-sm text-[#737373]">
              Your new password must be at least 6 characters long.
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
            <h2 className="text-white font-medium mb-2">Password Reset Successfully</h2>
            <p className="text-sm text-[#737373] mb-6">
              You can now log in to your account with your new password.
            </p>
            <Link to="/login" className="btn-primary w-full py-2.5">
              Proceed to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#737373]">New Password</label>
              <Input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-10 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#737373]">Confirm New Password</label>
              <Input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                placeholder="••••••••"
                className="bg-[#0a0a0a] border-[#1a1a1a] text-white placeholder:text-[#555] focus:border-[#333] h-10 text-sm"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
