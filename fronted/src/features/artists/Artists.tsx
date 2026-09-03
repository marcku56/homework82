import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchArtists, deleteArtist, togglePublishArtist, clearArtistError } from './artistsSlice';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    CircularProgress,
    Box,
    Button,
    Chip,
    Alert,
    CardActions,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { api } from '../../constant';

const Artists = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.users.user);
    const { items: artists, loading, deleteLoading, toggleLoading, error } = useAppSelector((state) => state.artists);

    useEffect(() => {
        dispatch(fetchArtists());
        return () => {
            dispatch(clearArtistError());
        };
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this artist?')) {
            await dispatch(deleteArtist(id));
        }
    };

    const handleTogglePublish = async (id: string) => {
        await dispatch(togglePublishArtist(id));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={3}>
                {artists.map((artist) => (
                    <Grid key={artist._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardActionArea component={Link} to={`/artists/${artist._id}`}>
                                {artist.photo && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`${api}/${artist.photo}`}
                                        alt={artist.name}
                                    />
                                )}
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6">{artist.name}</Typography>
                                        {user?.role === 'admin' && !artist.isPublished && (
                                            <Chip label="Unpublic" color="warning" size="small" />
                                        )}
                                    </Box>
                                    {artist.information && (
                                        <Typography variant="body2" color="text.secondary">
                                            {artist.information}
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                            {user?.role === 'admin' && (
                                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color={artist.isPublished ? 'warning' : 'success'}
                                        disabled={toggleLoading === artist._id}
                                        onClick={() => handleTogglePublish(artist._id)}
                                    >
                                        {toggleLoading === artist._id ? (
                                            <CircularProgress size={20} />
                                        ) : artist.isPublished ? (
                                            'remove from publication'
                                        ) : (
                                            'Upload'
                                        )}
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        disabled={deleteLoading === artist._id}
                                        onClick={() => handleDelete(artist._id)}
                                    >
                                        {deleteLoading === artist._id ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Artists;