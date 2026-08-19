import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const AppToolbar = () => {
    return (
        <AppBar position="sticky" sx={{ mb: 4 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        Music App
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppToolbar;