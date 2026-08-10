import { Router } from 'express';
import { Album } from '../models/Album';
import { upload } from '../multer';

const albumsRouter = Router();

albumsRouter.get('/', async (req, res, next) => {
    try {
        const artist = typeof req.query.artist === 'string'
            ? req.query.artist
            : undefined;

        const filter = artist ? { artist } : {};

        const albums = await Album.find(filter);
        res.send(albums);
    } catch (error) {
        next(error);
    }
});

albumsRouter.get('/:id', async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id).populate('artist');
        if (!album) {
            res.status(404).send({ error: 'Album not found' });
            return;
        }
        res.send(album);
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid album ID' });
            return;
        }
        next(error);
    }
});

albumsRouter.post('/', upload.single('cover'), async (req, res, next) => {
    try {
        const album = new Album({
            name: req.body.name,
            artist: req.body.artist,
            releaseYear: req.body.releaseYear,
            cover: req.file ? `uploads/${req.file.filename}` : null,
        });

        await album.save();
        res.status(201).send(album);
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).send({ error: error.message });
            return;
        }
        next(error);
    }
});

export default albumsRouter;