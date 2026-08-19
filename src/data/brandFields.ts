export interface BrandConfig {
  label: string;
  subCategories: string[];
  commonModels: string[];
}

// Add/edit brands here — the fields box below the dropdown is generated
// from whichever brand is selected, so new brands need no other code changes.
export const KEYBOARD_BRANDS: Record<string, BrandConfig> = {
  yamaha: {
    label: "Yamaha",
    subCategories: ["Portable Keyboard", "Arranger Workstation", "Digital Piano", "Synthesizer"],
    commonModels: ["PSR-E373", "PSR-EW310", "PSR-I500", "PSR-2100", "Genos", "Tyros 5"],
  },
  casio: {
    label: "Casio",
    subCategories: ["Portable Keyboard", "Digital Piano", "CDP Series", "Privia"],
    commonModels: ["CTK-3500", "CT-X700", "CDP-135", "PX-160", "Privia PX-S1100"],
  },
  roland: {
    label: "Roland",
    subCategories: ["Arranger Keyboard", "Digital Piano", "Synthesizer", "Stage Piano"],
    commonModels: ["BK-3", "FP-30X", "Juno-DS", "RD-88"],
  },
  korg: {
    label: "Korg",
    subCategories: ["Arranger Workstation", "Synthesizer", "Digital Piano"],
    commonModels: ["Pa700", "Pa900", "Krome", "B2"],
  },
  other: {
    label: "Other / Not Listed",
    subCategories: ["Portable Keyboard", "Digital Piano", "Synthesizer"],
    commonModels: [],
  },
};

export const BRAND_OPTIONS = Object.entries(KEYBOARD_BRANDS).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

/**
 * Resolves the brand text that should actually be shown on the invoice
 * preview/PDF. When the admin picked "Other / Not Listed" and typed a
 * custom brand name, that typed value is used instead of the raw
 * "other" key or its generic label.
 */
export function getBrandDisplayLabel(brand: string, customBrandName: string): string {
  if (!brand) return "";
  if (brand === "other") return customBrandName.trim() || "Other / Not Listed";
  return KEYBOARD_BRANDS[brand]?.label ?? brand;
}
