const homeUrl = window.location.href;
var currentSongId = -1;
var listSize = 0;

var playSong = function(id) {
    $.get(homeUrl + 'play/' + id, function(data, status) {
        if(status === 'success') {
            currentSongId = id;
        }
    });
};

var stopSong = function() {
    $.get(homeUrl + 'stop', function(data, status) {
    });
};

var pauseResume = function() {
    $.get(homeUrl + 'pause', function(data, status) {
    });
};

// get songs list
$.get(homeUrl + 'list', function(result){
    let jsonList = JSON.parse(result);
    listSize = jsonList.length;
    var list = $(".list-control");
    // populate songs list
    jsonList.forEach(function(element) {
        var song = $('<li id="' + element.id
            + '" class="list-song"><span class="mdl-chip mdl-chip--contact"><span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">'
            + '<i class="material-icons">audiotrack</i></span><span class="mdl-chip__text">'
            + element.name
            + '</span></span></li>'
        );
        list.append(song);
        song.click(function() {
            playSong(element.id);
        });
    });
}); 


$('#stopBtn').click(function() {
    stopSong();
});

$('#pauseResumeBtn').click(function() {
    pauseResume();
});

$('#prevBtn').click(function() {
    let id = currentSongId - 1;
    if(id >= 0 && id < listSize) {
        playSong(id);
    }
});

$('#nextBtn').click(function() {
    let id = currentSongId + 1;
    console.log(id);
    if(id >= 0 && id < listSize) {
        playSong(id);
    }
});

