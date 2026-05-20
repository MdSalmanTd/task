import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist/es/constants";
import preferencesReducer from "./preferencesSlice";
import { persistStorage } from "./persistStorage";
import productsReducer from "./productsSlice";
import wishlistReducer from "./wishlistSlice";

const rootReducer = combineReducers({
    products: productsReducer,
    wishlist: wishlistReducer,
    preferences: preferencesReducer,
});

const persistConfig = {
    key: "catalog-root",
    storage: persistStorage,
    whitelist: ["wishlist", "preferences"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
