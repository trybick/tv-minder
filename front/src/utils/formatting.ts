export const maybePluralize = (count: number | number, noun: string, suffix = 's') =>
  `${noun}${count !== 1 ? suffix : ''}`;

export const addLeadingZero = (item: string) => String(item).padStart(2, '0');
