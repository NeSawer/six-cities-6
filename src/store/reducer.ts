import { combineReducers } from '@reduxjs/toolkit';
import { Namespace } from './namespace';
import { authSlice } from './auth';
import { offersSlice } from './offers';

export const rootReducer = combineReducers({
  [Namespace.Auth]: authSlice.reducer,
  [Namespace.Offers]: offersSlice.reducer
});
