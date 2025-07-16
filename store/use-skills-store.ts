import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Employee, SkillLevel } from "@/types/employees";

export interface FilterState {
  selectedEmployees: Employee["id"][];
  selectedDepartment: string | null;
  selectedSkillCategory: string | null;
  selectedSkills: string[];
  minimumSkillLevel: SkillLevel | null;
}

interface SkillsState {
  filterState: FilterState;
  setFilterState: (partial: Partial<FilterState>) => void;
  clearFilters: () => void;
}

const DEFAULT_FILTER_STATE: FilterState = {
  selectedEmployees: [],
  selectedDepartment: null,
  selectedSkillCategory: null,
  selectedSkills: [],
  minimumSkillLevel: null,
};

export const useSkillsStore = create<SkillsState>()(
  persist(
    (set) => ({
      filterState: DEFAULT_FILTER_STATE,

      setFilterState: (partial) =>
        set((state) => ({
          filterState: { ...state.filterState, ...partial },
        })),

      clearFilters: () => set({ filterState: DEFAULT_FILTER_STATE }),
    }),
    { name: "skills-store" }
  )
);
