$(function() {
    var places = new simplegeo.PlacesClient('rvxWJ9z5M2LxrgCpe7AzKf9yjGMQgVFw');
    var client = new simplegeo.Client('rvxWJ9z5M2LxrgCpe7AzKf9yjGMQgVFw');

    var populatePlaces = function(err, places) {
        if (err) {
            $('#status').show().html("☹ " + err);
            console.log(err);
            return;
        }
        $('#status').hide();
        $('li.place').remove();
        for (var i in places['features']) {
            if (!places['features'][i].properties['website']) {
                continue;
            }
            $('#nearby').append(
                "<li class=\"place\"><a href=\"http://" +
                    places['features'][i].properties['website'] + "\">" +
                    places['features'][i].properties['name'] + "</a></li>");
        };
        $('#refresh').removeClass('disabled').show();
    };

    var tries = 0;

    var updateLocation = function(lat, lon) {
        window.title = "Nearweb: Places near " + lat + "," + lon;
        window.history.pushState(undefined, window.title,
                                 window.location.pathname + '#' + lat +
                                 ',' + lon);
    };

    var placesSearch = function(lat, lon) {
        updateLocation(lat, lon);
        places.search(lat, lon, {}, populatePlaces);
    };


    var placesSearchThunk = function(err, position) {
        if (err) {
            $('#status').show()
                .html("☹ Sorry, I couldn't determine your location.");
            console.log(err);
            return;
        }

        if (position.coords.accuracy >= 150 && tries <= 3) {
            tries += 1;
            $('#status').show().html("Stop moving!");
            load();
        }
        placesSearch(position.coords.latitude, position.coords.longitude);
    };

    var load = function() {
        client.getLocationFromBrowser({enableHighAccuracy: true,
                                       maximumAge: 0},
                                      placesSearchThunk);
    };

    $('#refresh').click(function(event) {
        if ($(this).is('.disabled')) {
            return;
        }
        $(this).addClass('disabled').hide();
        $('#status').html("Loading…").show();
        load();
    });

    if (window.location.hash != "") {
        var coords = window.location.hash.substring(1).split(",");
        placesSearch(coords[0], coords[1]);
    } else {
        load();
    }
});
