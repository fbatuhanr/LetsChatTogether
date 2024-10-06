import { Store } from "@reduxjs/toolkit";
import { Persistor } from "redux-persist";

export interface PersistedStore extends Store {
    __persistor?: Persistor;
}
