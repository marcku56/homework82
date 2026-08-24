import {combineReducers, configureStore} from '@reduxjs/toolkit';
import { artistsReducer } from '../features/artists/artistsSlice';
import { albumsReducer } from '../features/albums/albumsSlice';
import { tracksReducer } from '../features/tracks/tracksSlice';
import {usersReducer} from "../features/users/usersSlice.ts";
import {trackHistoryReducer} from "../features/trackHistory/trackHistorySlice.ts";
import storage from "redux-persist/lib/storage"
import {persistReducer, persistStore} from "redux-persist"
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";

const usersPersistConfig = {
    key: 'music:users',
    storage: storage.default,
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    tracks: tracksReducer,
    artists: artistsReducer,
    trackHistory: trackHistoryReducer,
    albums: albumsReducer,
    users: persistReducer(usersPersistConfig, usersReducer),
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
    }
});


export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;