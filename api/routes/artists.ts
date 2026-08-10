import { Router } from 'express';
import { Artist } from '../models/Artist';
import { upload } from '../multer';

const artistsRouter = Router();

artistsRouter.get('/', async (_req, res, next) => {
    try {
        const artists = await Artist.find();
        res.send(artists);
    } catch (error) {
        next(error);
    }
});

artistsRouter.post('/', upload.single('photo'), async (req, res, next) => {
    try {
        const artist = new Artist({
            name: req.body.name,
            information: req.body.information || null,
            photo: req.file ? `uploads/${req.file.filename}` : null,
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

export default artistsRouter;