import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../config/api";

export function useAuth(options = {}) {
  const { requireAuth = false } = options;
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (requireAuth && !storedUser) {
      navigate("/login");
    }
  }, [navigate, requireAuth]);

  const logout = async () => {
    try {
      await fetch(`${SERVER_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'omit' // We are clearing the cookie on backend anyway
      });
    } catch (e) {
      console.error('Logout failed', e);
    }

    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleAuthError = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login?expired=true");
  };

  return { user, isLoggedIn, logout, handleAuthError };
}
