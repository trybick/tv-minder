export const isLoggedIn = !!localStorage.getItem('jwt');

export const saveShowToLocalStorage = (showId: any, method: 'save' | 'unsave' = 'save') => {
  const key = 'savedShows';
  const existingShows = localStorage.getItem(key);
  const arrayToSave = existingShows ? JSON.parse(existingShows) : [];

  if (method === 'unsave') {
    const location = arrayToSave.indexOf(showId);
    if (location > -1) {
      arrayToSave.splice(location, 1);
    }
  } else {
    arrayToSave.push(showId);
  }

  localStorage.setItem(key, JSON.stringify(arrayToSave));
};
