"use client";

import { useState, useEffect, useCallback } from "react";

const AUTH_KEY = "skills_matrix_authenticated";
const ADMIN_KEY = "skills_matrix_is_admin";
const DUMMY_PASSWORD = "password123";
const ADMIN_PASSWORD = "admin123";

interface UseAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (password: string, rememberMe?: boolean) => boolean;
  logout: () => void;
}

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function safeSetItem(key: string, value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function safeRemoveItem(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function useAuth(): UseAuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = safeGetItem(AUTH_KEY);
    const storedAdmin = safeGetItem(ADMIN_KEY);

    setIsAuthenticated(storedAuth === "true");
    setIsAdmin(storedAdmin === "true");
    setIsLoading(false);
  }, []);

  const login = useCallback((password: string, rememberMe = true): boolean => {
    let isAdminUser = false;

    if (password === DUMMY_PASSWORD) {
      isAdminUser = false;
    } else if (password === ADMIN_PASSWORD) {
      isAdminUser = true;
    } else {
      return false;
    }

    setIsAuthenticated(true);
    setIsAdmin(isAdminUser);

    if (rememberMe) {
      safeSetItem(AUTH_KEY, "true");
      safeSetItem(ADMIN_KEY, isAdminUser ? "true" : "false");
    } else {
      safeRemoveItem(AUTH_KEY);
      safeRemoveItem(ADMIN_KEY);
    }

    return true;
  }, []);

  const logout = useCallback(() => {
    safeRemoveItem(AUTH_KEY);
    safeRemoveItem(ADMIN_KEY);
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  return { isAuthenticated, isAdmin, isLoading, login, logout };
}
