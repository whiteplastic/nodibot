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

