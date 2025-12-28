import { Action } from '@reduxjs/toolkit';
import { createAppApi } from '../../api/api';
import { ApiRoute } from '../../configuration/api-route';
import { AppThunkDispatch, makeFakeOffers, makeFakeUser } from '../../test-utils/mock';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from '..';
import { fetchLogin, fetchLogout, fetchRegistration, setAuthStatus, setCurrentUser } from './auth';
import { AuthorizationStatus } from '../../models/authorization-status';
import { setFavoriteOffers } from '../offers/offers';
import * as tokenStorage from '../../services/token';
import { internet } from 'faker';

describe('Auth Slice async', () => {
  const axios = createAppApi();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator();
  });

  it('should setup login actions when fetchLogin success', async () => {
    const payload = makeFakeUser();
    const favoritePayload = makeFakeOffers(true);
    mockAxiosAdapter.onGet(ApiRoute.Login).reply(200, payload);
    mockAxiosAdapter.onGet(ApiRoute.Favorite).reply(200, favoritePayload);
    const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

    await store.dispatch(fetchLogin());

    const actions = store.getActions();
    expect(actions).toContainEqual(setCurrentUser(payload));
    expect(actions).toContainEqual(setAuthStatus(AuthorizationStatus.Auth));
    expect(actions).toContainEqual(setFavoriteOffers(favoritePayload));
    expect(mockSaveToken).toBeCalledTimes(1);
    expect(mockSaveToken).toBeCalledWith(payload.token);
  });

  it('should setup NoAuth actions when fetchLogin response 401', async () => {
    mockAxiosAdapter.onGet(ApiRoute.Login).reply(401);

    await store.dispatch(fetchLogin());

    const actions = store.getActions();
    expect(actions).toContainEqual(setAuthStatus(AuthorizationStatus.NoAuth));
  });

  it('should setup registration actions when fetchRegistration success', async () => {
    const payload = makeFakeUser();
    const password = internet.password();
    const favoritePayload = makeFakeOffers(true);
    mockAxiosAdapter.onPost(ApiRoute.Login).reply(200, payload);
    mockAxiosAdapter.onGet(ApiRoute.Favorite).reply(200, favoritePayload);
    const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

    await store.dispatch(fetchRegistration({ email: payload.email, password }));

    const actions = store.getActions();
    expect(actions).toContainEqual(setCurrentUser(payload));
    expect(actions).toContainEqual(setAuthStatus(AuthorizationStatus.Auth));
    expect(actions).toContainEqual(setFavoriteOffers(favoritePayload));
    expect(mockSaveToken).toBeCalledTimes(1);
    expect(mockSaveToken).toBeCalledWith(payload.token);
  });

  it('should setup NoAuth actions when fetchRegistration response 400', async () => {
    const email = internet.email();
    const password = internet.password();
    mockAxiosAdapter.onPost(ApiRoute.Login).reply(400);

    await store.dispatch(fetchRegistration({ email, password }));

    const actions = store.getActions();
    expect(actions).toContainEqual(setAuthStatus(AuthorizationStatus.NoAuth));
  });

  it('should setup logout actions when fetchLogout success', async () => {
    mockAxiosAdapter.onDelete(ApiRoute.Logout).reply(200);
    const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

    await store.dispatch(fetchLogout());

    const actions = store.getActions();
    expect(actions).toContainEqual(setCurrentUser(null));
    expect(actions).toContainEqual(setAuthStatus(AuthorizationStatus.NoAuth));
    expect(mockDropToken).toBeCalledTimes(1);
  });
});
