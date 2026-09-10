import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_WORK_FACTOR = 10;

export interface IUser {
    _id: string;
    username: string;
    password?: string;
    token: string;
    role: 'user' | 'admin';
    googleId?: string | null;
    displayName: string;
    avatar?: string | null;
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: function (this: IUser) {
            return !this.googleId;
        },
    },
    token: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
    googleId: {
        type: String,
        default: null,
    },
    displayName: {
        type: String,
        required: true,
        default: function (this: IUser) {
            return this.username;
        },
    },
    avatar: {
        type: String,
        default: null,
    },
});

userSchema.pre('save', async function () {
    if (this.isModified('password') && this.password) {
        this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    }
});

userSchema.set('toJSON', {
    transform: (_doc, obj) => {
        const { password, ...user } = obj;
        return user;
    },
});

userSchema.methods.checkPassword = function (password: string) {
    if (!this.password) return Promise.resolve(false);
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    this.token = crypto.randomUUID();
};

export const User = model<IUser>('User', userSchema);