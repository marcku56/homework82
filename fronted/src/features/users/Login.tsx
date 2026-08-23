import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearUserErrors } from './usersSlice';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loginLoading, loginError } = useAppSelector((state) => state.users);

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
        const result = await dispatch(login(state));
        if (login.fulfilled.match(result)) {
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
                    Вход в систему
                </Typography>
                {loginError && (
                    <Alert severity="error" sx={{
                        mt: 2,
                        width: '100%'
                    }}>
                        {loginError}
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
                        label="Имя пользователя"
                        name="username"
                        value={state.username}
                        onChange={inputChangeHandler}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{
                        mt: 3,
                        mb: 2
                    }} disabled={loginLoading}>
                        {loginLoading ? <CircularProgress size={24} /> : 'Войти'}
                    </Button>
                    <Box>
                        <Link to="/register" style={{
                            textDecoration: 'none',
                            color: '#1976d2'
                        }}>
                            Нет аккаунта? Зарегистрироваться
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;