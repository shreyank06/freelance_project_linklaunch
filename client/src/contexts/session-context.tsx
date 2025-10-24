import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { PathType } from "@shared/schema";

interface SessionContextType {
  sessionId: string | null;
  pathType: PathType | null;
  setSession: (sessionId: string, pathType: PathType) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pathType, setPathType] = useState<PathType | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("linklaunch_session_id");
    const savedPathType = localStorage.getItem("linklaunch_path_type") as PathType | null;
    
    if (savedSessionId && savedPathType) {
      setSessionId(savedSessionId);
      setPathType(savedPathType);
    }
  }, []);

  const setSession = (newSessionId: string, newPathType: PathType) => {
    setSessionId(newSessionId);
    setPathType(newPathType);
    localStorage.setItem("linklaunch_session_id", newSessionId);
    localStorage.setItem("linklaunch_path_type", newPathType);
  };

  const clearSession = () => {
    setSessionId(null);
    setPathType(null);
    localStorage.removeItem("linklaunch_session_id");
    localStorage.removeItem("linklaunch_path_type");
  };

  return (
    <SessionContext.Provider value={{ sessionId, pathType, setSession, clearSession }}>
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
