import { Router } from 'express';
import { Album } from '../models/Album';
import { User } from '../models/User';
import { upload } from '../multer';
import { auth } from '../auth';
import { permit } from '../permit';

const albumsRouter = Router();

albumsRouter.get('/', async (req, res, next) => {
    try {
        const artist = typeof req.query.artist === 'string' ? req.query.artist : undefined;
        const token = req.get('Authorization');
        let isAdmin = false;

        if (token) {
            const user = await User.findOne({ token });
            if (user && user.role === 'admin') {
                isAdmin = true;
            }
        }

        const filter: Record<string, any> = {};
        if (artist) filter.artist = artist;
        if (!isAdmin) filter.isPublished = true;

        const albums = await Album.find(filter).sort({ releaseYear: -1 });
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

        const token = req.get('Authorization');
        let isAdmin = false;

        if (token) {
            const user = await User.findOne({ token });
            if (user && user.role === 'admin') {
                isAdmin = true;
            }
        }

        if (!album.isPublished && !isAdmin) {
            res.status(403).send({ error: 'Access denied' });
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

albumsRouter.post('/', auth, upload.single('cover'), async (req, res, next) => {
    try {
        const album = new Album({
            name: req.body.name,
            artist: req.body.artist,
            releaseYear: req.body.releaseYear,
            cover: req.file ? `uploads/${req.file.filename}` : null,
            isPublished: false,
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

albumsRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id);
        if (!album) {
            res.status(404).send({ error: 'Album not found' });
            return;
        }

        album.isPublished = !album.isPublished;
        await album.save();
        res.send(album);
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid album ID' });
            return;
        }
        next(error);
    }
});

albumsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) {
            res.status(404).send({ error: 'Album not found' });
            return;
        }
        res.send({ message: 'Album deleted successfully', id: req.params.id });
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid album ID' });
            return;
        }
        next(error);
    }
});

export default albumsRouter;