import Image from "next/image";

interface EmployeeAvatarProps {
  src: string | null | undefined;
  alt: string;
}

export function EmployeeAvatar({ src, alt }: Readonly<EmployeeAvatarProps>) {
  return (
    <div className="h-12 w-12 min-w-[48px] min-h-[48px] relative flex-shrink-0 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-md overflow-hidden bg-gray-100 dark:bg-gray-700">
      <Image
        src={src || "/placeholder-user.png"}
        alt={alt ?? "Employee profile image"}
        fill
        className="rounded-full object-cover"
        sizes="48px"
        loading="lazy"
        priority={false}
      />
    </div>
  );
}
