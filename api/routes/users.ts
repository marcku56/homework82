import { Router } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { auth } from '../auth';
import { upload } from '../multer';
import { RequestWithUser } from '../types';

const usersRouter = Router();

usersRouter.post('/', upload.single('avatar'), async (req, res, next) => {
    try {
        const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
        const password = typeof req.body.password === 'string' ? req.body.password.trim() : '';
        const displayName = typeof req.body.displayName === 'string' ? req.body.displayName.trim() : '';

        if (!username || !password) {
            res.status(400).send({ error: 'Username and password cannot be empty' });
            return;
        }

        if (!displayName) {
            res.status(400).send({ error: 'Display Name is required' });
            return;
        }

        const user = new User({
            username,
            password,
            displayName,
            avatar: req.file ? `uploads/${req.file.filename}` : null,
            token: crypto.randomUUID(),
            role: 'user',
        });

        await user.save();
        res.status(201).send(user);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).send({ error: error.message });
            return;
        }

        if (error.code === 11000) {
            res.status(400).send({ error: 'Username already exists' });
            return;
        }

        next(error);
    }
});

usersRouter.post('/google', async (req, res, next) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            res.status(400).send({ error: 'Google credential is required' });
            return;
        }

        const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`);
        if (!response.ok) {
            res.status(400).send({ error: 'Google authentication failed' });
            return;
        }

        const payload: { sub: string; email: string; name: string; picture: string } = await response.json();

        let user = await User.findOne({ googleId: payload.sub });

        if (!user) {
            let username = payload.email || payload.sub;
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                username = `${username}_${crypto.randomUUID().slice(0, 4)}`;
            }

            user = new User({
                username,
                password: crypto.randomUUID(),
                googleId: payload.sub,
                displayName: payload.name || payload.email,
                avatar: payload.picture || null,
                token: crypto.randomUUID(),
                role: 'user',
            });
        } else {
            user.generateToken();
        }

        await user.save();
        res.send({ message: 'Logged in with Google successfully', user });
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
        const password = typeof req.body.password === 'string' ? req.body.password.trim() : '';

        if (!username || !password) {
            res.status(400).send({ error: 'Username and password are required' });
            return;
        }

        const user = await User.findOne({ username });

        if (!user || !(await user.checkPassword(password))) {
            res.status(400).send({ error: 'Username or password incorrect' });
            return;
        }

        user.generateToken();
        await user.save();

        res.send({ message: 'Username and password correct', user });
    } catch (error) {
        next(error);
    }
});

usersRouter.delete('/sessions', auth, async (req: RequestWithUser, res, next) => {
    try {
        if (!req.user) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        req.user.generateToken();
        await req.user.save();

        res.send({ message: 'Success logout' });
    } catch (error) {
        next(error);
    }
});

export default usersRouter;