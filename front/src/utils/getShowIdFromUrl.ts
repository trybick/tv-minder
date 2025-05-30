import { ID } from '~/types/common';

export const getShowIdFromUrl = (): ID => {
  const id = window.location.pathname.split('/')[2];
  if (!id) {
    throw Error('Unable to find show ID');
  }
  return +id;
};
