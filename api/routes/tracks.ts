import { Router } from 'express';
import { Track } from '../models/Track';

const tracksRouter = Router();

tracksRouter.get('/', async (req, res, next) => {
    try {
        const album = typeof req.query.album === 'string'
            ? req.query.album
            : undefined;

        const filter = album ? { album } : {};

        const tracks = await Track.find(filter).sort({ trackNumber: 1 });
        res.send(tracks);
    } catch (error) {
        next(error);
    }
});

tracksRouter.post('/', async (req, res, next) => {
    try {
        const track = new Track({
            name: req.body.name,
            album: req.body.album,
            duration: req.body.duration,
            trackNumber: req.body.trackNumber,
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

export default tracksRouter;