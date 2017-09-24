const homeUrl = window.location.href;

$('#playBtn').click(function() {
    $.get(homeUrl + 'play', function(data, status) {
        console.log(status);
    });
});


// populate songs list