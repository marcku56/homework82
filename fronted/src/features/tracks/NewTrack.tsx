import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTrack, clearTrackError } from './tracksSlice';
import { fetchArtists } from '../artists/artistsSlice';
import { fetchAlbumsByArtist } from '../albums/albumsSlice';
import type { TrackMutation } from '../../types';

const NewTrack = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.users.user);
    const artists = useAppSelector((state) => state.artists.items);
    const albums = useAppSelector((state) => state.albums.items);
    const { createLoading, error } = useAppSelector((state) => state.tracks);

    const [selectedArtist, setSelectedArtist] = useState('');
    const [state, setState] = useState<TrackMutation>({
        name: '',
        album: '',
        duration: '',
        trackNumber: '1',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(fetchArtists());
        return () => {
            dispatch(clearTrackError());
        };
    }, [user, navigate, dispatch]);

    const artistChangeHandler = (e: SelectChangeEvent) => {
        const artistId = e.target.value;
        setSelectedArtist(artistId);
        setState((prev) => ({ ...prev, album: '' }));
        if (artistId) {
            dispatch(fetchAlbumsByArtist(artistId));
        }
    };

    const albumChangeHandler = (e: SelectChangeEvent) => {
        setState((prev) => ({ ...prev, album: e.target.value }));
    };

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(createTrack(state));
        if (createTrack.fulfilled.match(result)) {
            navigate(`/albums/${state.album}`);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Add New Track</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        required
                        label="Track Name"
                        name="name"
                        value={state.name}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <FormControl fullWidth required>
                        <InputLabel id="artist-select-label">Artist</InputLabel>
                        <Select
                            labelId="artist-select-label"
                            value={selectedArtist}
                            label="Artist"
                            onChange={artistChangeHandler}
                        >
                            {artists.map((artist) => (
                                <MenuItem key={artist._id} value={artist._id}>
                                    {artist.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required disabled={!selectedArtist}>
                        <InputLabel id="album-select-label">Album</InputLabel>
                        <Select
                            labelId="album-select-label"
                            value={state.album}
                            label="Album"
                            onChange={albumChangeHandler}
                        >
                            {albums.map((album) => (
                                <MenuItem key={album._id} value={album._id}>
                                    {album.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        label="Duration (e.g. 3:45)"
                        name="duration"
                        value={state.duration}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <TextField
                        required
                        type="number"
                        label="Track Number"
                        name="trackNumber"
                        value={state.trackNumber}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" disabled={createLoading} sx={{ mt: 2 }}>
                        {createLoading ? <CircularProgress size={24} /> : 'Create Track'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NewTrack;