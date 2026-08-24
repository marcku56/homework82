import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTrackHistory } from './trackHistorySlice';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Divider,
} from '@mui/material';

const TrackHistory = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.users.user);
    const { items: history, loading } = useAppSelector((state) => state.trackHistory);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(fetchTrackHistory());
    }, [dispatch, user, navigate]);

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ mb: 3 }}>
                History listened
            </Typography>
            {history.length === 0 ? (
                <Typography color="text.secondary">History empty now</Typography>
            ) : (
                <Paper variant="outlined">
                    <List disablePadding>
                        {history.map((item, index) => (
                            <Box key={item._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`${item.artist?.name || 'unknown artist'} — ${item.track?.name || 'unknown track'}`}
                                        secondary={`listened: ${new Date(item.datetime).toLocaleString('ru-RU')}`}
                                    />
                                </ListItem>
                                {index < history.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            )}
        </Container>
    );
};

export default TrackHistory;