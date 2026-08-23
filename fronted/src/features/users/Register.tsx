import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, clearUserErrors } from './usersSlice';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { registerLoading, registerError } = useAppSelector((state) => state.users);

    const [state, setState] = useState({
        username: '',
        password: '',
    });

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev) => ({ ...prev, [name]: value }));
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
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography
                    component="h1"
                    variant="h5"
                >
                    Sign up
                </Typography>
                {registerError && (
                    <Alert severity="error" sx={{
                        mt: 2,
                        width: '100%'
                    }}>
                        {registerError}
                    </Alert>
                )}
                <Box component="form" onSubmit={submitHandler} sx={{
                    mt: 1,
                    width: '100%'
                }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="username"
                        name="username"
                        value={state.username}
                        onChange={inputChangeHandler}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="password"
                        type="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{
                        mt: 3,
                        mb: 2
                    }} disabled={registerLoading}>
                        {registerLoading ? <CircularProgress size={24} /> : 'Sign up'}
                    </Button>
                    <Box>
                        <Link to="/login" style={{
                            textDecoration: 'none',
                            color: '#1976d2'
                        }}>
                            Already have account? Sign in
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;