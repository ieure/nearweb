$(function() {
    var places = new simplegeo.PlacesClient('rvxWJ9z5M2LxrgCpe7AzKf9yjGMQgVFw');
    var client = new simplegeo.Client('rvxWJ9z5M2LxrgCpe7AzKf9yjGMQgVFw');

    var populatePlaces = function(err, places) {
        if (err) {
            $('#status').show().html("☹ " + err);
            return;
        }
        $('#status').hide();
        for (var i in places['features']) {
            if (!places['features'][i].properties['website']) {
                continue;
            }
            $('#nearby').append(
                "<li class=\"place\"><a href=\"http://" +
                    places['features'][i].properties['website'] + "\">" +
                    places['features'][i].properties['name'] + "</a></li>");
        };
    };

    var placesSearchThunk = function(err, position) {
        if (err) {
            $('#status').show()
                .html("☹ Sorry, I couldn't determine your location.");
            return;
        }
        console.log(position);
        places.search(position.coords.latitude, position.coords.longitude, {},
                      populatePlaces);
    };

    client.getLocationFromBrowser({}, placesSearchThunk);
});
