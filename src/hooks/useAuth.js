import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth(options = {}) {
  const { requireAuth = false } = options;
  const navigate = useNavigate();
  
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token && !!user);

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (requireAuth && (!currentToken || !storedUser)) {
      navigate("/login");
    }
  }, [navigate, requireAuth]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleAuthError = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login?expired=true");
  };

  return { token, user, isLoggedIn, logout, handleAuthError };
}
