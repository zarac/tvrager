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

var ragify = function(url, callback, format) {
    http.get(url, function(respons) {
        var xml = '';
        respons.on('data', function(chunk) {
            xml = xml + chunk;
        });
        respons.on('end', function() {
            if (format === 'xml') callback( { xml: xml });
            else jsonify(xml, callback);
        });
    }).on('error', function(e) {
        callback({ error: e.message });
    });
};

var jsonify = function(xml, callback) {
    xml2js.parseString(xml, function(err, result) {
        if (err) callback({ error: err });
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

var clean_episode_list = function(list) {
    /// TODO
    var out = {
        name: list.Show.name[0],
        seasons: []
    };
    for (var i = 0; i < list.Show.Episodelist[0].Season.length; i++) {
        var s = list.Show.Episodelist[0].Season[i];
        var season = {
            number: s.$.no,
            episodes: s.episode
        }
        out.seasons.push(season);
    }
    return out;
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
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_find(result));
            }
        }
        ragify(baseUrl + 'search.php?show=' + name, callback, format);
    },

    findFull : function(name, callback, format) {
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_find_full(result));
            }
        }
        ragify(baseUrl + 'full_search.php?show=' + name, callback, format);
    },

    getEpisodeInfo : function(sid, ep, callback, format) {
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_episode_info(result));
            }
        }
        ragify(baseUrl + 'episodeinfo.php?sid=' + sid + '&ep=' + ep, callback,
                format);
    },

    getEpisodeList : function(id, callback, format) {
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_episode_list(result));
            }
        }
        ragify(baseUrl + 'episode_list.php?sid=' + id, callback, format);
    },

    getFull : function(id, callback, format) {
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_full(result));
            }
        }
        ragify(baseUrl + 'full_show_info.php?sid=' + id, callback, format);
    },

    getShowInfo : function(id, callback, format) {
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_show_info(result));
            }
        }
        ragify(baseUrl + 'showinfo.php?sid=' + id, callback, format);
    },

    listShows : function(callback, format) {
        if (!format || !(format == 'xml' || format == 'xml2js')) {
            var realcallback = callback;
            callback = function(result) {
                realcallback(clean_list_shows(result));
            }
        }
        ragify(baseUrl + 'show_list.php', callback, format);
    }
}
