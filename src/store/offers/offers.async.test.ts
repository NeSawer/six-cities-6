import { Action } from '@reduxjs/toolkit';
import { createAppApi } from '../../api/api';
import { ApiRoute } from '../../configuration/api-route';
import { AppThunkDispatch, makeFakeOffer, makeFakeOffers } from '../../test-utils/mock';
import { fetchFavoriteOffers, fetchOffers, fetchUpdateFavoriteOffer, setFavoriteOffers, setOffers, updateFavoriteOffer } from './offers';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from '..';

describe('Offers Slice async', () => {
  const axios = createAppApi();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator();
  });

  it('should set offers when fetch success', async () => {
    const payload = makeFakeOffers();
    mockAxiosAdapter.onGet(ApiRoute.Offers).reply(200, payload);

    await store.dispatch(fetchOffers());

    const actions = store.getActions();
    expect(actions).toContainEqual(setOffers(payload));
  });

  it('should set empty offers when cannot fetch success', async () => {
    mockAxiosAdapter.onGet(ApiRoute.Offers).reply(500);

    await store.dispatch(fetchOffers());

    const actions = store.getActions();
    expect(actions).toContainEqual(setOffers([]));
  });

  it('should set favorite offers when fetch success', async () => {
    const payload = makeFakeOffers(true);
    mockAxiosAdapter.onGet(ApiRoute.Favorite).reply(200, payload);

    await store.dispatch(fetchFavoriteOffers());

    const actions = store.getActions();
    expect(actions).toContainEqual(setFavoriteOffers(payload));
  });

  it('should set empty favorite offers when cannot fetch success', async () => {
    mockAxiosAdapter.onGet(ApiRoute.Favorite).reply(500);

    await store.dispatch(fetchFavoriteOffers());

    const actions = store.getActions();
    expect(actions).toContainEqual(setFavoriteOffers([]));
  });

  it('should update favorite offer when fetch success', async () => {
    const offer = makeFakeOffer(true);
    mockAxiosAdapter.onPost(`${ApiRoute.Favorite}/${offer.id}/1`).reply(200, offer);

    await store.dispatch(fetchUpdateFavoriteOffer({ offerId: offer.id, isFavorite: true }));

    const actions = store.getActions();
    expect(actions).toContainEqual(updateFavoriteOffer(offer));
  });
});
