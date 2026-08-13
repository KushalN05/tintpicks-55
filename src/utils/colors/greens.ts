import { ColorInfo } from './colorTypes';

export const greens: ColorInfo[] = [
  { name: 'Pure Green', hex: '#008000', category: 'green' },
  { name: 'Forest Green', hex: '#228B22', category: 'green' },
  { name: 'Emerald Green', hex: '#50C878', category: 'green' },
  { name: 'Sage Green', hex: '#9DC183', category: 'green' },
  { name: 'Mint Green', hex: '#98FF98', category: 'green' },
  { name: 'Sea Green', hex: '#2E8B57', category: 'green' },
  { name: 'Lime Green', hex: '#32CD32', category: 'green' },
  { name: 'Olive Green', hex: '#808000', category: 'green' },
  { name: 'Dark Green', hex: '#006400', category: 'green' },
  { name: 'Pale Green', hex: '#98FB98', category: 'green' },
  { name: 'Pastel Green', hex: '#77DD77', category: 'green' },
  { name: 'Hunter Green', hex: '#355E3B', category: 'green' }, // ✅ Real Hunter Green
  { name: 'Moss Green', hex: '#8A9A5B', category: 'green' },
  { name: 'Fern Green', hex: '#4F7942', category: 'green' },
  { name: 'Jungle Green', hex: '#29AB87', category: 'green' },
  // The problematic entry (Artichoke Green) is below—swap hex to correct muted green:
  { name: 'Artichoke Green', hex: '#8F9779', category: 'green' }, // correct muted artichoke (used in web color refs)
  { name: 'Avocado Green', hex: '#568203', category: 'green' },
  { name: 'Kelly Green', hex: '#4CBB17', category: 'green' },
  { name: 'Matcha Green', hex: '#D0F0C0', category: 'green' }
];
