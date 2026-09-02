import { Request } from 'express';
import { IUser } from './models/User';
import {HydratedDocument} from "mongoose";

export interface RequestWithUser extends Request {
    user?: HydratedDocument<IUser>;
}