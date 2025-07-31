export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface EmptyState {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const createEmptyState = (
  icon: React.ReactNode,
  title: string,
  description: string
): EmptyState => ({
  icon,
  title,
  description,
});

export const getSearchKeys = <T extends Record<string, unknown>>(
  searchableFields: (keyof T)[]
): (keyof T)[] => {
  return searchableFields;
};

export const formatTableData = <T extends Record<string, unknown>>(
  data: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] => {
  if (!searchTerm || searchKeys.length === 0) return data;

  return data.filter((item) =>
    searchKeys.some((key) =>
      String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

export const createTableConfig = <T extends Record<string, unknown>>(config: {
  columns: TableColumn<T>[];
  searchKeys: (keyof T)[];
  emptyState: EmptyState;
  searchPlaceholder?: string;
}) => ({
  ...config,
  searchPlaceholder: config.searchPlaceholder || "Search...",
});
