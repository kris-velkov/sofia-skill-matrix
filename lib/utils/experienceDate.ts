export function getExperienceFromDate(
  dateString: string | undefined
): string | undefined {
  if (!dateString) return "0y 0m 0d";

  const start = new Date(dateString);
  if (isNaN(start.getTime())) return "0y 0m 0d";

  const now = new Date();

  if (start > now) return "0y 0m 0d";

  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  const days = now.getDate() - start.getDate();

  const rdYears = years - (months < 0 || (months === 0 && days < 0) ? 1 : 0);
  const rdMonths = ((months + 12) % 12) - (days < 0 ? 1 : 0);
  const rdDays = (days + (days < 0 ? 30 : 0)) % 31;

  return `${rdYears}y ${rdMonths}m ${rdDays}d`;
}
