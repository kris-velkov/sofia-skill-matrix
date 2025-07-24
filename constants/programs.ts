export const PROGRAMS = [
  { value: "sirius", label: "Sirius" },
  { value: "vega", label: "Vega" },
  { value: "orion", label: "Orion" },
  { value: "apollo", label: "Apollo" },
  { value: "phoenix", label: "Phoenix" },
  { value: "atlas", label: "Atlas" },
  { value: "nova", label: "Nova" },
  { value: "titan", label: "Titan" },
  { value: "cosmos", label: "Cosmos" },
  { value: "stellar", label: "Stellar" },
] as const;

export type ProgramValue = (typeof PROGRAMS)[number]["value"];
