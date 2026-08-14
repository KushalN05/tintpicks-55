import ntc from 'ntcjs';

export interface ColorInfo {
  name: string;
  hex: string;
  category: string;
}

export interface ColorCategories {
  [key: string]: ColorInfo[];
}

const categorizeColor = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('blue')) return 'blue';
  if (lowerName.includes('red')) return 'red';
  if (lowerName.includes('green')) return 'green';
  if (lowerName.includes('yellow') || lowerName.includes('gold')) return 'yellow';
  if (lowerName.includes('pink') || lowerName.includes('rose')) return 'pink';
  if (lowerName.includes('purple') || lowerName.includes('violet')) return 'purple';
  if (lowerName.includes('orange')) return 'orange';
  if (lowerName.includes('teal') || lowerName.includes('cyan')) return 'teal';
  if (lowerName.includes('black') || lowerName.includes('gray') || lowerName.includes('grey') || lowerName.includes('dark')) return 'black';
  if (lowerName.includes('white') || lowerName.includes('snow') || lowerName.includes('ivory')) return 'white';
  return 'other';
};

// Memoized derived data
let allColorsCache: ColorInfo[] | null = null;
let categoryCache: ColorCategories | null = null;

export const getAllNamedColors = (): ColorInfo[] => {
  if (allColorsCache) return allColorsCache;
  
  allColorsCache = ntc.names.map((color: [string, string, string]) => ({
    hex: color[0].toUpperCase(),
    name: color[1],
    category: categorizeColor(color[1])
  }));
  
  return allColorsCache;
};

export const getColorsByCategory = (): ColorCategories => {
  if (categoryCache) return categoryCache;
  
  const all = getAllNamedColors();
  const categories: ColorCategories = {
    blues: [],
    reds: [],
    greens: [],
    whites: [],
    blacks: [],
    oranges: [],
    purples: [],
    teals: [],
    yellows: [],
    pinks: [],
    others: []
  };

  all.forEach(color => {
    const key = color.category + 's';
    if (categories[key]) {
      categories[key].push(color);
    } else {
      categories.others.push(color);
    }
  });

  categoryCache = categories;
  return categoryCache;
};

export const getColorName = (hex: string): string => {
  // Ensure we have a proper hex code
  let cleanHex = hex.trim().toUpperCase();
  if (!cleanHex.startsWith('#')) cleanHex = '#' + cleanHex;
  
  const match = ntc.name(cleanHex);
  return match[1]; // match is [hex_value, name, exact_match_boolean]
};

export const getClosestNamedColor = getColorName;

export const getColorInfo = (hex: string): ColorInfo => {
  const name = getColorName(hex);
  return {
    name,
    hex: hex.toUpperCase(),
    category: categorizeColor(name)
  };
};

export const getColorAnalysis = (hex: string): { analysis: string } => {
  const name = getColorName(hex);
  return { analysis: `A beautiful shade of ${name}. Perfect for your next outfit!` };
};
