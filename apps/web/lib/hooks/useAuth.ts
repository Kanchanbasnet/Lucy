'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();

    // Listen for storage changes (when login happens in another component)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, [checkAuth]);

  const login = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('auth-change'));
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      window.dispatchEvent(new Event('auth-change'));
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
}

