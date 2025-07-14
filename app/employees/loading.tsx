import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeesLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-44" />
          </div>
          <Skeleton className="h-5 w-80" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-20 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
