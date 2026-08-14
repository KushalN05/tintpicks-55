/**
 * Curated list of fashion/retail colors. 
 * E-commerce sites generally don't use whimsical names like "Stratos", 
 * they use recognizable color families.
 */
export const RETAIL_PALETTE = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Sage', hex: '#9DC183' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Peach', hex: '#FFE5B4' },
  { name: 'Burnt Orange', hex: '#CC5500' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Mustard', hex: '#FFDB58' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Brown', hex: '#964B00' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Purple', hex: '#800080' },
];

/**
 * Converts a hex code to an RGB tuple.
 * Supports both 3-digit (#F00) and 6-digit (#FF0000) hex codes.
 */
const hexToRgb = (hex: string): [number, number, number] => {
  let clean = hex.replace('#', '');
  
  // Expand 3-digit hex to 6-digit hex
  if (clean.length === 3) {
    clean = clean.split('').map(char => char + char).join('');
  }

  // Ensure it's 6 digits, if not default to black
  if (clean.length !== 6) {
    return [0, 0, 0];
  }

  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

/**
 * Computes Euclidean distance between two RGB colors.
 */
const colorDistance = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) + 
    Math.pow(rgb1[1] - rgb2[1], 2) + 
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

/**
 * Maps any given hex code to its closest retail keyword.
 */
export const getRetailColorFamily = (hexCode: string): string => {
  const targetRgb = hexToRgb(hexCode);
  let closestMatch = RETAIL_PALETTE[0];
  let minDistance = Number.MAX_VALUE;

  for (const color of RETAIL_PALETTE) {
    const paletteRgb = hexToRgb(color.hex);
    const distance = colorDistance(targetRgb, paletteRgb);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = color;
    }
  }

  return closestMatch.name;
};
