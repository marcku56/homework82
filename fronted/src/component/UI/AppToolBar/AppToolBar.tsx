import {AppBar, Toolbar, Typography, Container, Button} from '@mui/material';
import {Link, NavLink} from 'react-router-dom';

const AppToolbar = () => {
    return (
        <AppBar position="sticky" sx={{ mb: 4 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
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
                    <div>
                        <Button component={NavLink} to='/register' color="inherit">Регистрация</Button>
                        <Button component={NavLink} to='/login' color="inherit">Логин</Button>
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppToolbar;