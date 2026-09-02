import { Router } from 'express';
import { Artist } from '../models/Artist';
import { User } from '../models/User';
import { upload } from '../multer';
import { auth } from '../auth';
import { permit } from '../permit';

const artistsRouter = Router();

artistsRouter.get('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        let isAdmin = false;

        if (token) {
            const user = await User.findOne({ token });
            if (user && user.role === 'admin') {
                isAdmin = true;
            }
        }

        const filter = isAdmin ? {} : { isPublished: true };
        const artists = await Artist.find(filter);
        res.send(artists);
    } catch (error) {
        next(error);
    }
});

artistsRouter.get('/:id', async (req, res, next) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            res.status(404).send({ error: 'Artist not found' });
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

        if (!artist.isPublished && !isAdmin) {
            res.status(403).send({ error: 'Access denied' });
            return;
        }

        res.send(artist);
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid artist ID' });
            return;
        }
        next(error);
    }
});

artistsRouter.post('/', auth, upload.single('photo'), async (req, res, next) => {
    try {
        const artist = new Artist({
            name: req.body.name,
            information: req.body.information || null,
            photo: req.file ? `uploads/${req.file.filename}` : null,
            isPublished: false,
        });

        await artist.save();
        res.status(201).send(artist);
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).send({ error: error.message });
            return;
        }
        next(error);
    }
});

artistsRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            res.status(404).send({ error: 'Artist not found' });
            return;
        }

        artist.isPublished = !artist.isPublished;
        await artist.save();
        res.send(artist);
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid artist ID' });
            return;
        }
        next(error);
    }
});

artistsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) {
            res.status(404).send({ error: 'Artist not found' });
            return;
        }
        res.send({ message: 'Artist deleted successfully', id: req.params.id });
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            res.status(400).send({ error: 'Invalid artist ID' });
            return;
        }
        next(error);
    }
});

export default artistsRouter;