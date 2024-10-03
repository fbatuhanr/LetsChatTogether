import { Store } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";

export interface PersistedStore extends Store {
    __persistor?: ReturnType<typeof persistStore>;
}