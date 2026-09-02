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
import { createAlbum, clearAlbumError } from './albumsSlice';
import { fetchArtists } from '../artists/artistsSlice';
import FileInput from '../../component/UI/FileInput/FileInput';
import type { AlbumMutation } from '../../types';

const NewAlbum = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.users.user);
    const artists = useAppSelector((state) => state.artists.items);
    const { createLoading, error } = useAppSelector((state) => state.albums);

    const [state, setState] = useState<AlbumMutation>({
        name: '',
        artist: '',
        releaseYear: new Date().getFullYear().toString(),
        cover: null,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(fetchArtists());
        return () => {
            dispatch(clearAlbumError());
        };
    }, [user, navigate, dispatch]);

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const selectChangeHandler = (e: SelectChangeEvent) => {
        setState((prev) => ({ ...prev, artist: e.target.value }));
    };

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState((prev) => ({ ...prev, cover: e.target.files![0] }));
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(createAlbum(state));
        if (createAlbum.fulfilled.match(result)) {
            navigate(`/artists/${state.artist}`);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Add New Album</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        required
                        label="Album Name"
                        name="name"
                        value={state.name}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <FormControl fullWidth required>
                        <InputLabel id="artist-select-label">Artist</InputLabel>
                        <Select
                            labelId="artist-select-label"
                            value={state.artist}
                            label="Artist"
                            onChange={selectChangeHandler}
                        >
                            {artists.map((artist) => (
                                <MenuItem key={artist._id} value={artist._id}>
                                    {artist.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        type="number"
                        label="Release Year"
                        name="releaseYear"
                        value={state.releaseYear}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <FileInput onChange={fileChangeHandler} name="cover" label="Album Cover" />
                    <Button type="submit" variant="contained" disabled={createLoading} sx={{ mt: 2 }}>
                        {createLoading ? <CircularProgress size={24} /> : 'Create Album'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NewAlbum;