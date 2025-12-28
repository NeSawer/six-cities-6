import { combineReducers } from '@reduxjs/toolkit';
import { Namespace } from './namespace';
import { authSlice } from './auth/auth';
import { offersSlice } from './offers/offers';

export const rootReducer = combineReducers({
  [Namespace.Auth]: authSlice.reducer,
  [Namespace.Offers]: offersSlice.reducer
});
