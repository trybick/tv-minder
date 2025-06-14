import { describe, expect, it } from 'vitest';

import { getUniqueColorsForShowIds } from './getUniqueColorsForShowIds';

describe('getUniqueColorsForShowIds', () => {
  it('should return unique colors for different show IDs', () => {
    const showIds = [1, 2, 3, 4, 5];
    const colors = getUniqueColorsForShowIds(showIds);

    expect(colors).toHaveLength(showIds.length);
    expect(new Set(colors).size).toBe(showIds.length);
  });

  it('should handle empty array', () => {
    const showIds: number[] = [];
    const colors = getUniqueColorsForShowIds(showIds);

    expect(colors).toHaveLength(0);
  });

  it('should handle duplicate show IDs', () => {
    const showIds = [1, 1, 2, 2, 3];
    const colors = getUniqueColorsForShowIds(showIds);

    expect(colors).toHaveLength(showIds.length);
    expect(new Set(colors).size).toBe(showIds.length);
  });

  it('should return valid hex color codes', () => {
    const showIds = [1, 2, 3];
    const colors = getUniqueColorsForShowIds(showIds);

    colors.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('should maintain color consistency for same show IDs', () => {
    const showIds = [1, 2, 3];
    const firstRun = getUniqueColorsForShowIds(showIds);
    const secondRun = getUniqueColorsForShowIds(showIds);

    expect(firstRun).toEqual(secondRun);
  });
});
