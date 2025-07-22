"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmployeeAvatarProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function EmployeeAvatar({ src, alt, className }: EmployeeAvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center",
        className || "h-10 w-10"
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 40px, 40px"
          className="object-cover"
        />
      ) : (
        <User className="h-5 w-5 text-gray-500" />
      )}
    </div>
  );
}
