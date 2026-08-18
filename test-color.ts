import { hexToLab } from './src/utils/colorConverter';
import { COMMERCIAL_COLORS } from './src/utils/commercialColorMapping';

const getCommercialColorName = (targetHex: string): string => {
  const targetLab = hexToLab(targetHex);
  if (!targetLab) return 'Color';

  let bestMatch = COMMERCIAL_COLORS[0];
  let minDistance = Infinity;

  for (const color of COMMERCIAL_COLORS) {
    const lab = hexToLab(color.hex);
    if (!lab) continue;

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

console.log(getCommercialColorName('#1C2833'));
