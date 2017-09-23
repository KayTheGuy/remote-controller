const tempList = {
    "songs": [
        {
            "name": "Gavinco The Bian",
            "artist": "Unknown",
            "album": "Unknown",
            "url": "./song/GavincoTheBian.mp3"
        },
        {
            "name": "Blackout",
            "artist": "Maya Jane Coles",
            "album": "Unknown",
            "url": "./song/GavincoTheBian.mp3"
        },
        {
            "name": "Something More",
            "artist": "Crazy P",
            "album": "Unknown",
			"url": "./song/CrazyPSomethingMore.mp3",
			"made_up_key": "I'm made up completely"
        }
    ],
};

// var togglePlayPause = function() {
//     let globalPlayBtnIcn = document.getElementById("global-play-icon");
//     globalPlayBtnIcn.textContent = 'play';
// 	console.log(globalPlayBtnIcn.textContent);
// };
// togglePlayPause();


Amplitude.init(tempList);
Amplitude.bindNewElements();
var song1 = Amplitude.getSongByIndex(2);
Amplitude.playNow(song1);
