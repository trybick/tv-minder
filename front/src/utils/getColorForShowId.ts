// Takes a list of showIds. Returns a list of persistent unique colors
export const getUniqueColorsForShowIds = (showIds: number[]) => {
  const usedIndicies: { [key: number]: boolean } = {};

  const listOfIndicies = showIds.map(id => {
    // Guaranteed to be a number between 0 and 278 (which is the length of colors)
    // Example: 45230 % 278 = 220
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
  '#0023b8',
  '#00efd4',
  '#00f7f9',
  '#00f87c',
  '#01ac53',
  '#05d371',
  '#060e27',
  '#06e052',
  '#06f43a',
  '#07d7f6',
  '#088baf',
  '#0971f0',
  '#0cd36d',
  '#0d5ac1',
  '#0eb621',
  '#0ec0ff',
  '#0f525f',
  '#0f5997',
  '#10e5b1',
  '#11dec1',
  '#1350ce',
  '#14a9ad',
  '#15b9ee',
  '#17232',
  '#1a8011',
  '#1a806a',
  '#1a806b',
  '#1ae6db',
  '#1bb699',
  '#1bb699',
  '#1bede6',
  '#1c0365',
  '#1c271',
  '#1c271',
  '#1c65cb',
  '#1d1d58',
  '#1dc18',
  '#1deaa7',
  '#1ec227',
  '#20f6ba',
  '#21538e',
  '#21538e',
  '#21d52e',
  '#225b8',
  '#228916',
  '#243eeb',
  '#250662',
  '#25b67',
  '#289812',
  '#28fcfd',
  '#2a3434',
  '#2ca1ae',
  '#2d7d2a',
  '#2dfff6',
  '#2f1179',
  '#2f3f94',
  '#2f7b99',
  '#30cc49',
  '#32d5d6',
  '#34891f',
  '#36486a',
  '#3b8c2a',
  '#3b8c2a',
  '#3cec35',
  '#3d6751',
  '#3e464c',
  '#3f16d9',
  '#3f8473',
  '#406df9',
  '#409188',
  '#41d158',
  '#421f79',
  '#436a9e',
  '#436a9f',
  '#474893',
  '#4834d0',
  '#48b41b',
  '#4a543f',
  '#4b5bdc',
  '#4bb473',
  '#4be47',
  '#4ca2f9',
  '#4cf09d',
  '#4f0f6f',
  '#513d98',
  '#51aed9',
  '#520d3a',
  '#521250',
  '#521250',
  '#539397',
  '#5426e0',
  '#566ca0',
  '#57c4d8',
  '#5bb32d',
  '#5be4f0',
  '#5cdd87',
  '#5d1d0c',
  '#5d2c52',
  '#608572',
  '#608fa4',
  '#6119d0',
  '#615af0',
  '#61da5e',
  '#62c03e',
  '#635f6d',
  '#63b598',
  '#640fc1',
  '#648177',
  '#64820f',
  '#64820f',
  '#651be6',
  '#6749e8',
  '#679c9d',
  '#67eb4b',
  '#6995ba',
  '#6b2e5f',
  '#6b2e5f',
  '#71b1f4',
  '#7260d8',
  '#73872a',
  '#75d89e',
  '#77772a',
  '#792ed8',
  '#79352c',
  '#79352c',
  '#79806e',
  '#79bca0',
  '#7a3d93',
  '#7ad236',
  '#7d1d85',
  '#7e50a8',
  '#7fb411',
  '#7fb411',
  '#802234',
  '#807fb',
  '#823c59',
  '#86e98f',
  '#8798a4',
  '#880977',
  '#88aa0b',
  '#88e9b8',
  '#89d534',
  '#89d534',
  '#8a96c6',
  '#8d6c2f',
  '#8fb413',
  '#8fd883',
  '#8fe22a',
  '#911e20',
  '#911e7e',
  '#916988',
  '#9348af',
  '#935b6d',
  '#947002',
  '#9685eb',
  '#96b00c',
  '#96e591',
  '#983f7a',
  '#983f7a',
  '#986b53',
  '#996635',
  '#996c48',
  '#9ab9b7',
  '#9b5c2a',
  '#9cb64a',
  '#9e6d71',
  '#a259a4',
  '#a48a9e',
  '#a4d17a',
  '#a4e43f',
  '#a5b3d9',
  '#a82b89',
  '#a84a8f',
  '#a8b8d4',
  '#aa226d',
  '#ac3e1b',
  '#ac7c0a',
  '#ae90e2',
  '#aead3a',
  '#af3101',
  '#b0d87b',
  '#b11573',
  '#b17fc9',
  '#b2b4f0',
  '#b2be57',
  '#b2be57',
  '#b2c24f',
  '#b2db15',
  '#b308d3',
  '#b46238',
  '#b47162',
  '#b4c086',
  '#ba96ce',
  '#bb09b',
  '#bde052',
  '#be608b',
  '#c0a43c',
  '#c188a2',
  '#c2b0e2',
  '#c3c89d',
  '#c4d647',
  '#c4fd57',
  '#c5a4fb',
  '#c6c42c',
  '#c6e1e8',
  '#c79bc2',
  '#c79ed2',
  '#c79ed2',
  '#c9a941',
  '#c9d730',
  '#ca4751',
  '#cb2582',
  '#cb5bea',
  '#cd2f00',
  '#ce00be',
  '#ce7d78',
  '#d00043',
  '#d02e29',
  '#d2737d',
  '#d298e2',
  '#d3277a',
  '#d3486d',
  '#d3493a',
  '#d36647',
  '#d36647',
  '#d6dd92',
  '#d6dd92',
  '#d70a9c',
  '#d7790f',
  '#da967d',
  '#dba2e6',
  '#dc1c06',
  '#dce77a',
  '#dd93fd',
  '#de73c2',
  '#df514a',
  '#e08c56',
  '#e0eeb8',
  '#e145ba',
  '#e1cf3b',
  '#e23dd0',
  '#e33e52',
  '#e33e52',
  '#e3a481',
  '#e3d94c',
  '#e4ac44',
  '#e7dbce',
  '#ea24a3',
  '#ea24a3',
  '#ea9e70',
  '#ee91e3',
  '#ef6e3c',
  '#f07815',
  '#f158bf',
  '#f1ae16',
  '#f205e6',
  '#f2510e',
  '#f50422',
  '#f50422',
  '#f53b2a',
  '#f697c1',
  '#f812b3',
  '#fa06ec',
  '#fa06ec',
  '#fb21a3',
  '#fb4c03',
  '#fc458e',
  '#fc6b57',
  '#fc7e41',
  '#ff065',
  '#ff3420',
  '#ffdbe1',
];
