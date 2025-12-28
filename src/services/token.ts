import { Settings } from '../configuration/settings';

export type Token = string;

export const getToken = (): Token => {
  const token = localStorage.getItem(Settings.AUTH_TOKEN_KEY_NAME);
  return token ?? '';
};

export const saveToken = (token: Token): void => {
  localStorage.setItem(Settings.AUTH_TOKEN_KEY_NAME, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(Settings.AUTH_TOKEN_KEY_NAME);
};
