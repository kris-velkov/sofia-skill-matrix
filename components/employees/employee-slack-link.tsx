import React from "react";
import { Slack } from "lucide-react";

interface EmployeeSlackLinkProps {
  slackUrl: string;
  name: string;
}
export function EmployeeSlackLink({ slackUrl, name }: EmployeeSlackLinkProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.open(slackUrl, "_blank", "noopener,noreferrer");
        }}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium focus:outline-none"
        aria-label={`Connect with ${name} on Slack`}
      >
        <Slack className="h-4 w-4" />
        Connect on Slack
      </button>
    </div>
  );
}
