import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      try {
        const response = await fetch(`http://localhost:3000/api/auth/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data?.error || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred while verifying your email.");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="dark min-h-screen w-full flex items-center justify-center font-sans overflow-hidden text-foreground bg-black px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl flex flex-col items-center text-center shadow-2xl"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-[#737373] animate-spin mb-6" />
            <h1 className="text-xl font-semibold text-white mb-2 tracking-tight">Verifying Email</h1>
            <p className="text-sm text-[#737373]">Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 bg-[#3fb950]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-7 h-7 text-[#3fb950]" />
            </div>
            <h1 className="text-xl font-semibold text-white mb-2 tracking-tight">Email Verified!</h1>
            <p className="text-sm text-[#737373] mb-8">{message}</p>
            <Link to="/login" className="btn-primary w-full py-2.5">
              Continue to Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 bg-[#f78166]/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-7 h-7 text-[#f78166]" />
            </div>
            <h1 className="text-xl font-semibold text-white mb-2 tracking-tight">Verification Failed</h1>
            <p className="text-sm text-[#737373] mb-8">{message}</p>
            <Link to="/register" className="btn-secondary w-full py-2.5">
              Back to Registration
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
