/**
 * Generates an authentic, human-readable order number
 * Format: TS-2026-XXXX (e.g., TS-2026-8492)
 */
export const generateOrderId = (): string => {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TS-${currentYear}-${randomSuffix}`;
};
