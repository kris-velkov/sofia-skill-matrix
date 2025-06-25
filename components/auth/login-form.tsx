"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { BarChart2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(password);
    if (success) {
      console.log(
        "LoginForm handleSubmit: Login successful! (useAuth hook updated)"
      );
    } else {
      setError("Invalid password. Please try again.");
      console.log("LoginForm handleSubmit: Login failed: Invalid password.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-login-text-dark">Sign In</h1>
            <p className="text-gray-500">Enter your password to sign in!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password">Password*</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

            <Button
              type="submit"
              className="w-full rounded-lg bg-login-button-blue py-2 text-white hover:bg-login-button-blue/90"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {/* Hide this section on small screens, show on lg and up */}
      <div className="relative hidden flex-1 flex-col items-center justify-center p-8 lg:flex">
        <Image src="/login-bg.png" alt="Login background" fill priority />
        <div className="relative z-10 text-center text-login-text-light">
          <div className="mb-4 flex items-center justify-center">
            <BarChart2 className="h-12 w-12 text-white" color="white" />
            <span className="ml-2 text-4xl font-bold text-white">
              Skill-Matrix Dashboard
            </span>
          </div>
          <p className="text-lg text-white">by Kristiyan Velkov</p>
        </div>
      </div>
    </div>
  );
}
