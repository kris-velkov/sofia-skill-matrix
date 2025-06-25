// Bring the constant in and re-export it so downstream imports keep working.
// Doing it this way avoids an unresolved module-specifier error in the browser.
import { COMPETENCY_LEVELS as _COMPETENCY_LEVELS } from "./employees-data"

export const COMPETENCY_LEVELS = _COMPETENCY_LEVELS

// Career-experience presets for the “Add / Edit Employee” forms.
export const CAREER_EXPERIENCE_LEVELS = ["0-1y", "1-3y", "3-5y", "5-10y", "10y+"] as const
