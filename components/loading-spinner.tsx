import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 text-primary">
      <Loader2 className="h-10 w-10 animate-spin" />
      <span className="text-lg font-medium animate-pulse">Loading, please wait...</span>
    </div>
  );
}
