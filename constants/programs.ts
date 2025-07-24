export const PROGRAMS = [
  { value: "sirius", label: "Sirius" },
  { value: "mars", label: "Mars" },
  { value: "polaris", label: "Polaris" },
  { value: "titan", label: "Titan" },
  { value: "venus", label: "Venus" },
  { value: "voyager", label: "Voyager" },
  { value: "zenith", label: "Zenith" },
] as const;

export type ProgramValue = (typeof PROGRAMS)[number]["value"];
