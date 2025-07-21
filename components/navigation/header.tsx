"use client";

import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetencyLegendTrigger } from "../dashboard/competency-legend";
import { Logo } from "@/components/navigation/logo";
import Navigation from "@/components/navigation/menu";
import { useAuthStore } from "@/store/use-auth-store";
import { signOut } from "@/lib/auth/authService";

export function Header() {
  const isAdmin = useAuthStore((s) => s.role === "admin");
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    closeMobileMenu();
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <Navigation isAdmin={isAdmin} />
              <CompetencyLegendTrigger />
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-100"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex md:hidden items-center">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn && mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Navigation
              isAdmin={isAdmin}
              isMobile={true}
              onItemClick={closeMobileMenu}
            />
            <div className="px-3 py-2">
              <CompetencyLegendTrigger
                className="w-full justify-start"
                onClick={closeMobileMenu}
              />
            </div>
            <div className="px-3 py-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
