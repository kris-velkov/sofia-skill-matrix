import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel – Jakala Skill Matrix",
  description:
    "Administrative interface for managing users, categories, and AI tools.",
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

export default function AdminPage() {
  const breadcrumbItems = [{ label: "Admin Panel" }];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        </div>

        <AdminDashboard />
      </div>
    </section>
  );
}
