import { system, name, datatype, internet } from 'faker';
import { OfferModel } from '../models/offer-model';
import { OfferShortModel } from '../models/offer-short-model';
import cities from '../mocks/cities';
import { State } from '../store';
import { Namespace } from '../store/namespace';
import { AuthorizationStatus } from '../models/authorization-status';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { createAppApi } from '../api/api';
import { UserModel } from '../models/user-model';

export const makeFakeUser = (): UserModel => ({
  name: name.firstName(),
  avatarUrl: system.filePath(),
  isPro: datatype.boolean(),
  email: internet.email(),
  token: datatype.string(20)
});

export const makeFakeOffer = (isFavorite?: boolean): OfferModel & OfferShortModel => ({
  id: datatype.uuid(),
  title: name.title(),
  type: name.title(),
  price: datatype.number(500),
  previewImage: system.filePath(),
  city: cities[Math.floor(Math.random() * cities.length)],
  location: {
    latitude: datatype.number(90),
    longitude: datatype.number(90),
    zoom: datatype.number(10)
  },
  isFavorite: isFavorite ?? datatype.boolean(),
  isPremium: datatype.boolean(),
  rating: datatype.number(5),
  description: name.title(),
  images: new Array(6).fill(null).map(() => system.filePath()),
  goods: new Array(10).fill(null).map(() => name.title()),
  host: {
    isPro: datatype.boolean(),
    name: name.title(),
    avatarUrl: system.filePath(),
  },
  bedrooms: datatype.number(5),
  maxAdults: datatype.number(10)
});

export const makeFakeOfferWith = (fields: Partial<OfferModel & OfferShortModel>): OfferModel & OfferShortModel => ({
  ...makeFakeOffer(),
  ...fields
});

export const makeFakeOffers = (isFavorite?: boolean, count?: number): (OfferModel & OfferShortModel)[] =>
  new Array(count ?? 10).fill(null).map(() => makeFakeOffer(isFavorite));

export type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAppApi>, Action>;

export const makeFakeStore = (initialState?: Partial<State>): State => ({
  [Namespace.Auth]: { authStatus: AuthorizationStatus.NoAuth, currentUser: null },
  [Namespace.Offers]: { selectedCity: cities[0], offers: null, favoriteOffers: null },
  ...initialState
});
