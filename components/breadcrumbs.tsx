import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { Fragment, type ReactNode } from "react";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
  separator?: ReactNode;
  maxItems?: number;
}

export function Breadcrumbs({ items, separator, maxItems }: BreadcrumbsProps) {
  let displayItems = items;
  if (maxItems && items.length > maxItems) {
    displayItems = [
      ...items.slice(0, 1),
      { label: "...", href: undefined },
      ...items.slice(items.length - (maxItems - 1)),
    ];
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayItems.map((item, idx) => (
          <Fragment key={idx}>
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
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
