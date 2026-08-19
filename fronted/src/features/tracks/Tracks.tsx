import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTracksByAlbum } from './tracksSlice';
import { fetchAlbumById } from '../albums/albumsSlice';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box, Paper, Divider } from '@mui/material';
import type {Artist} from '../../types';

const Tracks = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { items: tracks, loading } = useAppSelector((state) => state.tracks);
    const { currentAlbum } = useAppSelector((state) => state.albums);

    useEffect(() => {
        if (id) {
            dispatch(fetchAlbumById(id));
            dispatch(fetchTracksByAlbum(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const artistName = typeof currentAlbum?.artist === 'object'
        ? (currentAlbum.artist as Artist).name
        : '';

    return (
        <Box>
            {currentAlbum && (
                <Box
                    sx={{
                        mb: 3
                    }}>
                    {artistName && (
                        <Typography variant="h4" gutterBottom>
                            Исполнитель: {artistName}
                        </Typography>
                    )}
                    <Typography variant="h5" color="text.secondary">
                        Альбом: {currentAlbum.name}
                    </Typography>
                </Box>
            )}

            <Paper variant="outlined">
                <List disablePadding>
                    {tracks.map((track, index) => (
                        <Box key={track._id}>
                            <ListItem>
                                <Typography variant="body1" sx={{ mr: 2, minWidth: 24, fontWeight: 'bold' }}>
                                    {track.trackNumber}
                                </Typography>
                                <ListItemText
                                    primary={track.name}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {track.duration}
                                </Typography>
                            </ListItem>
                            {index < tracks.length - 1 && <Divider />}
                        </Box>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default Tracks;