import { Link, useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Frontend-only right now: simulate login and redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="dark min-h-screen w-full bg-background relative flex flex-col items-center justify-center font-sans overflow-hidden text-foreground">
      
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 0%, var(--primary) 0%, transparent 70%)",
        }}
      />

      {/* Top Navbar */}
      <nav className="absolute top-0 w-full max-w-6xl mx-auto flex items-center justify-between p-6 z-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Terminal className="text-primary w-6 h-6" />
          <span className="text-xl font-bold tracking-wide">
            Code<span className="text-primary">V</span>
          </span>
        </Link>
      </nav>

      {/* Main Login Card */}
      <main className="z-10 w-full max-w-md p-8 bg-card border border-border shadow-[0_4px_30px_var(--shadow-color)] rounded-2xl flex flex-col items-center relative">
        <div className="absolute -top-6 w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-border shadow-lg transform rotate-3">
           <Terminal className="w-6 h-6 text-primary-foreground transform -rotate-3" />
        </div>
        
        <h2 className="text-3xl font-bold mt-4 mb-2 text-foreground text-center">Welcome Back</h2>
        <p className="text-muted-foreground text-sm mb-8 text-center px-4">
          Sign in to access your permanent workspaces.
        </p>
        
        {/* OAuth Buttons */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <button className="flex items-center justify-center gap-3 w-full p-3 rounded-lg bg-background border border-border hover:bg-muted transition-colors font-medium">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-foreground" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            Sign in with GitHub
          </button>
          
          <button className="flex items-center justify-center gap-3 w-full p-3 rounded-lg bg-background border border-border hover:bg-muted transition-colors font-medium">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <div className="flex items-center w-full mb-6">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">Or continue with email</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="p-3 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground ml-1 flex justify-between">
              Password
              <a href="#" className="text-primary hover:underline text-xs">Forgot?</a>
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              className="p-3 rounded-lg bg-input border border-border focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all text-foreground"
            />
          </div>
          <button className="mt-2 p-3 rounded-lg bg-primary hover:brightness-110 text-primary-foreground font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Sign up for free
          </Link>
        </p>
      </main>
    </div>
  );
}

export default Login;
