import { Link, useNavigate } from "react-router-dom";
import { Terminal, UserPlus } from "lucide-react";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
      
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 0%, var(--primary) 0%, transparent 70%)",
        }}
      />

      <nav className="absolute top-0 w-full max-w-6xl mx-auto flex items-center justify-between p-6 z-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Terminal className="text-primary w-6 h-6" />
          <span className="text-xl font-bold tracking-wide">
            Code<span className="text-primary">V</span>
          </span>
        </Link>
      </nav>

      <main className="z-10 w-full max-w-md p-8 bg-card border border-border shadow-[0_4px_30px_var(--shadow-color)] rounded-2xl flex flex-col items-center relative mt-8">
        <div className="absolute -top-6 w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-border shadow-lg transform rotate-3">
           <UserPlus className="w-6 h-6 text-primary-foreground transform -rotate-3" />
        </div>
        
        <h2 className="text-3xl font-bold mt-4 mb-2 text-foreground text-center">Create an Account</h2>
        <p className="text-muted-foreground text-sm mb-6 text-center px-4">
          Join to create permanent collaborative workspaces.
        </p>

        {error && (
          <div className="w-full p-3 mb-4 text-xs font-semibold bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Username</label>
            <input
              type="text"
              name="username"
              required
              placeholder="e.g. code_ninja"
              className="p-3 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="p-3 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Create a strong password"
              className="p-3 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground"
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button 
            type="submit"
            disabled={loading}
            className="mt-2 p-3 rounded-lg bg-primary hover:brightness-110 text-primary-foreground font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center w-full my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 w-full p-3 rounded-lg bg-background border border-border hover:bg-muted transition-colors font-medium">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            Sign up with GitHub
          </button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </main>
    </div>
  );
}

export default Register;
