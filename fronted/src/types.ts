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