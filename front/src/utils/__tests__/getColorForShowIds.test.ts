import { getUniqueColorsForShowIds } from '../getColorForShowId';

//returns true if array values are unique otherwise returns false;
const isUnique = (arr: string[]): boolean => new Set(arr).size === arr.length;

const generateIds = (repeat: number) => {
  const randomArr: number[] = [];
  for (let i = 1; i <= repeat; i++) {
    //generates random number 'tween  1000 & 100000
    const randomNum: number = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    //push unique ids only into the array
    if (randomArr.indexOf(randomNum) === -1) randomArr.push(randomNum);
  }
  return randomArr;
};

describe('getUniqueColorsForShowIds', () => {
  it('returns 2 unique colors', () => {
    const colors = getUniqueColorsForShowIds(generateIds(2));
    expect(isUnique(colors)).toBeTruthy();
  });

  it('returns 4 unique colors', () => {
    const colors = getUniqueColorsForShowIds(generateIds(4));
    expect(isUnique(colors)).toBeTruthy();
  });

  it('returns 6 unique colors', () => {
    const colors = getUniqueColorsForShowIds(generateIds(6));
    expect(isUnique(colors)).toBeTruthy();
  });

  it('returns array length of 1', () => {
    const colors = getUniqueColorsForShowIds(generateIds(1));
    expect(colors.length).toBe(1);
  });
});
