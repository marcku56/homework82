import { Schema, model } from 'mongoose';

const ArtistSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    photo: {
        type: String,
        default: null,
    },
    information: {
        type: String,
        default: null,
    },
});

export const Artist = model('Artist', ArtistSchema);