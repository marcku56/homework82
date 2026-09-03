import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAlbumsByArtist, deleteAlbum, togglePublishAlbum, clearAlbumError } from './albumsSlice';
import { fetchArtistById } from '../artists/artistsSlice';
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
import { api } from '../../constant';

const Albums = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.users.user);
    const { items: albums, loading, deleteLoading, toggleLoading, error } = useAppSelector((state) => state.albums);
    const { currentArtist } = useAppSelector((state) => state.artists);

    useEffect(() => {
        if (id) {
            dispatch(fetchArtistById(id));
            dispatch(fetchAlbumsByArtist(id));
        }
        return () => {
            dispatch(clearAlbumError());
        };
    }, [dispatch, id]);

    const handleDelete = async (albumId: string) => {
        if (window.confirm('Are you sure you want to delete this album?')) {
            await dispatch(deleteAlbum(albumId));
        }
    };

    const handleTogglePublish = async (albumId: string) => {
        await dispatch(togglePublishAlbum(albumId));
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
            {currentArtist && (
                <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                    Artist: {currentArtist.name}
                </Typography>
            )}
            <Grid container spacing={3}>
                {albums.map((album) => (
                    <Grid key={album._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardActionArea component={Link} to={`/albums/${album._id}`}>
                                {album.cover && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`${api}/${album.cover}`}
                                        alt={album.name}
                                    />
                                )}
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6">{album.name}</Typography>
                                        {user?.role === 'admin' && !album.isPublished && (
                                            <Chip label="Unpublic" color="warning" size="small" />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Release year: {album.releaseYear}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            {user?.role === 'admin' && (
                                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color={album.isPublished ? 'warning' : 'success'}
                                        disabled={toggleLoading === album._id}
                                        onClick={() => handleTogglePublish(album._id)}
                                    >
                                        {toggleLoading === album._id ? (
                                            <CircularProgress size={20} />
                                        ) : album.isPublished ? (
                                            'Remove from publication'
                                        ) : (
                                            'Upload'
                                        )}
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        disabled={deleteLoading === album._id}
                                        onClick={() => handleDelete(album._id)}
                                    >
                                        {deleteLoading === album._id ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
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

export default Albums;