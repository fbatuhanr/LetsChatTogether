import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./features/authSlice";
import notificationSlice from "./features/notificationSlice";
import { PersistedStore } from "../types/Redux.types";

const persistConfig = {
  key: "persist",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  notifications: notificationSlice
});

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const makeStore = (): PersistedStore => {
  // PersistedStore tipini döndür
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore() as PersistedStore;
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store: PersistedStore = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });
    store.__persistor = persistStore(store);
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
