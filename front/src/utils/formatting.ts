export const maybePluralize = (count: number, noun: string, suffix = 's') =>
  `${noun}${count !== 1 ? suffix : ''}`;

export const addLeadingZero = (item: string) => String(item).padStart(2, '0');

export const abbreviateNumber = (input: number) => {
  let output: number | string = input;
  const isAbove1000 = output >= 1000;
  if (isAbove1000) {
    output /= 1000;
  }
  const threeDigits: string = output.toPrecision(3);

  // Divide by 1 to remove trailing zeros
  output = +threeDigits / 1;

  if (isAbove1000) {
    output = `${output}K`;
  }

  return output;
};
