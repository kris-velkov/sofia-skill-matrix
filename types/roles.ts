import { Database } from "./supabase";

export type RoleRow = Database["public"]["Tables"]["roles"]["Row"];
export type RoleInsert = Database["public"]["Tables"]["roles"]["Insert"];
export type RoleUpdate = Database["public"]["Tables"]["roles"]["Update"];

export interface Role extends Record<string, unknown> {
  id: number;
  name: string;
  departament: string;
  roleId: string;
  order_index: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface RoleFormData {
  name: string;
  departament: string;
  roleId: string;
  orderIndex?: number;
}
