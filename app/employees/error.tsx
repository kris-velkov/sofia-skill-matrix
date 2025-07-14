"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <section
      role="alert"
      aria-labelledby="error-title"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-6 text-center"
    >
      <div className="max-w-md w-full space-y-6">
        <h1
          id="error-title"
          className="text-4xl font-bold text-red-600 dark:text-red-400"
        >
          Error Loading Employees
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {error.message ||
            "An unexpected error occurred while loading employee data."}
        </p>
        <Button
          onClick={reset}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Try again
        </Button>
      </div>
    </section>
  );
}
