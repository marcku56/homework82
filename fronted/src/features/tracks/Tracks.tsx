import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTracksByAlbum, deleteTrack, togglePublishTrack, clearTrackError } from './tracksSlice';
import { fetchAlbumById } from '../albums/albumsSlice';
import { postTrackHistory } from '../trackHistory/trackHistorySlice';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    Paper,
    Divider,
    IconButton,
    Button,
    Chip,
    Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { Artist } from '../../types';

const Tracks = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.users.user);
    const { items: tracks, loading, deleteLoading, toggleLoading, error } = useAppSelector((state) => state.tracks);
    const { currentAlbum } = useAppSelector((state) => state.albums);

    useEffect(() => {
        if (id) {
            dispatch(fetchAlbumById(id));
            dispatch(fetchTracksByAlbum(id));
        }
        return () => {
            dispatch(clearTrackError());
        };
    }, [dispatch, id]);

    const playTrackHandler = (trackId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(postTrackHistory(trackId));
    };

    const handleDelete = async (trackId: string) => {
        if (window.confirm('Are you sure you want to delete this track?')) {
            await dispatch(deleteTrack(trackId));
        }
    };

    const handleTogglePublish = async (trackId: string) => {
        await dispatch(togglePublishTrack(trackId));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const artistName = typeof currentAlbum?.artist === 'object' ? (currentAlbum.artist as Artist).name : '';

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {currentAlbum && (
                <Box sx={{ mb: 3 }}>
                    {artistName && (
                        <Typography variant="h4" gutterBottom>
                            Artist: {artistName}
                        </Typography>
                    )}
                    <Typography variant="h5" color="text.secondary">
                        Album: {currentAlbum.name}
                    </Typography>
                </Box>
            )}

            <Paper variant="outlined">
                <List disablePadding>
                    {tracks.map((track, index) => (
                        <Box key={track._id}>
                            <ListItem
                                secondaryAction={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {user?.role === 'admin' && (
                                            <>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color={track.isPublished ? 'warning' : 'success'}
                                                    disabled={toggleLoading === track._id}
                                                    onClick={() => handleTogglePublish(track._id)}
                                                >
                                                    {toggleLoading === track._id ? (
                                                        <CircularProgress size={16} />
                                                    ) : track.isPublished ? (
                                                        'Remove'
                                                    ) : (
                                                        'Upload'
                                                    )}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="error"
                                                    disabled={deleteLoading === track._id}
                                                    onClick={() => handleDelete(track._id)}
                                                >
                                                    {deleteLoading === track._id ? (
                                                        <CircularProgress size={16} color="inherit" />
                                                    ) : (
                                                        'Delete'
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                        <IconButton
                                            edge="end"
                                            aria-label="play"
                                            color="primary"
                                            onClick={() => playTrackHandler(track._id)}
                                        >
                                            <PlayArrowIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <Typography variant="body1" sx={{ mr: 2, minWidth: 24, fontWeight: 'bold' }}>
                                    {track.trackNumber}
                                </Typography>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span>{track.name}</span>
                                            {user?.role === 'admin' && !track.isPublished && (
                                                <Chip label="Unpublic" color="warning" size="small" />
                                            )}
                                        </Box>
                                    }
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
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