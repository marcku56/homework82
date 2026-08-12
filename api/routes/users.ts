import { Router } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';

const usersRouter = Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            token: crypto.randomUUID(),
        });

        await user.save();

        res.status(201).send(user);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: error.message });
        }

        if (error.code === 11000) {
            return res.status(400).send({ error: 'Username already exists' });
        }

        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user || !(await user.checkPassword(req.body.password))) {
            return res
                .status(400)
                .send({ error: 'Username or password incorrect' });
        }

        user.generateToken();
        await user.save();

        res.send({ message: 'Username and password correct', user });
    } catch (error) {
        next(error);
    }
});

export default usersRouter;