import mongoose from 'mongoose';
import { config } from './config';
import { Artist } from './models/Artist';
import { Album } from './models/Album';
import { Track } from './models/Track';

const run = async () => {
    await mongoose.connect(config.urlMongoose);
    const collections = await mongoose.connection.db?.collections();

    if (collections) {
        for (const collection of collections) {
            await collection.drop();
        }
    }

    const [artist1, artist2] = await Artist.create(
        {
            name: 'Linkin Park',
            photo: 'fixtures/LinkinPark.png',
            information: 'American rock band from Agoura Hills, California.',
        },
        {
            name: 'Daft Punk',
            photo: 'fixtures/DaftPunk.png',
            information: 'French electronic music duo formed in 1993.',
        }
    );

    const [album1, album2, album3, album4] = await Album.create(
        {
            name: 'Hybrid Theory',
            artist: artist1._id,
            releaseYear: 2000,
            cover: 'fixtures/Linkin_Park_Hybrid_Theory_Album_Cover.jpg',
        },
        {
            name: 'Meteora',
            artist: artist1._id,
            releaseYear: 2003,
            cover: 'fixtures/Linkin_Park_Meteora_20.jpg',
        },
        {
            name: 'Discovery',
            artist: artist2._id,
            releaseYear: 2001,
            cover: 'fixtures/Daft_Punk_Discovery.png',
        },
        {
            name: 'Random Access Memories',
            artist: artist2._id,
            releaseYear: 2013,
            cover: 'fixtures/Random_Acess_Memories_Daft_Punk.jpe',
        }
    );

    await Track.create(
        {
            name: 'Papercut',
            album: album1._id,
            duration: '3:04',
            trackNumber: 1
        },
        {
            name: 'One Step Closer',
            album: album1._id,
            duration: '2:35',
            trackNumber: 2
        },
        {
            name: 'With You',
            album: album1._id,
            duration: '3:23',
            trackNumber: 3
        },
        {
            name: 'Points of Authority',
            album: album1._id,
            duration: '3:20',
            trackNumber: 4
        },
        {
            name: 'Crawling',
            album: album1._id,
            duration: '3:29',
            trackNumber: 5
        },
        {
            name: 'Foreword',
            album: album2._id,
            duration: '0:13',
            trackNumber: 1
        },
        {
            name: 'Don\'t Stay',
            album: album2._id,
            duration: '3:07',
            trackNumber: 2
        },
        {
            name: 'Somewhere I Belong',
            album: album2._id,
            duration: '3:33',
            trackNumber: 3
        },
        {
            name: 'Lying from You',
            album: album2._id,
            duration: '2:55',
            trackNumber: 4
        },
        {
            name: 'Faint',
            album: album2._id,
            duration: '2:42',
            trackNumber: 5
        },
        {
            name: 'One More Time',
            album: album3._id,
            duration: '5:20',
            trackNumber: 1
        },
        {
            name: 'Aerodynamic',
            album: album3._id,
            duration: '3:27',
            trackNumber: 2
        },
        {
            name: 'Digital Love',
            album: album3._id,
            duration: '4:58',
            trackNumber: 3
        },
        {
            name: 'Harder, Better, Faster, Stronger',
            album: album3._id,
            duration: '3:44',
            trackNumber: 4
        },
        {
            name: 'Crescendolls',
            album: album3._id,
            duration: '3:31',
            trackNumber: 5
        },

        {
            name: 'Give Life Back to Music',
            album: album4._id,
            duration: '4:35',
            trackNumber: 1
        },
        {
            name: 'The Game of Love',
            album: album4._id,
            duration: '5:22',
            trackNumber: 2
        },
        {
            name: 'Giorgio by Moroder',
            album: album4._id,
            duration: '9:04',
            trackNumber: 3
        },
        {
            name: 'Within',
            album: album4._id,
            duration: '3:48',
            trackNumber: 4
        },
        {
            name: 'Instant Crush',
            album: album4._id,
            duration: '5:37',
            trackNumber: 5
        }
    );

    await mongoose.disconnect();
};

run().catch(console.error);