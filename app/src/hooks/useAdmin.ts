import { useState, useEffect, useCallback } from 'react';
import type { AdminSession } from '@/types';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const SESSION_KEY = 'gb_admin_session';

export const useAdmin = () => {
  const [session, setSession] = useState<AdminSession>({ isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Sesión válida por 8 horas
        const sessionAge = Date.now() - new Date(parsed.loginTime).getTime();
        const eightHours = 8 * 60 * 60 * 1000;
        
        if (sessionAge < eightHours) {
          setSession({ isAuthenticated: true, loginTime: parsed.loginTime });
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const newSession = { 
        isAuthenticated: true, 
        loginTime: new Date().toISOString() 
      };
      setSession(newSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setSession({ isAuthenticated: false });
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return {
    isAuthenticated: session.isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
