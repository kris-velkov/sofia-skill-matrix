"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h2 className="text-4xl font-bold text-red-600 mb-4">
        Error Loading Employees!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        There was an error loading the employees. Please try again later.
      </p>
      <Link href="/employees">
        <Button>Return to Employees</Button>
      </Link>
    </div>
  );
}
