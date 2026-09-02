import { Router } from 'express';
import { Track } from '../models/Track';
import { User } from '../models/User';
import { auth } from '../auth';
import { permit } from '../permit';

const tracksRouter = Router();

tracksRouter.get('/', async (req, res, next) => {
    try {
        const album = typeof req.query.album === 'string' ? req.query.album : undefined;
        const token = req.get('Authorization');
        let isAdmin = false;

        if (token) {
            const user = await User.findOne({ token });
            if (user && user.role === 'admin') {
                isAdmin = true;
            }
        }

        const filter: Record<string, any> = {};
        if (album) filter.album = album;
        if (!isAdmin) filter.isPublished = true;

        const tracks = await Track.find(filter).sort({ trackNumber: 1 });
        res.send(tracks);
    } catch (error) {
        next(error);
    }
});

tracksRouter.post('/', auth, async (req, res, next) => {
    try {
        const track = new Track({
            name: req.body.name,
            album: req.body.album,
            duration: req.body.duration,
            trackNumber: req.body.trackNumber,
            isPublished: false,
        });

        await track.save();
        res.status(201).send(track);
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).send({ error: error.message });
            return;
        }
        next(error);
    }
});

tracksRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
    try {
        const track = await Track.findById(req.params.id);
        if (!track) {
            res.status(404).send({ error: 'Track not found' });
            return;
        }

        track.isPublished = !track.isPublished;
        await track.save();
        res.send(track);
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid track ID' });
            return;
        }
        next(error);
    }
});

tracksRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
    try {
        const track = await Track.findByIdAndDelete(req.params.id);
        if (!track) {
            res.status(404).send({ error: 'Track not found' });
            return;
        }
        res.send({ message: 'Track deleted successfully', id: req.params.id });
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid track ID' });
            return;
        }
        next(error);
    }
});

export default tracksRouter;