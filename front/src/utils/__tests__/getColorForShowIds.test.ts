import { getUniqueColorsForShowIds } from '../getColorForShowId';

//returns true if array values are unique otherwise returns false;
const isUnique = (arr: string[]): boolean => new Set(arr).size === arr.length;

describe('getUniqueColorsForShowIds', () => {
  it('returns 2 unique colors', () => {
    const colors = getUniqueColorsForShowIds([1000, 1001]);
    expect(isUnique(colors)).toBeTruthy();
  });

  it('returns 4 unique colors', () => {
    const colors = getUniqueColorsForShowIds([1000, 2000, 3000, 4000]);
    expect(isUnique(colors)).toBeTruthy();
  });

  it('returns 6 unique colors', () => {
    const colors = getUniqueColorsForShowIds([1000, 1001, 3000, 5000, 6000]);
    expect(isUnique(colors)).toBeTruthy();
  });
});
