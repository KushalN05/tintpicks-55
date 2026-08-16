/**
 * Fashion-First Color Math Utility
 */

export const hexToHsl = (hex: string): [number, number, number] => {
  // Remove #
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

export const getMonochromaticColors = (hex: string, count: number = 3): string[] => {
  const [h, s, l] = hexToHsl(hex);
  const colors: string[] = [];
  const step = 80 / (count + 1);
  for (let i = 1; i <= count + 1; i++) {
    const newL = Math.max(10, Math.min(90, 10 + (i * step)));
    if (Math.abs(newL - l) > 5) {
      colors.push(hslToHex(h, s, newL));
    }
  }
  return colors.slice(0, count);
};

export const getAnalogousColors = (hex: string): string[] => {
  const [h, s, l] = hexToHsl(hex);
  const colors: string[] = [];
  const step = 30;
  const offsets = [-1, 1];
  for (const offset of offsets) {
    const newH = (h + (offset * step) + 360) % 360;
    colors.push(hslToHex(newH, s, l));
  }
  return colors;
};

export const getComplementaryColor = (hex: string): string => {
  const [h, s, l] = hexToHsl(hex);
  const newH = (h + 180) % 360;
  return hslToHex(newH, s, l);
};

export const getTriadicColors = (hex: string): string[] => {
  const [h, s, l] = hexToHsl(hex);
  const colors: string[] = [];
  const step = 120;
  const offsets = [1, 2];
  for (const offset of offsets) {
    const newH = (h + (offset * step) + 360) % 360;
    colors.push(hslToHex(newH, s, l));
  }
  return colors;
};

export const getFashionNeutrals = (): string[] => {
  return [
    "#2F4F4F", // Dark Slate Gray
    "#1C2833", // Navy Dark
    "#F5F5DC", // Beige
    "#FFFFFF"  // White
  ];
};

/**
 * Returns a single array of fashion colors based on analogous, monochromatic,
 * triadic, complementary, and neutrals.
 */
export const generateFashionPalette = (baseHex: string): string[] => {
  const monochromatic = getMonochromaticColors(baseHex);
  const analogous = getAnalogousColors(baseHex);
  const triadic = getTriadicColors(baseHex);
  const complementary = getComplementaryColor(baseHex);
  const neutrals = getFashionNeutrals();

  const allColors = [
    ...monochromatic,
    ...analogous,
    ...triadic,
    complementary,
    ...neutrals
  ];
  
  // Deduplicate
  return [...new Set(allColors)];
};
