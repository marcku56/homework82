import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createArtist, clearArtistError } from './artistsSlice';
import FileInput from '../../component/UI/FileInput/FileInput';
import type { ArtistMutation } from '../../types';

const NewArtist = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.users.user);
    const { createLoading, error } = useAppSelector((state) => state.artists);

    const [state, setState] = useState<ArtistMutation>({
        name: '',
        information: '',
        photo: null,
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        return () => {
            dispatch(clearArtistError());
        };
    }, [user, navigate, dispatch]);

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState((prev) => ({ ...prev, photo: e.target.files![0] }));
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(createArtist(state));
        if (createArtist.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4">Add New Artist</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        required
                        label="Artist Name"
                        name="name"
                        value={state.name}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <TextField
                        label="Information"
                        name="information"
                        multiline
                        rows={3}
                        value={state.information}
                        onChange={inputChangeHandler}
                        fullWidth
                    />
                    <FileInput onChange={fileChangeHandler} name="photo" label="Artist Photo" />
                    <Button type="submit" variant="contained" disabled={createLoading} sx={{ mt: 2 }}>
                        {createLoading ? <CircularProgress size={24} /> : 'Create Artist'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NewArtist;