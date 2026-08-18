import { hexToLab } from './colorConverter';

export const COMMERCIAL_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Grey', hex: '#D3D3D3' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Dark Charcoal Grey', hex: '#333333' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Dark Navy Blue', hex: '#1C2833' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Pastel Blue', hex: '#AEC6CF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Dark Green', hex: '#006400' },
  { name: 'Olive Green', hex: '#808000' },
  { name: 'Light Green', hex: '#90EE90' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Dark Brown', hex: '#654321' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Dark Red', hex: '#8B0000' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Dusty Pink', hex: '#DCAE96' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Mustard Yellow', hex: '#FFDB58' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Burnt Orange', hex: '#CC5500' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Light Purple', hex: '#E6E6FA' },
  { name: 'Plum', hex: '#DDA0DD' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Khaki', hex: '#C3B091' }
];

export const getCommercialColorName = (targetHex: string): string => {
  const targetLab = hexToLab(targetHex);
  if (!targetLab) return 'Color';

  let bestMatch = COMMERCIAL_COLORS[0];
  let minDistance = Infinity;

  for (const color of COMMERCIAL_COLORS) {
    const lab = hexToLab(color.hex);
    if (!lab) continue;

    // Simple Euclidean distance in CIELAB space (Delta-E CIE76)
    const distance = Math.sqrt(
      Math.pow(lab.l - targetLab.l, 2) +
      Math.pow(lab.a - targetLab.a, 2) +
      Math.pow(lab.b - targetLab.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = color;
    }
  }

  return bestMatch.name;
};
