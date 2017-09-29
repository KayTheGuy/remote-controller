// global variables
const homeUrl = window.location.href;
var currentSongId = -1;
var listSize = 0;
var jsonList = [];
var isPlaying = false;
var isPuased = false;

// declare music player listeners
var playSong = function(id) {
    $.get(homeUrl + 'play/' + id, function(data, status) {
        if(status === 'success') {
            currentSongId = id;
            $('.mdl-card__supporting-text').text(jsonList[id].name);
            isPlaying = true;
        }
    });
};

var stopSong = function() {
    $.get(homeUrl + 'stop', function(data, status) {
        if(status === 'success') {
            isPlaying = false;
        }
    });
};

var pauseResume = function() {
    $.get(homeUrl + 'pause', function(data, status) {
    });
};

var selectSong = function(id) {
    let lisItem = $('li[rel=' + id + ']').find('.mdl-chip__text');
    lisItem.addClass('li-highlight');

    $(".list-control").animate({
        scrollTop: (id * 36) // 36 is heigh of chips with including the margins
    }, 350);

    window.setTimeout(function(){
        lisItem.removeClass('li-highlight');
    }, 800);
    playSong(id);
};

var togglePauseResume = function(button) {
    if(button === 'stopBtn') {
        $('#pauseResumeBtn').find('.material-icons').text('play_arrow');  
        isPuased = false;
    } else if(button === 'nextBtn') {
        $('#pauseResumeBtn').find('.material-icons').text('pause');  
    } else if(button === 'pauseResumeBtn') {
        if(isPuased) {
            $('#pauseResumeBtn').find('.material-icons').text('play_arrow');  
        } else {
            $('#pauseResumeBtn').find('.material-icons').text('pause');        
        }
        isPuased = !isPuased; 
    }
};

// get songs list
$.get(homeUrl + 'list', function(result){
    jsonList = JSON.parse(result);
    listSize = jsonList.length;
    var list = $(".list-control");
    // populate songs list
    jsonList.forEach(function(element) {
        var song = $('<li rel="' + element.id
            + '" class="list-song"><span class="mdl-chip mdl-chip--contact"><span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">'
            + '<i class="material-icons">audiotrack</i></span><span class="mdl-chip__text">'
            + element.name
            + '</span></span></li>'
        );
        list.append(song);
        song.click(function() {
            selectSong(element.id);
        });
    });
}); 

$('#stopBtn').click(function() {
    stopSong();
    togglePauseResume('stopBtn');
    $('.mdl-card__supporting-text').text('');
});

$('#pauseResumeBtn').click(function() {
    if(isPlaying) {
        pauseResume();
    } else if(currentSongId >=0 && currentSongId < listSize) {
        selectSong(currentSongId);
    } else {
        selectSong(0);
    }    
    togglePauseResume('pauseResumeBtn');
});

$('#prevBtn').click(function() {
    let id = currentSongId - 1;
    if(id >= 0 && id < listSize) {
        selectSong(id);
        togglePauseResume('nextBtn');
    }
});

$('#nextBtn').click(function() {
    let id = currentSongId + 1;
    if(id >= 0 && id < listSize) {
        selectSong(id);
        togglePauseResume('nextBtn');
    }
});
