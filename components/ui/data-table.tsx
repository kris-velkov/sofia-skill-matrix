"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TableLoadingSpinner } from "./loading-spinner";
import { Search } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKeys = [],
  emptyState,
  className = "",
  loading = false,
  loadingText = "Loading data...",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data;

    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchKeys]);

  return (
    <div className={`space-y-4 ${className}`}>
      {searchKeys.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Badge className="px-3 py-1 bg-blue-200">
            {filteredData.length} {filteredData.length === 1 ? "item" : "items"}
          </Badge>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-500 border-b border-gray-200">
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={`font-semibold text-white ${
                      column.className || ""
                    }`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    <TableLoadingSpinner text={loadingText} />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-12"
                  >
                    {emptyState ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-gray-300">{emptyState.icon}</div>
                        <div>
                          <p className="text-gray-500 font-medium">
                            {emptyState.title}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {emptyState.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No data available</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-100 border-gray-200 transition-colors"
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={column.className || ""}
                      >
                        {column.cell
                          ? column.cell(item)
                          : String(item[column.key] || "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
