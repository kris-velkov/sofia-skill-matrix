import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorDisplayProps {
  message?: string;
  title?: string;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message = "Please try again later.",
}: Readonly<ErrorDisplayProps>) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
