"use client";
import { useAuthStore } from "@/store/use-auth-store";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

type RequireAdminProps = {
  children: ReactNode;
};

export default function RequireAdmin({ children }: RequireAdminProps) {
  const isAdmin = useAuthStore((state) => state.role == "admin");
  const router = useRouter();

  console.log("RequireAdmin rendered, isAdmin:", isAdmin);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
