export interface User {
    _id: string;
    username: string;
    token: string;
    role: 'user' | 'admin';
    googleId?: string | null;
    displayName: string;
    avatar?: string | null;
}

export interface RegisterMutation {
    username: string;
    password: string;
    displayName: string;
    avatar: File | null;
}

export interface Artist {
    _id: string;
    name: string;
    photo: string | null;
    information: string | null;
    isPublished: boolean;
}

export interface Album {
    _id: string;
    name: string;
    artist: Artist | string;
    releaseYear: number;
    cover: string | null;
    isPublished: boolean;
}

export interface Track {
    _id: string;
    name: string;
    album: Album | string;
    duration: string;
    trackNumber: number;
    isPublished: boolean;
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

export interface ArtistMutation {
    name: string;
    information: string;
    photo: File | null;
}

export interface AlbumMutation {
    name: string;
    artist: string;
    releaseYear: string;
    cover: File | null;
}

export interface TrackMutation {
    name: string;
    album: string;
    duration: string;
    trackNumber: string;
}