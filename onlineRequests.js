var request = require('request');

exports.getRandomWikiTitle = function(prefix, callback) {
  request('http://de.wikipedia.org/wiki/Spezial:Zuf%C3%A4llige_Seite', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var regex = '.*<title>(.*) – Wikipedia</title>.*'
      var result = body.match(regex);
      var statusNumber = result[1];
      return callback(prefix, statusNumber);
    }
    return '';
  });
}

exports.getPhrase = function(callback) {
  request('http://sprichwortrekombinator.de/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var regex = '.*<div class="spwort">(.*)</div>.*'
      var result = body.match(regex);
      var phrase = result[1];
      return callback(phrase);
    }
    return '';
  });
}

var umlauts = {"&auml;": "ä", "&uuml;":"ü", "&ouml;":"ö", "&Auml;": "Ä", "&Uuml;":"Ü", "&Ouml;":"Ö", "&szlig": "ß" }

function conv(str) {
  var reg = /&auml;|&uuml;|&ouml;|&Auml;|&Uuml;|&Ouml;|"&szlig"/g;
  return str.replace(reg, function(matched){
    return umlauts[matched];
  });
}

exports.getOnAir = function(callback) {
  request('http://soundportal.at/service/now-on-air/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var regex = '.*<td class="titel">(.*)</td>.*'
      var regex2 = '.*<td class="interpret">(.*)</td>.*'
      var regex3 = '.*<div id="header_nowonair_moderator"><img src="/fileadmin/tx_sendungen/(.*).png" alt="Moderator" width="115" height="121"></div>.*'
      var result = body.match(regex);
      var result2 = body.match(regex2);
      var result3 = body.match(regex3);
      var onAir = result3[1];
      var map = {
        "wb" : "Dr. Nachtstrom",
        "af" : "Antonia Fabian",
        "am" : "Andreas Meinhart",
        "bj" : "Bettina Jannach",
        "pm" : "Patrick Möstl",
        "cs" : "Christoph Scheibelhofer",
        "mm" : "Magdalena Mayer",
        "sm" : "Susanne Müller",
        "aw" : "Anna Wagner",
        "bjcsc" : "Bettina Jannach & Clemens Scarpatetti",
        "csc" : "Clemens Scarpatetti",
        "hst" : "Heysze Sommerspuren",
        "kf" : "Kathi Ferstl",
        "mf" : "Michael Fabian"
      };

      if (map[onAir]) {
        onAir = map[onAir];
      } else if ("nightguider" === onAir) {
        onAir = "Niemand, Sie armselige Schabe! Es läuft der Nightguider.";
      } else {
        onAir = "KENN ICH NICHT, SIE HUPE! (" + onAir + ")";
      }
      var track = conv(result[1]);
      var artist = conv(result2[1]);
      var phrase = track + " von " + artist + " [im Studio: " + onAir +"]";
      return callback(phrase);
    }
    return '';
  });
}

