import { configureStore } from '@reduxjs/toolkit';
import { blogApi } from './features/blog/blogApi';
import { authApi } from './features/auth/authApi';
import { newsApi } from './features/news/newsApi';
import { galleryApi } from './features/gallery/galleryApi';

import authReducer from "./features/auth/authSlice"
import blogReducer from "./features/blog/blogSlice"
import { partnersApi } from './features/partners/partnersApi';
import { productsApi } from './features/product/productsApi';
import { contactApi } from './features/contact/contact';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add auth reducer here
    blogs: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [partnersApi.reducerPath]: partnersApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      blogApi.middleware, 
      authApi.middleware,
      newsApi.middleware,
      galleryApi.middleware,
      partnersApi.middleware,
      productsApi.middleware,
      contactApi.middleware,
    ),
});

// Types for Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
