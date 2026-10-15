import convert from 'color-convert';

/**
 * Converts a hex code to CIELAB coordinates.
 * @param hex A valid hex code, e.g. "#FF0000" or "FF0000"
 * @returns { l, a, b } object or null if invalid
 */
export const hexToLab = (hex: string): { l: number; a: number; b: number } | null => {
  try {
    const cleanHex = hex.replace('#', '');
    const [l, a, b] = convert.hex.lab(cleanHex);
    return { l, a, b };
  } catch (error) {
    console.error('Failed to convert hex to LAB:', hex, error);
    return null;
  }
};
