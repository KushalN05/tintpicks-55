import ntc from './ntc';

export const normalizeColorToHex = (rawColorString: string): string => {
  if (!rawColorString) return '#808080'; // Default gray

  // 1. If it's already a hex code
  const hexMatch = rawColorString.match(/#?([0-9A-Fa-f]{3,6})\b/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    return `#${hex.toUpperCase()}`;
  }

  // 2. Tokenize the input string
  const targetWords = rawColorString.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2); // ignore tiny words like "a", "of"

  if (targetWords.length === 0) return '#808080';

  let bestMatch = { hex: '#808080', score: -1 };

  // ntc.names is an array of [hex, name]
  for (const color of ntc.names) {
    const hex = color[0];
    const name = color[1].toLowerCase();
    const nameWords = name.split(/\s+/);
    
    let score = 0;

    // Exact name match gets highest score
    if (name === rawColorString.toLowerCase()) {
      return hex.toUpperCase();
    }

    for (const tw of targetWords) {
      if (nameWords.includes(tw)) {
        score += 3; // High weight for exact word match
      } else {
        // Partial word match (e.g. "obsidian" in "obsidians")
        for (const nw of nameWords) {
          if (nw.length > 3 && (tw.includes(nw) || nw.includes(tw))) {
            score += 1;
          }
        }
      }
    }

    // Tie-breaker: prefer shorter standard names if score is same (e.g. "Blue" over "Midnight Blue" if both score 3 for "Blue")
    if (score > 0) {
      // penalize for extra words in the standard name that weren't matched
      const penalty = nameWords.length * 0.1;
      const finalScore = score - penalty;

      if (finalScore > bestMatch.score) {
        bestMatch = { hex, score: finalScore };
      }
    }
  }

  if (bestMatch.score <= 0) return '#808080';

  return bestMatch.hex.toUpperCase();
};
