import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Namespace } from './namespace';
import handleRequest from '../tools/handle-request';
import cities from '../mocks/cities';
import { OfferShortModel } from '../models/offer-short-model';
import { CityModel } from '../models/city';
import { AxiosInstance } from 'axios';
import { ApiRoute } from '../configuration/api-route';

export type OffersState = {
  selectedCity: CityModel;
  offers: OfferShortModel[] | null;
  favoriteOffers: OfferShortModel[] | null;
}

const initialState: OffersState = {
  selectedCity: cities[0],
  offers: null,
  favoriteOffers: null
};

type AsyncThunkConfig = {
  extra: AxiosInstance;
}

export const selectCity = createAction<CityModel>('select_city');
export const setOffers = createAction<OfferShortModel[] | null>('set_offers');
export const setFavoriteOffers = createAction<OfferShortModel[] | null>('set_favorite_offers');
export const updateFavoriteOffer = createAction<OfferShortModel>('update_favorite_offer');

export const fetchOffers = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  'fetch_offers',
  async (_arg, { dispatch, extra: api }) => handleRequest(
    () => api.get<OfferShortModel[]>(ApiRoute.Offers),
    (data) => dispatch(setOffers(data)),
    {},
    () => dispatch(setOffers([]))
  ));

export const fetchFavoriteOffers = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  'fetch_favorite_offers',
  async (_arg, { dispatch, extra: api }) => handleRequest(
    () => api.get<OfferShortModel[]>(ApiRoute.Favorite),
    (data) => dispatch(setFavoriteOffers(data)),
    {},
    () => dispatch(setFavoriteOffers([]))
  ));

export const fetchUpdateFavoriteOffer = createAsyncThunk<void, { offerId: string; isFavorite: boolean }, AsyncThunkConfig>(
  'fetch_update_favorite_offer',
  async (arg, { dispatch, extra: api }) => handleRequest(
    () => api.post<OfferShortModel>(`${ApiRoute.Favorite}/${arg.offerId}/${arg.isFavorite ? 1 : 0}`),
    (data) => dispatch(updateFavoriteOffer(data))
  ));

export const offersSlice = createSlice({
  name: Namespace.Offers,
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(selectCity, (state, { payload }) => {
      state.selectedCity = payload;
    })
    .addCase(setOffers, (state, { payload }) => {
      state.offers = payload;
    })
    .addCase(setFavoriteOffers, (state, { payload }) => {
      state.favoriteOffers = payload;
    })
    .addCase(updateFavoriteOffer, (state, { payload }) => {
      if (state.favoriteOffers !== null) {
        const index = state.favoriteOffers.findIndex((o) => o.id === payload.id);
        if (payload.isFavorite && index < 0) {
          state.favoriteOffers.push(payload);
        } else if (!payload.isFavorite && index >= 0) {
          state.favoriteOffers.splice(index, 1);
        }
      }
      if (state.offers !== null) {
        const index = state.offers.findIndex((o) => o.id === payload.id);
        if (index >= 0) {
          state.offers[index] = payload;
        }
      }
    })
});
