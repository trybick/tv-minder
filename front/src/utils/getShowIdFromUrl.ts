export const getShowIdFromUrl = (): number => {
  const id = window.location.pathname.split('/')[2];
  if (!id) {
    throw Error('Unable to find show number');
  }
  return +id;
};
