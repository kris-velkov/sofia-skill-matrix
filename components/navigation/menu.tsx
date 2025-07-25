import { Users2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    href: "/employees",
    label: "Manage Employees",
    icon: <Users2 className="h-4 w-4" />,
  },
  {
    href: "/statistics",
    label: "Certificates Statistics",
    icon: <BarChart2 className="h-4 w-4" />,
  },
];

type NavigationProps = {
  isAdmin: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
};

export function Navigation({
  isAdmin,
  isMobile = false,
  onItemClick,
}: NavigationProps) {
  const pathname = usePathname();

  if (!isAdmin) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        {NAV_LINKS.map(({ href, label, icon }) => {
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
      {NAV_LINKS.map(({ href, label, icon }) => {
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
