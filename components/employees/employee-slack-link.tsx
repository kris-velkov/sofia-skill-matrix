import React from "react";
import Image from "next/image";

interface EmployeeSlackLinkProps {
  slackUrl: string;
  name: string;
}
export function EmployeeSlackLink({ slackUrl, name }: EmployeeSlackLinkProps) {
  return (
    <div className="mt-5 pt-5 border-t border-gray-200 flex items-center justify-center cursor-pointer  transition-colors">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.open(slackUrl, "_blank", "noopener,noreferrer");
        }}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700  text-sm font-medium focus:outline-none cursor-pointer"
        aria-label={`Connect with ${name} on Slack`}
      >
        <div className="relative h-5 w-5">
          <Image
            src="/slack-logo.webp"
            alt="Slack logo"
            fill
            sizes="20px"
            className="object-contain"
            priority
          />
        </div>
        Connect on Slack
      </button>
    </div>
  );
}
