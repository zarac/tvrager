var tvrager = require('tvrager'),
    eyes = require('eyes').inspector();


tvrager.find('Person', function(result) {
    console.log('"Testing" find(..):');
    eyes(result);
});

tvrager.findFull('Person', function(result) {
    console.log('"Testing" findFull(..):');
    eyes(result);
});

tvrager.getEpisodeInfo('28376', '1x01', function(result) {
    console.log('"Testing" getEpisodeInfo(..):');
    eyes(result);
});

tvrager.getEpisodeList('28376', function(result) {
    console.log('"Testing" getEpisodeList(..):');
    eyes(result);
});

tvrager.getFull('28376', function(result) {
    console.log('"Testing" getFull(..):');
    eyes(result);
});

tvrager.getShowInfo('28376', function(result) {
    console.log('"Testing" getShowInfo(..):');
    eyes(result);
});

tvrager.listShows(function(result) {
    console.log('"Testing" listShows(..):');
    eyes(result);
});
