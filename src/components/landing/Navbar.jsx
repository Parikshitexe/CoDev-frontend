import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import codevLogo from "../../assets/codev-logo.png";

export default function Navbar({ isLoggedIn }) {
  return (
    <nav className="sticky top-0 w-full z-50 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={codevLogo} alt="CoDev Logo" className="h-8 w-auto object-contain rounded-[4px]" />
          {/* Live indicator */}
          
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 text-sm">
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-white bg-white/10 hover:bg-white/15 border border-[#333] px-3.5 py-1.5 rounded-md transition-colors font-medium text-sm"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#737373] hover:text-white transition-colors font-medium px-3.5 py-1.5 rounded-md hover:bg-[#111]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-3.5 py-1.5"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
