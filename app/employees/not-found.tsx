import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 text-center p-4">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Employee Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The employee you are looking for could not be found.
      </p>
      <Link href="/employees">
        <Button>Back to Employees List</Button>
      </Link>
    </div>
  )
}
