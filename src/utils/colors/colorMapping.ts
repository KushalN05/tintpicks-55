import { getEnhancedColorName } from './colorUtils';
import { blues } from './blues';
import { reds } from './reds';
import { greens } from './greens';
import { whites } from './whites';
import { blacks } from './blacks';
import { oranges } from './oranges';
import { purples } from './purples';
import { teals } from './teals';
import { ColorInfo, ColorCategories } from './colorTypes';
import { extraColors } from './extraColors';

// Add missing color categories
import { yellows } from './yellows';
import { pinks } from './pinks';

// Consolidated color database
const colorDatabase: ColorInfo[] = [
  ...blues,
  ...reds,
  ...greens,
  ...whites,
  ...blacks,
  ...oranges,
  ...purples,
  ...teals,
  ...yellows,
  ...pinks,
  ...extraColors
];

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const getColorDistance = (
  [r1, g1, b1]: [number, number, number],
  [r2, g2, b2]: [number, number, number]
): number => {
  // Using a weighted Euclidean distance formula that gives more importance to perceptual differences
  const rMean = (r1 + r2) / 2;
  const dR = r1 - r2;
  const dG = g1 - g2;
  const dB = b1 - b2;
  
  // Weights based on human perception of colors
  const rWeight = 2 + rMean / 256;
  const gWeight = 4.0;
  const bWeight = 2 + (255 - rMean) / 256;
  
  return Math.sqrt(
    rWeight * dR * dR +
    gWeight * dG * dG +
    bWeight * dB * dB
  );
};

// Function to get all named colors in the database
export const getAllNamedColors = (): ColorInfo[] => {
  return colorDatabase;
};

// Get all colors organized by categories
export const getColorsByCategory = (): ColorCategories => {
  return {
    blues: colorDatabase.filter(color => color.category === 'blue'),
    reds: colorDatabase.filter(color => color.category === 'red'),
    greens: colorDatabase.filter(color => color.category === 'green'),
    whites: colorDatabase.filter(color => color.category === 'white'),
    blacks: colorDatabase.filter(color => color.category === 'black'),
    oranges: colorDatabase.filter(color => color.category === 'orange'),
    purples: colorDatabase.filter(color => color.category === 'purple'),
    teals: colorDatabase.filter(color => color.category === 'teal'),
    yellows: colorDatabase.filter(color => color.category === 'yellow'),
    pinks: colorDatabase.filter(color => color.category === 'pink')
  };
};

export const getColorName = (hex: string): string => {
  const normalizedHex = hex.toUpperCase();
  const targetRgb = hexToRgb(normalizedHex);
  let closestColor = colorDatabase[0];
  let minDistance = Number.MAX_VALUE;

  for (const color of colorDatabase) {
    const currentRgb = hexToRgb(color.hex);
    const distance = getColorDistance(targetRgb, currentRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return getEnhancedColorName(normalizedHex, closestColor.name);
};

export const getClosestNamedColor = getColorName;
export const getColorInfo = (hex: string): ColorInfo => {
  const normalizedHex = hex.toUpperCase();
  const targetRgb = hexToRgb(normalizedHex);
  let closestColor = colorDatabase[0];
  let minDistance = Number.MAX_VALUE;

  for (const color of colorDatabase) {
    const currentRgb = hexToRgb(color.hex);
    const distance = getColorDistance(targetRgb, currentRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  }

  return {
    name: getEnhancedColorName(normalizedHex, closestColor.name),
    hex: normalizedHex,
    category: closestColor.category
  };
};
