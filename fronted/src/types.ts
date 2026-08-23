export interface Artist {
    _id: string;
    name: string;
    photo: string | null;
    information: string | null;
}

export interface Album {
    _id: string;
    name: string;
    artist: Artist | string;
    releaseYear: number;
    cover: string | null;
}

export interface Track {
    _id: string;
    name: string;
    album: Album | string;
    duration: string;
    trackNumber: number;
}

export interface User {
    _id: string;
    username: string;
    token: string;
}

export interface TrackHistoryItem {
    _id: string;
    user: string;
    track: {
        _id: string;
        name: string;
    };
    artist: {
        _id: string;
        name: string;
    };
    datetime: string;
}