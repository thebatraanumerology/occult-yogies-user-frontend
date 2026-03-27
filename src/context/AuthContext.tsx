import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import Cookies from "js-cookie";
import { doLogout } from "../services/login/LoginAPIFunctions";
  
  // ── Types ──────────────────────────────────────────────────────────────────────
  interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    login: (user: AuthUser, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
  }
  
  // ── Context ────────────────────────────────────────────────────────────────────
  const AuthContext = createContext<AuthContextValue | null>(null);
  
  const COOKIE_TOKEN_KEY = "oy_token";
  const COOKIE_USER_KEY  = "oy_user";
  const COOKIE_EXPIRY    = 2; // days
  
  // ── Provider ───────────────────────────────────────────────────────────────────
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
      () => Cookies.get(COOKIE_TOKEN_KEY) ?? null
    );
    const [user, setUser] = useState<AuthUser | null>(() => {
      const raw = Cookies.get(COOKIE_USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    });
  
    const login = (user: AuthUser, token: string) => {
      Cookies.set(COOKIE_TOKEN_KEY, token,           { expires: COOKIE_EXPIRY, sameSite: "Strict" });
      Cookies.set(COOKIE_USER_KEY,  JSON.stringify(user), { expires: COOKIE_EXPIRY, sameSite: "Strict" });
      setToken(token);
      setUser(user);
    };
  
    const logout = async () => {
      try {
        await doLogout();
      } catch (error) {
        console.error("Logout API error:", error); // still clear cookies even if API fails
      } finally {
        Cookies.remove(COOKIE_TOKEN_KEY);
        Cookies.remove(COOKIE_USER_KEY);
        setToken(null);
        setUser(null);
      }
    };
  
    return (
      <AuthContext.Provider
        value={{ user, token, login, logout, isAuthenticated: !!token }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
 export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
  };