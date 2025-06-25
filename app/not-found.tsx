import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-center p-4">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">404 - Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Could not find the requested resource.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
