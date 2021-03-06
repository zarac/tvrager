/**
 * Check out https://github.com/zarac/tvrager for information.
 *
 *
 * Uses RSS feeds from tvrage
 *  http://services.tvrage.com/info.php?page=main
 *
 * Search   • http://services.tvrage.com/feeds/search.php?show=SHOWNAME
 *  Detailed Search  • http://services.tvrage.com/feeds/full_search.php?show=SHOWNAME
 *  Show Info    • http://services.tvrage.com/feeds/showinfo.php?sid=SHOWID
 *  Episode List • http://services.tvrage.com/feeds/episode_list.php?sid=SHOWID
 *  Episode Info • http://services.tvrage.com/feeds/episodeinfo.php?show=Show Name&exact=1&ep=SEASONxEPISODE
 *  Show Info + Episode List • http://services.tvrage.com/feeds/full_show_info.php?sid=SHOWID
 *  Full Show List   • http://services.tvrage.com/feeds/show_list.php
 *
 * XML Example For Buffy The Vampire Slayer
 *  Search   http://services.tvrage.com/feeds/search.php?show=buffy
 *  Detailed Search  http://services.tvrage.com/feeds/full_search.php?show=buffy
 *  Show Info    http://services.tvrage.com/feeds/showinfo.php?sid=2930
 *  Episode List http://services.tvrage.com/feeds/episode_list.php?sid=2930
 *  Show Info + Episode List http://services.tvrage.com/feeds/full_show_info.php?sid=2930
 *  Episode Info http://services.tvrage.com/feeds/episodeinfo.php?sid=2930&ep=2x04
 */

var http = require('http'),
    xml2js = require('xml2js');

var baseUrl = 'http://services.tvrage.com/feeds/';

var ragify = function(url, callback, format, cleaner) {
    console.log('ragify(%s, ..)', url);
    http.get(url, function(respons) {
        var xml = '';
        respons.on('data', function(chunk) {
            xml = xml + chunk;
        });
        respons.on('end', function() {
            if (format === 'xml') callback( { xml: xml });
            else if (format === 'xml2js') jsonify(xml, callback);
            else {
                jsonify(xml, function(result) {
                    if (result.error) callback(result);
                    else callback(cleaner(result));
                });
            }
        });
    }).on('error', function(e) {
        console.log('HTTP error (' + e.message + ').');
        callback({ error: 'HTTP error (' + e.message + ').' });
    });
};

var jsonify = function(xml, callback) {
    xml2js.parseString(xml, function(err, result) {
        if (err) callback({ error: 'Parsing XML failed. (' + err.message + ').'
        });
        else callback(result);
    });
};


//* Cleaners
var clean_find = function(xml2js) {
    if (xml2js.Results == 0) return { result: { shows: [] }};
    var cleaned = {
        result: {
            shows: xml2js.Results.show.map(function(e) {
                return {
                    classification: e.classification[0],
                    country: e.country[0],
                    ended: (typeof e.ended[0] === 'object' || e.ended[0] ===
                        '0' ? 'ongoing' : e.ended[0]),
                    genres: e.genres[0].genre,
                    id: e.showid[0],
                    url: e.link[0],
                    name: e.name[0],
                    seasoncount: e.seasons[0],
                    started: e.started[0],
                    status: e.status[0]
                };
            })
        }
    };
    return cleaned;
};

var clean_find_full = function(xml2js) {
    /// TODO
    return xml2js;
};

var clean_episode_info = function(xml2js) {
    /// TODO
    return xml2js;
};

var clean_episode_list = function(xml2js) {
    var cleaned = {
        name: xml2js.Show.name[0],
        seasons: []
    };
    if (xml2js.Show && xml2js.Show.Episodelist) {
      for (var i = 0; i < xml2js.Show.Episodelist[0].Season.length; i++) {
          var s = xml2js.Show.Episodelist[0].Season[i];
          var season = {
              number: (s.$.no.length == 1 ? '0' + s.$.no : s.$.no),
              episodes: []
          };
          for (var j = 0; j < s.episode.length; j++) {
              var e = s.episode[j];
              var episode = {
                  airdate: e.airdate[0],
                  eid: 'S' + season.number + 'E' + e.seasonnum[0],
                  epnum: e.epnum[0],
                  prodnum: e.prodnum[0],
                  number: e.seasonnum[0],
                  title: e.title[0],
                  url: e.link[0]
              };
              season.episodes.push(episode);
          };
          cleaned.seasons.push(season);
      };
    };
    return cleaned;
};

var clean_full = function(xml2js) {
    /// TODO
    return xml2js;
};

var clean_show_info = function(xml2js) {
    if (!xml2js.Showinfo.showid) return { error: 'No such show.' };
    var show = xml2js.Showinfo;
    var cleaned = {
        classification: show.classification[0],
        ended: (typeof show.ended[0] === 'object' || show.ended[0] === '0' ?
                'ongoing' : show.ended[0]),
        id: show.showid[0],
        name: show.showname[0],
        network: {
            country: show.network[0].$.country,
            name: show.network[0]._ },
        origin_country: show.origin_country[0],
        runtime: show.runtime[0],
        seasoncount: show.seasons[0],
        url: show.showlink[0],
        startdate: show.startdate[0],
        started: show.started[0],
        status: show.status[0],
        timezone: show.timezone[0]
    };
    if (show.airday) cleaned.airday = show.airday[0];
    if (show.airtime) cleaned.airtime = show.airtime[0];
    if (show.genres) cleaned.genres = show.genres[0].genre;
    return cleaned;
};

var clean_list_shows = function(xml2js) {
    /// TODO
    return xml2js;
};


//* Exports
module.exports = {
    find : function(name, callback, format) {
        ragify(baseUrl + 'search.php?show=' + name, callback, format,
                clean_find);
    },

    findFull : function(name, callback, format) {
        ragify(baseUrl + 'full_search.php?show=' + name, callback, format,
                clean_find_full);
    },

    getEpisodeInfo : function(sid, ep, callback, format) {
        ragify(baseUrl + 'episodeinfo.php?sid=' + sid + '&ep=' + ep, callback,
                format, clean_episode_info);
    },

    getEpisodeList : function(id, callback, format) {
        ragify(baseUrl + 'episode_list.php?sid=' + id, callback, format,
                clean_episode_list);
    },

    getFull : function(id, callback, format) {
        ragify(baseUrl + 'full_show_info.php?sid=' + id, callback, format,
                clean_full);
    },

    getShowInfo : function(id, callback, format) {
        ragify(baseUrl + 'showinfo.php?sid=' + id, callback, format,
                clean_show_info);
    },

    listShows : function(callback, format) {
        ragify(baseUrl + 'show_list.php', callback, format, clean_list_shows);
    }
}
