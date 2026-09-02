import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Artist, ArtistMutation } from '../../types';
import axiosApi from '../../axiosApi';

interface ArtistsState {
    items: Artist[];
    currentArtist: Artist | null;
    loading: boolean;
    createLoading: boolean;
    deleteLoading: string | false;
    toggleLoading: string | false;
    error: string | null;
}

const initialState: ArtistsState = {
    items: [],
    currentArtist: null,
    loading: false,
    createLoading: false,
    deleteLoading: false,
    toggleLoading: false,
    error: null,
};

export const fetchArtists = createAsyncThunk(
    'artists/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get<Artist[]>('/artists');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch artists');
        }
    }
);

export const fetchArtistById = createAsyncThunk(
    'artists/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get<Artist>(`/artists/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch artist');
        }
    }
);

export const createArtist = createAsyncThunk(
    'artists/create',
    async (artistData: ArtistMutation, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', artistData.name);
            if (artistData.information) {
                formData.append('information', artistData.information);
            }
            if (artistData.photo) {
                formData.append('photo', artistData.photo);
            }

            const response = await axiosApi.post<Artist>('/artists', formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create artist');
        }
    }
);

export const togglePublishArtist = createAsyncThunk(
    'artists/togglePublish',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.patch<Artist>(`/artists/${id}/togglePublished`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to toggle publication');
        }
    }
);

export const deleteArtist = createAsyncThunk(
    'artists/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/artists/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete artist');
        }
    }
);

export const artistsSlice = createSlice({
    name: 'artists',
    initialState,
    reducers: {
        clearArtistError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArtists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArtists.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchArtists.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(fetchArtistById.fulfilled, (state, { payload }) => {
                state.currentArtist = payload;
            })
            .addCase(createArtist.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createArtist.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createArtist.rejected, (state, { payload }) => {
                state.createLoading = false;
                state.error = payload as string;
            })
            .addCase(togglePublishArtist.pending, (state, action) => {
                state.toggleLoading = action.meta.arg;
            })
            .addCase(togglePublishArtist.fulfilled, (state, { payload }) => {
                state.toggleLoading = false;
                const index = state.items.findIndex((item) => item._id === payload._id);
                if (index !== -1) {
                    state.items[index] = payload;
                }
            })
            .addCase(togglePublishArtist.rejected, (state, { payload }) => {
                state.toggleLoading = false;
                state.error = payload as string;
            })
            .addCase(deleteArtist.pending, (state, action) => {
                state.deleteLoading = action.meta.arg;
            })
            .addCase(deleteArtist.fulfilled, (state, { payload }) => {
                state.deleteLoading = false;
                state.items = state.items.filter((item) => item._id !== payload);
            })
            .addCase(deleteArtist.rejected, (state, { payload }) => {
                state.deleteLoading = false;
                state.error = payload as string;
            });
    },
});

export const { clearArtistError } = artistsSlice.actions;
export const artistsReducer = artistsSlice.reducer;