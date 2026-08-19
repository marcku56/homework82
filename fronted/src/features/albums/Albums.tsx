import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAlbumsByArtist } from './albumsSlice';
import { fetchArtistById } from '../artists/artistsSlice';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { api } from '../../constant';

const Albums = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { items: albums, loading } = useAppSelector((state) => state.albums);
    const { currentArtist } = useAppSelector((state) => state.artists);

    useEffect(() => {
        if (id) {
            dispatch(fetchArtistById(id));
            dispatch(fetchAlbumsByArtist(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {currentArtist && (
                <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                    Исполнитель: {currentArtist.name}
                </Typography>
            )}
            <Grid container spacing={3}>
                {albums.map((album) => (
                    <Grid
                        key={album._id}
                        size={{ xs: 12, sm: 6, md: 4 }}
                    >
                        <Card>
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
                                    <Typography variant="h6">{album.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Год выпуска: {album.releaseYear}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Albums;