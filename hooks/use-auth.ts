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
    console.log(
      "useAuth useEffect: Checking localStorage for auth status on mount."
    );
    const storedAuth = localStorage.getItem(AUTH_KEY);
    const storedAdmin = localStorage.getItem(ADMIN_KEY); // Read admin status

    if (storedAuth === "true") {
      setIsAuthenticated(true);
      console.log(
        "useAuth useEffect: Found 'true' in localStorage. Setting isAuthenticated to true."
      );
    } else {
      console.log(
        "useAuth useEffect: No 'true' found in localStorage. isAuthenticated remains false."
      );
    }

    if (storedAdmin === "true") {
      setIsAdmin(true);
      console.log(
        "useAuth useEffect: Found 'true' for admin status. Setting isAdmin to true."
      );
    } else {
      console.log(
        "useAuth useEffect: No 'true' for admin status. isAdmin remains false."
      );
    }

    setIsLoading(false);
    console.log(
      "useAuth useEffect: Initial loading complete. isLoading set to false."
    );
  }, []); // Empty dependency array means this runs once on mount

  const login = useCallback((password: string, rememberMe = true) => {
    // Add rememberMe parameter
    console.log("useAuth login: Attempting login with provided password.");
    let success = false;
    let newIsAdmin = false;

    if (password === DUMMY_PASSWORD) {
      success = true;
      newIsAdmin = false;
      console.log("useAuth login: Regular password matched.");
    } else if (password === ADMIN_PASSWORD) {
      success = true;
      newIsAdmin = true;
      console.log("useAuth login: Admin password matched.");
    } else {
      console.log("useAuth login: Password mismatch. Login failed.");
      return false;
    }

    if (success) {
      setIsAuthenticated(true);
      setIsAdmin(newIsAdmin);

      if (rememberMe) {
        localStorage.setItem(AUTH_KEY, "true");
        localStorage.setItem(ADMIN_KEY, newIsAdmin ? "true" : "false");
        console.log("useAuth login: Session saved to localStorage.");
      } else {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(ADMIN_KEY);
        console.log("useAuth login: Session NOT saved to localStorage.");
      }
    }
    return success;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ADMIN_KEY); // Clear admin status on logout
    setIsAuthenticated(false);
    setIsAdmin(false);
    console.log(
      "useAuth logout: User logged out. isAuthenticated and isAdmin set to false."
    );
  }, []); // No dependencies

  return { isAuthenticated, isAdmin, isLoading, login, logout };
}
