import { Router } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';

const usersRouter = Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
        const password = typeof req.body.password === 'string' ? req.body.password.trim() : '';

        if (!username || !password) {
            res.status(400).send({ error: 'Username and password cannot be empty or contain only spaces' });
            return;
        }

        const user = new User({
            username,
            password,
            token: crypto.randomUUID(),
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

export default usersRouter;