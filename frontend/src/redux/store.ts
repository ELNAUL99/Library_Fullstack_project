import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authorsReducer from './reducer/authorReducer';
import userReducer from './reducer/userReducer';
import categoriesReducer from './reducer/categoryReducer';
import publishersReducer from './reducer/publisherReducer';
import rentalsReducer from './reducer/rentalReducer';
import booksReducer from './reducer/bookReducer';

export const store = configureStore({
  reducer: {
    authorsReducer,
    categoriesReducer,
    publishersReducer,
    userReducer,
    rentalsReducer,
    booksReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
