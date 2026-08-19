import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchArtists } from './artistsSlice';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { api } from '../../constant';

const Artists = () => {
    const dispatch = useAppDispatch();
    const { items: artists, loading } = useAppSelector((state) => state.artists);

    useEffect(() => {
        dispatch(fetchArtists());
    }, [dispatch]);

    if (loading) {
        return (
            <Box
                sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {artists.map((artist) => (
                <Grid
                    key={artist._id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                >
                    <Card>
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
                                <Typography variant="h6">{artist.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Artists;