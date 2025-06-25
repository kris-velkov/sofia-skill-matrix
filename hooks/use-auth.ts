"use client";

import { useState, useEffect, useCallback } from "react";

const AUTH_KEY = "skills_matrix_authenticated";
const ADMIN_KEY = "skills_matrix_is_admin"; // New key for admin status
const DUMMY_PASSWORD = "password123";
const ADMIN_PASSWORD = "admin123";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_KEY); // Read admin status

    if (storedAuth === "true") {
      setIsAuthenticated(true);
    } else {
    }

    if (storedAdmin === "true") {
      setIsAdmin(true);
    } else {
    }

    setIsLoading(false);
  }, []); // Empty dependency array means this runs once on mount

  const login = useCallback((password: string, rememberMe = true) => {
    // Add rememberMe parameter
    let success = false;
    let newIsAdmin = false;

    if (password === DUMMY_PASSWORD) {
      success = true;
      newIsAdmin = false;
      console.log("useAuth login: Regular password matched.");
    } else if (password === ADMIN_PASSWORD) {
      success = true;
      newIsAdmin = true;
    } else {
      return false;
    }

    if (success) {
      setIsAuthenticated(true);
      setIsAdmin(newIsAdmin);

      if (rememberMe) {
        localStorage.setItem(AUTH_KEY, "true");
        localStorage.setItem(ADMIN_KEY, newIsAdmin ? "true" : "false");
      } else {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(ADMIN_KEY);
      }
    }
    return success;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ADMIN_KEY); // Clear admin status on logout
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []); // No dependencies

  return { isAuthenticated, isAdmin, isLoading, login, logout };
}
