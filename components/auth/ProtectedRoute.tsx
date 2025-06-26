"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ProtectedRoute({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
    if (isLoggedIn && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, pathname, router, hydrated]);

  if (!hydrated) {
    return <LoadingSpinner />;
  }
  if (!isLoggedIn && pathname !== "/login") {
    return null;
  }
  return <>{children}</>;
}
