export const authStorage = {
  getToken: () => localStorage.getItem('jwt'),
  setToken: (token: string) => localStorage.setItem('jwt', token),
  clearToken: () => localStorage.removeItem('jwt'),
};
