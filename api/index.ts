import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import artistsRouter from './routes/artists';
import albumsRouter from './routes/albums';
import tracksRouter from './routes/tracks';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(config.publicPath));

app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);
app.use('/tracks', tracksRouter);

app.use((_req: Request, res: Response) => {
    res.status(404).send({ error: 'Not Found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ error: err.message || 'Internal Server Error' });
});

const run = async () => {
    await mongoose.connect(config.urlMongoose);
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
};

process.on('exit', async () => {
    await mongoose.disconnect();
});

run().catch((err) => console.error(err));