import { Schema, model } from 'mongoose';

const AlbumSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    cover: {
        type: String,
        default: null,
    },
});

export const Album = model('Album', AlbumSchema);