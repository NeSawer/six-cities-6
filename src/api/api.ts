import axios from 'axios';
import { getToken } from '../services/token';
import { Settings } from '../configuration/settings';

export const createAppApi = () => axios.create({
  baseURL: Settings.API.URL,
  timeout: Settings.API.TIMEOUT,
});

export const appApi = createAppApi();

appApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['x-token'] = token;
    }

    return config;
  },
);
