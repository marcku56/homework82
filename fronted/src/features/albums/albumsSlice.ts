import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Album, AlbumMutation } from '../../types';
import axiosApi from '../../axiosApi';

interface AlbumsState {
    items: Album[];
    currentAlbum: Album | null;
    loading: boolean;
    createLoading: boolean;
    deleteLoading: string | false;
    toggleLoading: string | false;
    error: string | null;
}

const initialState: AlbumsState = {
    items: [],
    currentAlbum: null,
    loading: false,
    createLoading: false,
    deleteLoading: false,
    toggleLoading: false,
    error: null,
};

export const fetchAlbumsByArtist = createAsyncThunk(
    'albums/fetchByArtist',
    async (artistId: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get<Album[]>(`/albums?artist=${artistId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch albums');
        }
    }
);

export const fetchAlbumById = createAsyncThunk(
    'albums/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get<Album>(`/albums/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch album');
        }
    }
);

export const createAlbum = createAsyncThunk(
    'albums/create',
    async (albumData: AlbumMutation, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', albumData.name);
            formData.append('artist', albumData.artist);
            formData.append('releaseYear', albumData.releaseYear);
            if (albumData.cover) {
                formData.append('cover', albumData.cover);
            }

            const response = await axiosApi.post<Album>('/albums', formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create album');
        }
    }
);

export const togglePublishAlbum = createAsyncThunk(
    'albums/togglePublish',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.patch<Album>(`/albums/${id}/togglePublished`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to toggle publication');
        }
    }
);

export const deleteAlbum = createAsyncThunk(
    'albums/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/albums/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete album');
        }
    }
);

export const albumsSlice = createSlice({
    name: 'albums',
    initialState,
    reducers: {
        clearAlbumError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbumsByArtist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAlbumsByArtist.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchAlbumsByArtist.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(fetchAlbumById.fulfilled, (state, { payload }) => {
                state.currentAlbum = payload;
            })
            .addCase(createAlbum.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createAlbum.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createAlbum.rejected, (state, { payload }) => {
                state.createLoading = false;
                state.error = payload as string;
            })
            .addCase(togglePublishAlbum.pending, (state, action) => {
                state.toggleLoading = action.meta.arg;
            })
            .addCase(togglePublishAlbum.fulfilled, (state, { payload }) => {
                state.toggleLoading = false;
                const index = state.items.findIndex((item) => item._id === payload._id);
                if (index !== -1) {
                    state.items[index] = payload;
                }
            })
            .addCase(togglePublishAlbum.rejected, (state, { payload }) => {
                state.toggleLoading = false;
                state.error = payload as string;
            })
            .addCase(deleteAlbum.pending, (state, action) => {
                state.deleteLoading = action.meta.arg;
            })
            .addCase(deleteAlbum.fulfilled, (state, { payload }) => {
                state.deleteLoading = false;
                state.items = state.items.filter((item) => item._id !== payload);
            })
            .addCase(deleteAlbum.rejected, (state, { payload }) => {
                state.deleteLoading = false;
                state.error = payload as string;
            });
    },
});

export const { clearAlbumError } = albumsSlice.actions;
export const albumsReducer = albumsSlice.reducer;