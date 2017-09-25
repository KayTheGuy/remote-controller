const homeUrl = window.location.href;

var songPlay = function() {
    $.get(homeUrl + 'play', function(data, status) {
        console.log(status);
    });
};

// get songs list
$.get(homeUrl + 'list', function(result){
    let jsonList = JSON.parse(result);
    var list = $(".list-control");
    // populate songs list
    jsonList.forEach(function(element) {
        list.append(
            '<li id=' + element.id
            + 'class="list-song"><span class="mdl-chip mdl-chip--contact"><span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">'
            + '<i class="material-icons">audiotrack</i></span><span class="mdl-chip__text">'
            + element.name
            + '</span></span></li>'
        ).click(songPlay);
    });
}); 


$('#playBtn').click(songPlay);

