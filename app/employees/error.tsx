"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-center p-4">
      <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Error Loading Employees!</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        {error.message || "An unexpected error occurred while loading employee data."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
