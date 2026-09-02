import { Response, NextFunction } from 'express';
import { User } from './models/User';
import { RequestWithUser } from './types';

export const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.get('Authorization');

        if (!token) {
            res.status(401).send({ error: 'No token provided' });
            return;
        }

        const user = await User.findOne({ token });

        if (!user) {
            res.status(401).send({ error: 'Unauthorized: Invalid token' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};