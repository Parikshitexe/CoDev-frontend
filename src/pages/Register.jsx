import { Link, useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

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

      <nav className="absolute top-0 w-full max-w-5xl mx-auto flex items-center justify-between px-6 py-5 z-10">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-foreground">
          <Code2 className="text-primary w-6 h-6" />
          <span className="text-lg font-semibold tracking-tight">CoDev</span>
        </Link>
      </nav>

      <main className="z-10 w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-foreground">Create an account</h2>
          <p className="text-muted-foreground text-sm">Get started with collaborative coding</p>
        </div>

        {error && (
          <div className="w-full p-3 mb-4 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              name="username"
              required
              placeholder="your-username"
              className="p-2.5 rounded-md bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="p-2.5 rounded-md bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Min. 6 characters"
              className="p-2.5 rounded-md bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground text-sm"
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button 
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="flex items-center w-full my-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        <button className="flex items-center justify-center gap-2.5 w-full p-2.5 rounded-md bg-card border border-border hover:bg-muted transition-colors text-sm font-medium">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          Sign up with GitHub
        </button>

        <p className="mt-8 text-sm text-muted-foreground text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}

export default Register;
