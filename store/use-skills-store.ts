import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Employee } from "@/lib/types"

export interface FilterState {
  selectedEmployees: Employee["id"][]
  selectedDepartment: string | null
  selectedSkillCategory: string | null
  selectedSkills: string[]
  minimumSkillLevel: number | null
}

interface SkillsState {
  filterState: FilterState
  setFilterState: (partial: Partial<FilterState>) => void
  clearFilters: () => void
}

const DEFAULT_FILTER_STATE: FilterState = {
  selectedEmployees: [],
  selectedDepartment: null,
  selectedSkillCategory: null,
  selectedSkills: [],
  minimumSkillLevel: null,
}

export const useSkillsStore = create<SkillsState>()(
  persist(
    (set, get) => ({
      filterState: DEFAULT_FILTER_STATE,

      setFilterState: (partial) =>
        set((state) => ({
          filterState: { ...state.filterState, ...partial },
        })),

      clearFilters: () => set({ filterState: DEFAULT_FILTER_STATE }),
    }),
    { name: "skills-store" },
  ),
)
