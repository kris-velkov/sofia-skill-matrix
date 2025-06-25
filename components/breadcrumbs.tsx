import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-600 dark:text-gray-400">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:text-gray-900 dark:hover:text-gray-50 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800 dark:text-gray-100">{item.label}</span>
            )}
            {index < items.length - 1 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400 dark:text-gray-600" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
