import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <Image
        src="/jakala-logo.webp"
        alt="JAKALA Logo"
        width={130}
        height={54}
        priority
      />
    </Link>
  );
}
