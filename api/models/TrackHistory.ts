import { Schema, model } from 'mongoose';

const TrackHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
        required: true
    },
    datetime: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const TrackHistory = model('TrackHistory', TrackHistorySchema);