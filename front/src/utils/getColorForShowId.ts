// Takes a list of showIds. Returns a list of persistent unique colors
export const getUniqueColorsForShowIds = (showIds: number[]) => {
  const usedIndicies: { [key: number]: boolean } = {};

  const listOfIndicies = showIds.map(id => {
    // Guaranteed to be a number between 0 and 278 (which is the length of colors)
    // Example: 45230 % 131 = 35
    const colorIndex = id % colors.length;
    return colorIndex;
  });

  const uniqueIndices = listOfIndicies.map(index => {
    let findUniqueIndexStepsCount = 0;
    let uniqueIndex = index;

    while (findUniqueIndexStepsCount < colors.length) {
      // If the index isn't used yet, then choose this number and break loop
      if (!usedIndicies.hasOwnProperty(uniqueIndex)) {
        break;
      } else {
        // If the index is a repeat, get a new number
        findUniqueIndexStepsCount++;
        uniqueIndex = (uniqueIndex + 1) % colors.length;
      }
    }
    usedIndicies[uniqueIndex] = true;
    return uniqueIndex;
  });

  return uniqueIndices.map(i => colors[i]);
};

const colors = [
  '#0023b8',
  '#00efd4',
  '#01ac53',
  '#05d371',
  '#06f43a',
  '#07d7f6',
  '#088baf',
  '#0971f0',
  '#0d5ac1',
  '#0f525f',
  '#0f5997',
  '#10e5b1',
  '#1350ce',
  '#14a9ad',
  '#15b9ee',
  '#1a8011',
  '#1bb699',
  '#1c0365',
  '#1c65cb',
  '#1d1d58',
  '#1ec227',
  '#21538e',
  '#21538e',
  '#228916',
  '#243eeb',
  '#250662',
  '#2ca1ae',
  '#2d7d2a',
  '#2f1179',
  '#2f3f94',
  '#2f7b99',
  '#36486a',
  '#3b8c2a',
  '#3d6751',
  '#3e464c',
  '#3f16d9',
  '#3f8473',
  '#406df9',
  '#409188',
  '#421f79',
  '#436a9e',
  '#474893',
  '#4834d0',
  '#4a543f',
  '#4bb473',
  '#4f0f6f',
  '#513d98',
  '#539397',
  '#566ca0',
  '#5bb32d',
  '#5be4f0',
  '#5d1d0c',
  '#608572',
  '#608fa4',
  '#6119d0',
  '#615af0',
  '#62c03e',
  '#635f6d',
  '#63b598',
  '#648177',
  '#6749e8',
  '#6995ba',
  '#6b2e5f',
  '#71b1f4',
  '#7260d8',
  '#73872a',
  '#77772a',
  '#792ed8',
  '#79352c',
  '#79806e',
  '#7a3d93',
  '#7d1d85',
  '#7e50a8',
  '#802234',
  '#823c59',
  '#86e98f',
  '#880977',
  '#88aa0b',
  '#8d6c2f',
  '#911e20',
  '#916988',
  '#9348af',
  '#947002',
  '#9685eb',
  '#996635',
  '#996c48',
  '#9b5c2a',
  '#9cb64a',
  '#9e6d71',
  '#a259a4',
  '#a48a9e',
  '#aa226d',
  '#ac3e1b',
  '#ac7c0a',
  '#ae90e2',
  '#aead3a',
  '#af3101',
  '#b11573',
  '#b17fc9',
  '#b308d3',
  '#b46238',
  '#b47162',
  '#b4c086',
  '#be608b',
  '#c188a2',
  '#c9a941',
  '#cb2582',
  '#d2737d',
  '#d36647',
  '#dc1c06',
  '#de73c2',
  '#df514a',
  '#e08c56',
  '#e33e52',
  '#f07815',
  '#f2510e',
  '#f697c1',
  '#fb4c03',
  '#fc458e',
  '#fc7e41',
];
