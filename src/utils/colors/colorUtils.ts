
interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

const hexToHSL = (hex: string): ColorHSL => {
  // Convert hex to RGB first
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
};

const getLightnessModifier = (l: number): string => {
  if (l > 80) return "Light ";
  if (l < 30) return "Dark ";
  return "";
};

export const getEnhancedColorName = (hex: string, baseName: string): string => {
  const { l } = hexToHSL(hex);
  const modifier = getLightnessModifier(l);
  
  // Remove any existing lightness modifiers to prevent duplication
  const baseNameWithoutModifier = baseName
    .replace(/^Light\s+/i, '')
    .replace(/^Dark\s+/i, '');
  
  return modifier + baseNameWithoutModifier;
};

// For debugging
export const getColorAnalysis = (hex: string): {hsl: ColorHSL, analysis: string} => {
  const hsl = hexToHSL(hex);
  return {
    hsl,
    analysis: `H: ${hsl.h.toFixed(1)}° (${getHueCategory(hsl.h)}), S: ${hsl.s.toFixed(1)}%, L: ${hsl.l.toFixed(1)}%`
  };
};

const getHueCategory = (h: number): string => {
  if (h >= 0 && h < 30) return "Red";
  if (h >= 30 && h < 60) return "Orange";
  if (h >= 60 && h < 90) return "Yellow";
  if (h >= 90 && h < 150) return "Green";
  if (h >= 150 && h < 210) return "Cyan";
  if (h >= 210 && h < 270) return "Blue";
  if (h >= 270 && h < 330) return "Purple";
  return "Red";
};
