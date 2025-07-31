"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/logo";
import Navigation from "@/components/navigation/menu";
import { UserAvatar } from "@/components/navigation/user-avatar";
import { useAuthStore } from "@/store/use-auth-store";
import CompetencyLegendTrigger from "../dashboard/competency-level-trigger";

export function Header() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <Navigation />
              <CompetencyLegendTrigger />
              <UserAvatar />
            </div>
          )}

          {isLoggedIn && (
            <div className="flex md:hidden items-center gap-1">
              <CompetencyLegendTrigger />
              <UserAvatar />
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
            <Navigation isMobile={true} onItemClick={closeMobileMenu} />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
