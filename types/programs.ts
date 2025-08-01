import { Database } from "./supabase";

export type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
export type ProgramInsert = Database["public"]["Tables"]["programs"]["Insert"];
export type ProgramUpdate = Database["public"]["Tables"]["programs"]["Update"];

export interface Program extends Record<string, unknown> {
  id: number;
  label: string;
  value: string;
  order_index: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProgramFormData {
  label: string;
  value: string;
  orderIndex?: number;
}

export type ProgramValue = string | "all" | null;
