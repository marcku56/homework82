import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_WORK_FACTOR = 10;

export interface IUser {
    _id: string;
    username: string;
    password: string;
    token: string;
    role: 'user' | 'admin';
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
        required: true,
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
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
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
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    this.token = crypto.randomUUID();
};

export const User = model<IUser>('User', userSchema);