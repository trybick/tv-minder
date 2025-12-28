export const isEmpty = (object: unknown) => {
  if (object === undefined || object === null) {
    return true;
  }
  return Object.keys(object)?.length === 0;
};
