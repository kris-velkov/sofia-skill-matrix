import React from "react";
import Image from "next/image";

interface EmployeeCardSocialLinkProps {
  url: string;
  name: string;
}
export function EmployeeCardSocialLink({
  url,
  name,
}: Readonly<EmployeeCardSocialLinkProps>) {
  return (
    <div className="mt-5 pt-5 border-t border-gray-200 flex items-center justify-center cursor-pointer  transition-colors">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.open(url, "_blank", "noopener,noreferrer");
        }}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700  text-sm font-medium focus:outline-none cursor-pointer"
        aria-label={`View on LinkedIn`}
      >
        <div className="relative h-5 w-5">
          <Image
            src="/linkedin-logo.webp"
            alt="LinkedIn logo"
            fill
            sizes="30px"
            className="object-contain"
            priority
          />
        </div>
        View on LinkedIn
      </button>
    </div>
  );
}
