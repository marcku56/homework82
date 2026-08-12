import { Router } from 'express';
import { TrackHistory } from '../models/TrackHistory';
import { User } from '../models/User';
import { Track } from '../models/Track';

const trackHistoryRouter = Router();

trackHistoryRouter.post('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        const user = await User.findOne({ token });

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

        const trackHistory = new TrackHistory({
            user: user._id,
            track: req.body.track,
            datetime: new Date(),
        });

        await trackHistory.save();
        res.status(201).send(trackHistory);
    } catch (error) {
        if (error instanceof Error && (error.name === 'ValidationError' || error.name === 'CastError')) {
            res.status(400).send({ error: error.message });
            return;
        }
        next(error);
    }
});

export default trackHistoryRouter;