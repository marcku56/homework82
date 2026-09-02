import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Track, TrackMutation } from '../../types';
import axiosApi from '../../axiosApi';

interface TracksState {
    items: Track[];
    loading: boolean;
    createLoading: boolean;
    deleteLoading: string | false;
    toggleLoading: string | false;
    error: string | null;
}

const initialState: TracksState = {
    items: [],
    loading: false,
    createLoading: false,
    deleteLoading: false,
    toggleLoading: false,
    error: null,
};

export const fetchTracksByAlbum = createAsyncThunk(
    'tracks/fetchByAlbum',
    async (albumId: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get<Track[]>(`/tracks?album=${albumId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch tracks');
        }
    }
);

export const createTrack = createAsyncThunk(
    'tracks/create',
    async (trackData: TrackMutation, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post<Track>('/tracks', {
                name: trackData.name,
                album: trackData.album,
                duration: trackData.duration,
                trackNumber: Number(trackData.trackNumber),
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create track');
        }
    }
);

export const togglePublishTrack = createAsyncThunk(
    'tracks/togglePublish',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.patch<Track>(`/tracks/${id}/togglePublished`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to toggle publication');
        }
    }
);

export const deleteTrack = createAsyncThunk(
    'tracks/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/tracks/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete track');
        }
    }
);

export const tracksSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        clearTrackError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTracksByAlbum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTracksByAlbum.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchTracksByAlbum.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(createTrack.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createTrack.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createTrack.rejected, (state, { payload }) => {
                state.createLoading = false;
                state.error = payload as string;
            })
            .addCase(togglePublishTrack.pending, (state, action) => {
                state.toggleLoading = action.meta.arg;
            })
            .addCase(togglePublishTrack.fulfilled, (state, { payload }) => {
                state.toggleLoading = false;
                const index = state.items.findIndex((item) => item._id === payload._id);
                if (index !== -1) {
                    state.items[index] = payload;
                }
            })
            .addCase(togglePublishTrack.rejected, (state, { payload }) => {
                state.toggleLoading = false;
                state.error = payload as string;
            })
            .addCase(deleteTrack.pending, (state, action) => {
                state.deleteLoading = action.meta.arg;
            })
            .addCase(deleteTrack.fulfilled, (state, { payload }) => {
                state.deleteLoading = false;
                state.items = state.items.filter((item) => item._id !== payload);
            })
            .addCase(deleteTrack.rejected, (state, { payload }) => {
                state.deleteLoading = false;
                state.error = payload as string;
            });
    },
});

export const { clearTrackError } = tracksSlice.actions;
export const tracksReducer = tracksSlice.reducer;