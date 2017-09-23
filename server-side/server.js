const tempList = {
    "songs": [
        {
            "name": "Gavinco The Bian",
            "artist": "Unknown",
            "album": "Unknown",
            "url": "./song/1.mp3"
        },
        {
            "name": "Blackout",
            "artist": "Maya Jane Coles",
            "album": "Unknown",
            "url": "./song/2.mp3"
        }
    ],
};

Amplitude.init(tempList);
Amplitude.bindNewElements();
var song1 = Amplitude.getSongByIndex(1);
Amplitude.playNow(song1);
