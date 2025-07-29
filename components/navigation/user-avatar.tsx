"use client";

import { User, LogOut, ChevronDown, Mail } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { signOut } from "@/lib/auth/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserAvatar() {
  const user = useAuthStore((s) => s.user);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center h-8 px-2 text-slate-700 hover:bg-gray-100 hover:text-slate-900 rounded-lg transition-colors duration-200"
        >
          <User className="h-2.5 w-2.5 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-1"
      >
        <DropdownMenuLabel className="font-normal p-0 mb-2">
          <div className="flex items-center gap-2 p-1 mx-1 mt-1">
            <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <Mail className="h-2 w-2 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-slate-200" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 rounded-lg mx-1 transition-colors duration-200"
        >
          <LogOut className="mr-2 h-3 w-3" />
          <span className="text-xs font-medium">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
