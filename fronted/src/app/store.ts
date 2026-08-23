import { configureStore } from '@reduxjs/toolkit';
import { artistsReducer } from '../features/artists/artistsSlice';
import { albumsReducer } from '../features/albums/albumsSlice';
import { tracksReducer } from '../features/tracks/tracksSlice';
import {usersReducer} from "../features/users/usersSlice.ts";
import {trackHistoryReducer} from "../features/trackHistory/trackHistorySlice.ts";

export const store = configureStore({
    reducer: {
        artists: artistsReducer,
        albums: albumsReducer,
        tracks: tracksReducer,
        users: usersReducer,
        trackHistory: trackHistoryReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;