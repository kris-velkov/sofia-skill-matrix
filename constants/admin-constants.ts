export const ADMIN_ROUTES = {
  USERS: "/admin/users",
  CATEGORIES: "/admin/categories",
  AI_TOOLS: "/admin/ai-tools",
} as const;

export const LOADING_MESSAGES = {
  USERS: "Loading users...",
  CATEGORIES: "Loading categories...",
  AI_TOOLS: "Loading AI tools...",
  SAVING: "Saving...",
  DELETING: "Deleting...",
  UPDATING: "Updating...",
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  CATEGORY_CREATED: "Category created successfully",
  CATEGORY_UPDATED: "Category updated successfully",
  CATEGORY_DELETED: "Category deleted successfully",
  AI_TOOL_CREATED: "AI tool created successfully",
  AI_TOOL_UPDATED: "AI tool updated successfully",
  AI_TOOL_DELETED: "AI tool deleted successfully",
} as const;

export const ERROR_MESSAGES = {
  LOAD_USERS_FAILED: "Failed to load users",
  LOAD_CATEGORIES_FAILED: "Failed to load categories",
  LOAD_AI_TOOLS_FAILED: "Failed to load AI tools",
  SAVE_USER_FAILED: "Failed to save user",
  SAVE_CATEGORY_FAILED: "Failed to save category",
  SAVE_AI_TOOL_FAILED: "Failed to save AI tool",
  DELETE_USER_FAILED: "Failed to delete user",
  DELETE_CATEGORY_FAILED: "Failed to delete category",
  DELETE_AI_TOOL_FAILED: "Failed to delete AI tool",
} as const;

export const DIALOG_TITLES = {
  CREATE_USER: "Create New User",
  EDIT_USER: "Edit User Permissions",
  DELETE_USER: "Delete User",
  CREATE_CATEGORY: "Create New Category",
  EDIT_CATEGORY: "Edit Category",
  DELETE_CATEGORY: "Delete Category",
  CREATE_AI_TOOL: "Create New AI Tool",
  EDIT_AI_TOOL: "Edit AI Tool",
  DELETE_AI_TOOL: "Delete AI Tool",
} as const;

export const SEARCH_PLACEHOLDERS = {
  USERS: "Search users...",
  CATEGORIES: "Search categories...",
  AI_TOOLS: "Search AI tools...",
} as const;

export const EMPTY_STATE_MESSAGES = {
  NO_USERS: "No users found",
  NO_CATEGORIES: "No categories found",
  NO_AI_TOOLS: "No AI tools found",
  NO_SEARCH_RESULTS: "No results match your search criteria",
  CREATE_FIRST_CATEGORY: "Create your first category to get started",
  CREATE_FIRST_AI_TOOL: "Create your first AI tool to get started",
} as const;
