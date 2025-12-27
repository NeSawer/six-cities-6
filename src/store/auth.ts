import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../models/authorization-status';
import { UserModel } from '../models/user-model';
import { Namespace } from './namespace';
import handleRequest from '../tools/handle-request';
import { dropToken, saveToken } from '../services/token';
import { RegistrationRequest } from '../models/registration-request';
import { AxiosInstance } from 'axios';
import { fetchFavoriteOffers } from './offers';
import { ApiRoute } from '../configuration/api-route';
import { State } from '.';

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

export const getAuthStatus = (state: Pick<State, Namespace.Auth>) => state[Namespace.Auth].authStatus;
export const getCurrentUser = (state: Pick<State, Namespace.Auth>) => state[Namespace.Auth].currentUser;

export const setAuthStatus = createAction<AuthorizationStatus>('setAuthStatus');
export const setCurrentUser = createAction<UserModel | null>('setCurrentUser');

export const fetchLogin = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  'fetchLogin', (_arg, { dispatch, extra: api }) => handleRequest(
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
  'fetchRegistration', (arg, { dispatch, extra: api }) => handleRequest(
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
  'fetchLogout', (_arg, { dispatch, extra: api }) => handleRequest(
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
