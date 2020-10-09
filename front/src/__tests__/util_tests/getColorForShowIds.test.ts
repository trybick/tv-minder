import { getUniqueColorsForShowIds } from '../../utils/getColorForShowId';

describe('getUnqueColorsForShowIds', () => {

  it('returns 2 unique colors', () => {
    const colors = getUniqueColorsForShowIds([1, 2]);
    expect(colors[0]).not.toEqual(colors[1]);
  });

  it('returns 4 unique colors', () => {
    const colors = getUniqueColorsForShowIds([1, 2, 3, 4]);
    expect(colors[0]).not.toEqual(colors[1]);
    expect(colors[2]).not.toEqual(colors[3]);
  });
  
  it('returns 6 unique colors', () => {
    const colors = getUniqueColorsForShowIds([1, 2, 3, 4, 5, 6]);
    expect(colors[0]).not.toEqual(colors[1]);
    expect(colors[2]).not.toEqual(colors[3]);
    expect(colors[4]).not.toEqual(colors[5]);
  });
});
