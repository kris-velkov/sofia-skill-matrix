"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore, UserRole } from "@/store/use-auth-store";
import { BarChart, Eye, EyeOff, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/app/actions/auth-action";
import { ProgramValue } from "@/types/programs";

export function LoginFormSupabase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (isLoggedIn && !redirecting) {
      setRedirecting(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  }, [isLoggedIn, redirecting]);

  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || redirecting) return;
    setError("");
    setLoading(true);

    try {
      const { success, user, error } = await signInWithEmail(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      if (!success || !user) {
        setError("User data not found");
        return;
      }

      const authUser = {
        id: user.id,
        email: user.email,
        user_metadata: {
          role: user.role as UserRole,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          program: (user.program as ProgramValue) || null,
        },
      };

      const employeeData = {
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        program: (user.program as ProgramValue) || null,
        skills: [],
      };

      login(authUser, employeeData);

      setRedirecting(true);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  if (!hydrated) {
    return <LoadingSpinner />;
  }

  if (isLoggedIn && !redirecting) {
    return (
      <div className="flex md:min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-700">
              You are already logged in. Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-700">
        <BarChart className="h-20 w-20 text-white mb-6" strokeWidth={2.5} />
        <span className="text-4xl font-extrabold text-white drop-shadow-lg">
          Skill-Matrix Dashboard
        </span>
        <p className="mt-4 text-lg text-white max-w-xs text-center">
          Streamline skill tracking, evaluation, and development for your team.
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">Sign In</h1>
            <p className="text-gray-500 mt-4">
              Enter your credentials to access the dashboard.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-base font-medium text-gray-700"
              >
                Email<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  autoComplete="email"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-base font-medium text-gray-700"
              >
                Password<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  aria-describedby={error ? "password-error" : undefined}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 mt-2" id="password-error">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow curson-pointer"
              disabled={loading || redirecting}
            >
              {loading
                ? "Signing In..."
                : redirecting
                ? "Redirecting..."
                : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
