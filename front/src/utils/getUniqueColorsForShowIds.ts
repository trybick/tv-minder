/**
 * This is a consistent way to generate a unique color for each showId.
 * If multiple shows would map to the same color (due to modulo), they will
 * be assigned different colors while maintaining consistency.
 *
 * @param showIds
 * @returns A list of colors
 */
export const getUniqueColorsForShowIds = (showIds: number[]): string[] => {
  const usedColors = new Set<number>();
  const result: string[] = [];

  showIds.forEach(id => {
    let colorIndex = id % colors.length;
    let attempts = 0;

    // If the color is already used, try the next available color
    while (usedColors.has(colorIndex) && attempts < colors.length) {
      colorIndex = (colorIndex + 1) % colors.length;
      attempts++;
    }

    usedColors.add(colorIndex);
    result.push(colors[colorIndex]);
  });

  return result;
};

// These colors have above a 5 contrast ratio with white text. Found from:
// https://reallybigshoe.co.uk/visualiser/index.html
export const colors = [
  '#8A2BE2',
  '#A52A2A',
  '#DC143C',
  '#006400',
  '#8B008B',
  '#556B2F',
  '#483D8B',
  '#2F4F4F',
  '#9400D3',
  '#696969',
  '#008000',
  '#4B0082',
  '#800000',
  '#0000CD',
  '#663399',
  '#8B4513',
  '#6A5ACD',
  '#008080',
];
