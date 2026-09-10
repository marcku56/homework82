import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, clearUserErrors } from './usersSlice';
import { useNavigate, Link } from 'react-router-dom';
import FileInput from '../../component/UI/FileInput/FileInput';
import type { RegisterMutation } from '../../types';

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { registerLoading, registerError } = useAppSelector((state) => state.users);

    const [state, setState] = useState<RegisterMutation>({
        username: '',
        password: '',
        displayName: '',
        avatar: null,
    });

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
    };

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState((prev) => ({ ...prev, avatar: e.target.files![0] }));
        }
    };

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        dispatch(clearUserErrors());
        const result = await dispatch(register(state));
        if (register.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                {registerError && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {registerError}
                    </Alert>
                )}
                <Box component="form" onSubmit={submitHandler} sx={
                    {
                        mt: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2 }
                }>
                    <TextField
                        required
                        fullWidth
                        label="Username"
                        name="username"
                        value={state.username}
                        onChange={inputChangeHandler}
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                    />
                    <TextField
                        required
                        fullWidth
                        name="displayName"
                        label="Display Name"
                        value={state.displayName}
                        onChange={inputChangeHandler}
                    />
                    <FileInput onChange={fileChangeHandler} name="avatar" label="Avatar" />
                    <Button type="submit" fullWidth variant="contained" disabled={registerLoading}>
                        {registerLoading ? <CircularProgress size={24} /> : 'Sign up'}
                    </Button>
                    <Box>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Already have account? Sign in
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;