import { Schema, model } from 'mongoose';

const TrackSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album',
        required: true,
    },
    duration: {
        type: String,
        required: true,
        trim: true,
    },
    trackNumber: {
        type: Number,
        required: true,
    },
});

export const Track = model('Track', TrackSchema);