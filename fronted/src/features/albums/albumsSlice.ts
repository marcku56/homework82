import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {Album} from '../../types';
import axiosApi from '../../axiosApi';

interface AlbumsState {
    items: Album[];
    currentAlbum: Album | null;
    loading: boolean;
}

const initialState: AlbumsState = {
    items: [],
    currentAlbum: null,
    loading: false,
};

export const fetchAlbumsByArtist = createAsyncThunk(
    'albums/fetchByArtist',
    async (artistId: string) => {
        const response = await axiosApi.get<Album[]>(`/albums?artist=${artistId}`);
        return response.data;
    }
);

export const fetchAlbumById = createAsyncThunk(
    'albums/fetchById',
    async (id: string) => {
        const response = await axiosApi.get<Album>(`/albums/${id}`);
        return response.data;
    }
);

export const albumsSlice = createSlice({
    name: 'albums',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbumsByArtist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAlbumsByArtist.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchAlbumsByArtist.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchAlbumById.fulfilled, (state, { payload }) => {
                state.currentAlbum = payload;
            });
    },
});

export const albumsReducer = albumsSlice.reducer;