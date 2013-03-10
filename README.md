# tvrager
A Node.js client library for [TVRage](http://www.tvrage.com)'s API.


## Installation
    npm install tvrager


## Usage
Example of searching for episodes matching "Person of Interest".
    tvrager.find('Person of Interest', function(list) {
        console.log(list);
    });

Example of getting an episode list for "Person of Interest".
    tvrager.getEpisodeList('28376', function(list) {
        console.log(list);
    });

The two examples above use the default, cleaned, output format. All functions
can take an optional parameter (at the end) to specify the output format as
either 'xml' or 'xml2js'. 'xml' is simply what tvrage returns (an XML string),
while 'xml2js' is that XML made into an object using [xml2js][].

Example of getting show information, for "Person of Interest", in XML (string)
format.
    tvrager.getShowInfo('28376', function(list) {
        console.log(list);
    }, 'xml');

Example of getting a list, in 'xml2js' format, of all shows. 
    tvrager.getListShows(function(list) {
        console.log(list);
    }, 'xml2js');

__NOTE__: _The "cleaned" format might miss out on some information. However,
the functions mapping the data 'xml2js' to the cleaned format can easily be
modified._

See [test.js](test.js) for more examples.


## TODO
* Implement the cleaners for find, findFull, getEpisodeInfo, getFull,
  getShowInfo and listShows. At the moment, they're simply the same as
  the 'xml2js' format.
* Proper testing.


## Source
https://github.com/zarac/tvrager


## Author
Hannes Landstedt a.k.a. zarac


## License
NULL (No Unnecessary License - License)


## Extra Keywords
node module


[xml2js]: https://github.com/Leonidas-from-XIV/node-xml2js 
