const AUTH_TOKEN_KEY = 'ethio_shopify_auth_token';

const canUseLocalStorage = () => typeof window !== 'undefined' && window.localStorage;

export const getStoredAuthToken = () => {
  if (!canUseLocalStorage()) return null;

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredAuthToken = (token) => {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearStoredAuthToken = () => {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};
