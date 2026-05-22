const isDev = window.location.hostname === 'localhost';

export const backendURL = () => isDev
    ? 'http://localhost:3000'
    : 'https://sa-learnerships.onrender.com';

export const getToken = () => localStorage.getItem('jwt');
export const saveToken = (token) => localStorage.setItem('jwt', token);
export const clearToken = () => localStorage.removeItem('jwt');
