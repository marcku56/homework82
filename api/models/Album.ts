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
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export const Album = model('Album', AlbumSchema);