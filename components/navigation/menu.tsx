import { Users2, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  {
    href: "/employees",
    label: "Manage Employees",
    icon: <Users2 className="mr-2 h-4 w-4" />,
  },
  {
    href: "/statistics",
    label: "Certificates Statistics",
    icon: <BarChart2 className="mr-2 h-4 w-4" />,
  },
];

type NavigationProps = {
  isAdmin: boolean;
};

export function Navigation({ isAdmin }: NavigationProps) {
  return (
    <nav className="flex items-center gap-2">
      {isAdmin &&
        NAV_LINKS.map(({ href, label, icon }) => (
          <Button
            key={href}
            variant="ghost"
            asChild
            className="text-gray-700 hover:bg-gray-100"
          >
            <Link href={href} className="flex items-center">
              {icon}
              {label}
            </Link>
          </Button>
        ))}
    </nav>
  );
}

export default Navigation;
