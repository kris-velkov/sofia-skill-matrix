"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse" | "bars" | "ring";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const DefaultSpinner = ({
  size,
  className,
}: {
  size: string;
  className?: string;
}) => (
  <div
    className={cn(
      "animate-spin rounded-full border-2 border-gray-200 border-t-blue-600",
      size,
      className
    )}
  />
);

const DotsSpinner = ({
  size,
  className,
}: {
  size: string;
  className?: string;
}) => {
  const dotSize =
    size === "w-4 h-4"
      ? "w-1 h-1"
      : size === "w-6 h-6"
      ? "w-1.5 h-1.5"
      : size === "w-8 h-8"
      ? "w-2 h-2"
      : "w-3 h-3";

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("bg-blue-600 rounded-full animate-bounce", dotSize)}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
};

const PulseSpinner = ({
  size,
  className,
}: {
  size: string;
  className?: string;
}) => (
  <div className={cn("relative", size, className)}>
    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75" />
    <div className="relative bg-blue-600 rounded-full w-full h-full animate-pulse" />
  </div>
);

const BarsSpinner = ({
  size,
  className,
}: {
  size: string;
  className?: string;
}) => {
  const barHeight =
    size === "w-4 h-4"
      ? "h-3"
      : size === "w-6 h-6"
      ? "h-4"
      : size === "w-8 h-8"
      ? "h-6"
      : "h-8";
  const barWidth =
    size === "w-4 h-4" ? "w-0.5" : size === "w-6 h-6" ? "w-0.5" : "w-1";

  return (
    <div className={cn("flex items-end space-x-0.5", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn("bg-blue-600 animate-pulse", barWidth, barHeight)}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
            transform: `scaleY(${
              0.4 + (Math.sin(Date.now() / 200 + i) + 1) * 0.3
            })`,
          }}
        />
      ))}
    </div>
  );
};

const RingSpinner = ({
  size,
  className,
}: {
  size: string;
  className?: string;
}) => (
  <div className={cn("relative", size, className)}>
    <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" />
  </div>
);

export function LoadingSpinner({
  size = "md",
  variant = "default",
  className,
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size];
  const textSizeClass = textSizeClasses[size];

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return <DotsSpinner size={sizeClass} className={className} />;
      case "pulse":
        return <PulseSpinner size={sizeClass} className={className} />;
      case "bars":
        return <BarsSpinner size={sizeClass} className={className} />;
      case "ring":
        return <RingSpinner size={sizeClass} className={className} />;
      default:
        return <DefaultSpinner size={sizeClass} className={className} />;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderSpinner()}
      {text && (
        <span className={cn("text-gray-600 font-medium", textSizeClass)}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

// Specialized loading components for common use cases
export function TableLoadingSpinner({
  text = "Loading data...",
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" variant="ring" text={text} />
    </div>
  );
}

export function ButtonLoadingSpinner({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <LoadingSpinner size={size} variant="default" className="text-current" />
  );
}

export function PageLoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="xl" variant="ring" text={text} />
    </div>
  );
}

export function InlineLoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" variant="default" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}
