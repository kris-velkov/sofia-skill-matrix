"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  /** `reset` is provided by Next.js when the component is rendered as a route-level error boundary. */
  reset?: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h2 className="text-4xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button
        onClick={() => {
          // If Next.js injected `reset`, use it. Otherwise do a hard reload.
          if (typeof reset === "function") {
            reset();
          } else {
            window.location.reload();
          }
        }}
      >
        Try again
      </Button>
    </div>
  );
}
