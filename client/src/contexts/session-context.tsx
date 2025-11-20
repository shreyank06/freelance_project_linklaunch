import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { PathType } from "@shared/schema";

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface SessionContextType {
  userId: string | null;
  user: User | null;
  sessionId: string | null;
  pathType: PathType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, pathType: PathType) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (sessionId: string, pathType: PathType) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pathType, setPathType] = useState<PathType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
          setUser(userData);

          // Load session from localStorage
          const savedSessionId = localStorage.getItem("linklaunch_session_id");
          const savedPathType = localStorage.getItem("linklaunch_path_type") as PathType | null;

          if (savedSessionId && savedPathType) {
            setSessionId(savedSessionId);
            setPathType(savedPathType);
          }
        }
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    setUserId(data.user.id);
    setUser(data.user);

    // Set the first session as current
    if (data.currentSession) {
      setSessionId(data.currentSession.id);
      setPathType(data.currentSession.pathType);
      localStorage.setItem("linklaunch_session_id", data.currentSession.id);
      localStorage.setItem("linklaunch_path_type", data.currentSession.pathType);
    }
  };

  const register = async (email: string, password: string, fullName: string, pathType: PathType) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, pathType }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const data = await response.json();
    setUserId(data.user.id);
    setUser(data.user);
    setSessionId(data.session.id);
    setPathType(data.session.pathType);
    localStorage.setItem("linklaunch_session_id", data.session.id);
    localStorage.setItem("linklaunch_path_type", data.session.pathType);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUserId(null);
      setUser(null);
      clearSession();
    }
  };

  const clearSession = () => {
    setSessionId(null);
    setPathType(null);
    localStorage.removeItem("linklaunch_session_id");
    localStorage.removeItem("linklaunch_path_type");
  };

  const setSession = (newSessionId: string, newPathType: PathType) => {
    setSessionId(newSessionId);
    setPathType(newPathType);
    localStorage.setItem("linklaunch_session_id", newSessionId);
    localStorage.setItem("linklaunch_path_type", newPathType);
  };

  return (
    <SessionContext.Provider
      value={{
        userId,
        user,
        sessionId,
        pathType,
        isAuthenticated: !!userId,
        isLoading,
        login,
        register,
        logout,
        setSession,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
