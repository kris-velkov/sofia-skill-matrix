"use client";

import * as React from "react";
import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils/cn";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
  spinnerVariant?: "default" | "dots" | "pulse" | "bars" | "ring";
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  children,
  text = "Loading...",
  className,
  spinnerVariant = "ring",
  blur = true,
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center z-10",
            blur ? "bg-white/80 backdrop-blur-sm" : "bg-white/90"
          )}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <LoadingSpinner size="lg" variant={spinnerVariant} text={text} />
          </div>
        </div>
      )}
    </div>
  );
}
