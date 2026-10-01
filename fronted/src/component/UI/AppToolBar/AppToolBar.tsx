import { AppBar, Toolbar, Typography, Container, Box, Button, CircularProgress, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { logout } from '../../../features/users/usersSlice';
import { api } from '../../../constant';

const AppToolbar = () => {
    const { user, logoutLoading } = useAppSelector((state) => state.users);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    // dfldl

    let avatarUrl = '';
    if (user?.avatar) {
        avatarUrl = user.avatar.startsWith('http') ? user.avatar : `${api}/${user.avatar}`;
    }

    return (
        <AppBar position="sticky" sx={{ mb: 4 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        Music App
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user ? (
                            <>
                                <Button component={Link} to="/artists/new" color="inherit">
                                    Add Artist
                                </Button>
                                <Button component={Link} to="/albums/new" color="inherit">
                                    Add Album
                                </Button>
                                <Button component={Link} to="/tracks/new" color="inherit">
                                    Add Track
                                </Button>
                                <Button component={Link} to="/track_history" color="inherit">
                                    Track History
                                </Button>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar src={avatarUrl} alt={user.displayName} />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Hi {user.displayName} ({user.role})!
                                    </Typography>
                                </Box>
                                <Button color="inherit" onClick={handleLogout} disabled={logoutLoading}>
                                    {logoutLoading ? <CircularProgress size={20} color="inherit" /> : 'Exit'}
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