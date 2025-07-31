import { Users2, BarChart2, Bot, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";

const NAV_LINKS = [
  {
    href: "/admin",
    label: "Admin Panel",
    icon: <Settings className="h-4 w-4" />,
    permission: "isAdmin" as const,
  },
  {
    href: "/employees",
    label: "Manage Employees",
    icon: <Users2 className="h-4 w-4" />,
    permission: "canManageEmployees" as const,
  },
  {
    href: "/certificates-statistics",
    label: "Certificates Statistics",
    icon: <BarChart2 className="h-4 w-4" />,
    permission: "canViewStatistics" as const,
  },
  {
    href: "/ai-statistics",
    label: "AI Tools Statistics",
    icon: <Bot className="h-4 w-4" />,
    permission: "canViewStatistics" as const,
  },
];

type NavigationProps = {
  isMobile?: boolean;
  onItemClick?: () => void;
};

export function Navigation({ isMobile = false, onItemClick }: NavigationProps) {
  const pathname = usePathname();
  const canManageEmployees = useAuthStore((s) => s.canManageEmployees());
  const canViewStatistics = useAuthStore((s) => s.canViewStatistics());
  const isAdmin = useAuthStore((s) => s.isAdmin());

  const getPermissionCheck = (permission: string) => {
    switch (permission) {
      case "canManageEmployees":
        return canManageEmployees;
      case "canViewStatistics":
        return canViewStatistics;
      case "isAdmin":
        return isAdmin;
      default:
        return false;
    }
  };

  const visibleLinks = NAV_LINKS.filter(({ permission }) =>
    getPermissionCheck(permission)
  );

  if (visibleLinks.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {visibleLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={onItemClick}
            >
              <span className="mr-3">{icon}</span>
              {label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <nav className="flex items-center space-x-2">
      {visibleLinks.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Button
            key={href}
            variant={isActive ? "default" : "ghost"}
            asChild
            className={
              isActive
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "text-gray-700 hover:bg-gray-100"
            }
          >
            <Link href={href} className="flex items-center">
              <span className="mr-2">{icon}</span>
              {label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export default Navigation;
