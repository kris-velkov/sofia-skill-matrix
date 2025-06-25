import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingEmployeeProfile() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6 mt-6">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 w-full">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4 mb-2" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
