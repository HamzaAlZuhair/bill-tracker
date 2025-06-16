import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  setAccessToken: (token: string | null) => void;
  refreshAccessToken: () => Promise<string | null>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          setAccessToken(newToken);
          return newToken;
        }
      }
      setAccessToken(null);
      return null;
    } catch {
      setAccessToken(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ setAccessToken, refreshAccessToken, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}