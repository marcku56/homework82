import { Router } from 'express';
import { TrackHistory } from '../models/TrackHistory';
import { User } from '../models/User';
import { Track } from '../models/Track';
import { Album } from '../models/Album';

const trackHistoryRouter = Router();

const getUserByToken = async (token: string | undefined) => {
    if (!token) {
        return null;
    }

    return User.findOne({ token });
};

trackHistoryRouter.post('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const user = await getUserByToken(token);

        if (!user) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        if (!req.body.track) {
            res.status(400).send({ error: 'Track ID is required' });
            return;
        }

        const track = await Track.findById(req.body.track);

        if (!track) {
            res.status(404).send({ error: 'Track not found' });
            return;
        }

        const album = await Album.findById(track.album);

        if (!album) {
            res.status(404).send({ error: 'Album not found' });
            return;
        }

        const trackHistory = new TrackHistory({
            user: user._id,
            track: track._id,
            artist: album.artist,
            datetime: new Date(),
        });

        await trackHistory.save();
        res.status(201).send(trackHistory);
    } catch (error) {
        if (
            error instanceof Error &&
            (error.name === 'ValidationError' || error.name === 'CastError')
        ) {
            res.status(400).send({ error: error.message });
            return;
        }

        next(error);
    }
});

trackHistoryRouter.get('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const user = await getUserByToken(token);

        if (!user) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        const history = await TrackHistory.find({ user: user._id })
            .sort({ datetime: -1 })
            .populate('track', 'name')
            .populate('artist', 'name');

        res.send(history);
    } catch (error) {
        next(error);
    }
});

export default trackHistoryRouter;