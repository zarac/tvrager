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

var ragify = function(url, callback) {
    http.get(url, function(respons) {
        var html = '';
        respons.on('data', function(chunk) {
            html = html + chunk;
        });
        respons.on('end', function() {
            xml2js.parseString(html, function(err, result) {
                if (err) callback({ error: err });
                else callback(result);
            });
        });
    }).on('error', function(e) {
        callback({ error: e.message });
    });
};

module.exports = {
    find : function(name, callback) {
        ragify(baseUrl + 'search.php?show=' + name, callback);
    },

    findFull : function(name, callback) {
        ragify(baseUrl + 'full_search.php?show=' + name, callback);
    },

    getEpisodeInfo : function(sid, ep, callback) {
        ragify(baseUrl + 'episodeinfo.php?sid=' + sid + '&ep=' + ep, callback);
    },

    getEpisodeList : function(id, callback) {
        ragify(baseUrl + 'episode_list.php?sid=' + id, callback);
    },

    getFull : function(id, callback) {
        ragify(baseUrl + 'full_show_info.php?sid=' + id, callback);
    },

    getShowInfo : function(id, callback) {
        ragify(baseUrl + 'showinfo.php?sid=' + id, callback);
    },

    listShows : function(callback) {
        ragify(baseUrl + 'show_list.php', callback);
    }

}
