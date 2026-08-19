import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {Track} from '../../types';
import axiosApi from '../../axiosApi';

interface TracksState {
    items: Track[];
    loading: boolean;
}

const initialState: TracksState = {
    items: [],
    loading: false,
};

export const fetchTracksByAlbum = createAsyncThunk(
    'tracks/fetchByAlbum',
    async (albumId: string) => {
        const response = await axiosApi.get<Track[]>(`/tracks?album=${albumId}`);
        return response.data;
    }
);

export const tracksSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTracksByAlbum.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTracksByAlbum.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchTracksByAlbum.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const tracksReducer = tracksSlice.reducer;