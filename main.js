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
    console.log('regify(%s, ..)', url);
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
        callback({ error: 'HTTP error (' + e.message + ').' });
    });
};

var jsonify = function(xml, callback) {
    xml2js.parseString(xml, function(err, result) {
        if (err) callback({ error: 'Parsing XML failed. (' + err.message + ').' });
        else callback(result);
    });
};


//* Cleaners
var clean_find = function(xml2js) {
    /// TODO
    return xml2js;
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
    for (var i = 0; i < xml2js.Show.Episodelist[0].Season.length; i++) {
        var s = xml2js.Show.Episodelist[0].Season[i];
        var season = {
            number: s.$.no,
            episodes: []
        };
        for (var j = 0; j < s.episode.length; j++) {
            var e = s.episode[j];
            var episode = {
                title: e.title[0],
                airdate: e.airdate[0],
                epnum: e.epnum[0],
                seasonnum: e.seasonnum[0],
                prodnum: e.prodnum[0],
                url: e.link[0]
            };
            season.episodes.push(episode);
        };
        cleaned.seasons.push(season);
    }
    return cleaned;
};

var clean_full = function(xml2js) {
    /// TODO
    return xml2js;
};

var clean_show_info = function(xml2js) {
    /// TODO
    return xml2js;
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
