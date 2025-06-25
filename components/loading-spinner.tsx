// components/loading-spinner.tsx
import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px] text-primary">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
