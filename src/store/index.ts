import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { appApi } from '../api/api';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: appApi,
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

export type State = ReturnType<typeof store.getState>;
