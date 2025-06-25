import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import type { ReactNode } from "react";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
  separator?: ReactNode;
  maxItems?: number; // for ellipsis/overflow
}

export function Breadcrumbs({ items, separator, maxItems }: BreadcrumbsProps) {
  // Optionally collapse breadcrumbs if maxItems is set
  let displayItems = items;
  let showEllipsis = false;
  if (maxItems && items.length > maxItems) {
    displayItems = [
      ...items.slice(0, 1),
      { label: "...", href: undefined },
      ...items.slice(items.length - (maxItems - 1)),
    ];
    showEllipsis = true;
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayItems.map((item, idx) => (
          <>
            <BreadcrumbItem key={idx}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : item.label === "..." ? (
                <BreadcrumbEllipsis />
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < displayItems.length - 1 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
