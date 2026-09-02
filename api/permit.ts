import { Response, NextFunction } from 'express';
import { RequestWithUser } from './types';

export const permit = (...roles: string[]) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).send({ error: 'Unauthenticated' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).send({ error: 'Forbidden Insufficient privileges' });
            return;
        }

        next();
    };
};