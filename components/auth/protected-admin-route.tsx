"use client";
import { useAuthStore } from "@/store/use-auth-store";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../loading-spinner";

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

export default function ProtectedAdminRoute({
  children,
}: Readonly<ProtectedAdminRouteProps>) {
  const isAdmin = useAuthStore((state) => state.role == "admin");
  const hydrated = useAuthStore((s) => s.hydrated);

  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isAdmin) {
      router.replace("/");
    }
  }, [hydrated, isAdmin, router]);

  if (!hydrated) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
