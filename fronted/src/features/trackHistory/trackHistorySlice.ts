import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TrackHistoryItem } from '../../types';
import axiosApi from '../../axiosApi';
import type { RootState } from '../../app/store';

interface TrackHistoryState {
    items: TrackHistoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: TrackHistoryState = {
    items: [],
    loading: false,
    error: null,
};

export const postTrackHistory = createAsyncThunk<void, string, { state: RootState }>(
    'trackHistory/post',
    async (trackId: string, { getState, rejectWithValue }) => {
        try {
            const token = getState().users.user?.token;
            if (!token) return;

            await axiosApi.post(
                '/track_history',
                { track: trackId },
                { headers: { Authorization: token } }
            );
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to record track play');
        }
    }
);

export const fetchTrackHistory = createAsyncThunk<TrackHistoryItem[], void, { state: RootState }>(
    'trackHistory/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().users.user?.token;
            if (!token) return rejectWithValue('No token');

            const response = await axiosApi.get<TrackHistoryItem[]>('/track_history', {
                headers: { Authorization: token },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch track history');
        }
    }
);

export const trackHistorySlice = createSlice({
    name: 'trackHistory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrackHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrackHistory.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchTrackHistory.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
    },
});

export const trackHistoryReducer = trackHistorySlice.reducer;