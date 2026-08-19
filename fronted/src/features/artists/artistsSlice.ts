import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {Artist} from '../../types';
import axiosApi from '../../axiosApi';

interface ArtistsState {
    items: Artist[];
    currentArtist: Artist | null;
    loading: boolean;
}

const initialState: ArtistsState = {
    items: [],
    currentArtist: null,
    loading: false,
};

export const fetchArtists = createAsyncThunk(
    'artists/fetchAll',
    async () => {
        const response = await axiosApi.get<Artist[]>('/artists');
        return response.data;
    }
);

export const fetchArtistById = createAsyncThunk(
    'artists/fetchById',
    async (id: string) => {
        const response = await axiosApi.get<Artist>(`/artists/${id}`);
        return response.data;
    }
);

export const artistsSlice = createSlice({
    name: 'artists',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArtists.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchArtists.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchArtists.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchArtistById.fulfilled, (state, { payload }) => {
                state.currentArtist = payload;
            });
    },
});

export const artistsReducer = artistsSlice.reducer;