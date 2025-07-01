"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetencyLegendTrigger } from "../dashboard/competency-legend";
import { Logo } from "@/components/navigation/logo";
import Navigation from "@/components/navigation/menu";
import { useAuthStore } from "@/store/use-auth-store";

export function Header() {
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.role === "admin");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
      <Logo />
      {useAuthStore((s) => s.isLoggedIn) && (
        <nav className="flex items-center gap-2">
          <Navigation isAdmin={isAdmin} />
          <CompetencyLegendTrigger />
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      )}
    </header>
  );
}

export default Header;
