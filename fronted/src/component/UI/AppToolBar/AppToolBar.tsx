import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { unsetUser } from '../../../features/users/usersSlice';

const AppToolbar = () => {
    const user = useAppSelector((state) => state.users.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(unsetUser());
        navigate('/login');
    };

    return (
        <AppBar position="sticky" sx={{ mb: 4 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ color: 'inherit',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                    }}
                    >
                        Music App
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user ? (
                            <>
                                <Button component={Link} to="/track_history" color="inherit">
                                    Track History
                                </Button>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Hi {user.username}!
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>
                                    Exit
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button component={Link} to="/register" color="inherit">
                                    Sign up
                                </Button>
                                <Button component={Link} to="/login" color="inherit">
                                    Sign in
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppToolbar;