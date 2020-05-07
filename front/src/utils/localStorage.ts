export const isLoggedIn = !!localStorage.getItem('jwt');

export const saveShowToLocalStorage = (showId: number, method: 'save' | 'unsave' = 'save') => {
  const key = 'savedShows';
  const existingArray = localStorage.getItem(key);
  const arrayToSave = existingArray ? JSON.parse(existingArray) : [];
  const showLocation = arrayToSave.indexOf(showId);
  const doesExist = showLocation > -1;

  if (method === 'unsave' && doesExist) {
    arrayToSave.splice(showLocation, 1);
  } else if (!doesExist) {
    arrayToSave.push(showId);
  }

  localStorage.setItem(key, JSON.stringify(arrayToSave));
};
