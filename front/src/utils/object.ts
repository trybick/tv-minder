export const isEmpty = (object: any) => {
  if (object === undefined || object === null) {
    return true;
  }
  return Object.keys(object)?.length === 0;
};
