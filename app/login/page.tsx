import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login – Jakala Skill Matrix Dashboard",
  description: "Secure login to manage and visualize skills within Jakala.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function LoginPage() {
  return (
    <main
      className="flex items-center justify-center bg-gray-50"
      role="main"
      aria-labelledby="login-title"
    >
      <LoginForm />
    </main>
  );
}
