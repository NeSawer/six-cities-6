import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../../models/authorization-status';
import { UserModel } from '../../models/user-model';
import { Namespace } from '../namespace';
import handleRequest from '../../tools/handle-request';
import { dropToken, saveToken } from '../../services/token';
import { RegistrationRequest } from '../../models/registration-request';
import { AxiosInstance } from 'axios';
import { fetchFavoriteOffers } from './offers';
import { ApiRoute } from '../../configuration/api-route';

export type AuthState = {
  authStatus: AuthorizationStatus;
  currentUser: UserModel | null;
}

const initialState: AuthState = {
  authStatus: AuthorizationStatus.Unknown,
  currentUser: null
};

type AsyncThunkConfig = {
  extra: AxiosInstance;
}

export const setAuthStatus = createAction<AuthorizationStatus>('set_auth_status');
export const setCurrentUser = createAction<UserModel | null>('set_current_user');

export const fetchLogin = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  'fetch_login', (_arg, { dispatch, extra: api }) => handleRequest(
    () => api.get<UserModel>(ApiRoute.Login),
    (data) => {
      dispatch(setCurrentUser(data));
      saveToken(data.token);
      dispatch(setAuthStatus(AuthorizationStatus.Auth));
      dispatch(fetchFavoriteOffers());
    },
    {
      [401]: () => dispatch(setAuthStatus(AuthorizationStatus.NoAuth))
    },
    () => dispatch(setAuthStatus(AuthorizationStatus.Unknown))
  ));

export const fetchRegistration = createAsyncThunk<void, RegistrationRequest, AsyncThunkConfig>(
  'fetch_registration', (arg, { dispatch, extra: api }) => handleRequest(
    () => api.post<UserModel>(ApiRoute.Login, arg),
    (data) => {
      dispatch(setCurrentUser(data));
      saveToken(data.token);
      dispatch(setAuthStatus(AuthorizationStatus.Auth));
      dispatch(fetchFavoriteOffers());
    },
    {
      [400]: () => dispatch(setAuthStatus(AuthorizationStatus.NoAuth))
    },
    () => dispatch(setAuthStatus(AuthorizationStatus.Unknown))
  ));

export const fetchLogout = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  'fetch_logout', (_arg, { dispatch, extra: api }) => handleRequest(
    () => api.delete(ApiRoute.Logout),
    () => {
      dispatch(setCurrentUser(null));
      dropToken();
      dispatch(setAuthStatus(AuthorizationStatus.NoAuth));
    },
    {},
    () => dispatch(setAuthStatus(AuthorizationStatus.Unknown))
  ));

export const authSlice = createSlice({
  name: Namespace.Auth,
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(setAuthStatus, (state, { payload }) => {
      state.authStatus = payload;
    })
    .addCase(setCurrentUser, (state, { payload }) => {
      state.currentUser = payload;
    })
});
