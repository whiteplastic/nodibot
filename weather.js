var weather = require('openweathermap');

exports.getWeather = function (requestor, title, message, say) {
  /*var index = Math.floor((Math.random() * (boa.list.length)));  
  var title = boa.list[index].toUpperCase();*/
  var check = message.split(' ');
  var abfrage = message.substring(message.indexOf(' ')+1).replace(/[\s]+/g, "_");
  console.log(abfrage);
  if(check.length == 1) {
    say(requestor +', verarschen koennen Sie sich selbst, SIE ' + title + '!');
    return;
  }
  var cfg = {units: 'metric', lang: 'de', mode: 'json', APPID : 'a83e93e4c9dba881856bc57eb0c32edc', q: abfrage};
  if(check[0].length > "!wetter".length) {
    var days = check[0]["!wetter".length];
    if(!isNaN(days)) {
      var dayInt = parseInt(days);
      if(dayInt > 5) {
        say(requestor + ", soweit kann ich nicht in die Zukunft schauen, SIE " + title);
        return;
      }
      weather.forecast(cfg, function(err, json) {
        if(json.cod != '200') {
          say(requestor + ", irgendwas haben Sie vergeigt, SIE " + title);
          return;
        }
        parseWeatherForecast(json, parseInt(days), say);
      });
    }
    return;
  }
  weather.now(cfg, function(err, json) {
    if(json.cod != '200') {
      say(requestor + ", irgendwas haben Sie vergeigt, SIE " + title);
      return;
    }
    if(json['main'] == null) {
      say(requestor +', sowas gibts gar nicht, SIE ' + title + '!');
      return;
    }
    var str = requestor +', in ' + json['name'] + ' sind es gerade ' + json['main']['temp'] + ' Grad, SIE ' + title + '!' +
                ' Die API beschreibt die Wetterlage als "' + json['weather'][0]['description'] + '". '
    if('rain' in json && '3h' in json['rain']) {
      str = str + "Die naechsten drei Stunden fallen " + json['rain']['3h'] + "mm Regen."
    } else if('snow' in json && '3h' in json['snow']) {
      str = str + "Die naechsten drei Stunden fallen " + json['snow']['3h'] + "mm Schnee."
    } else {
      str = str + "Die naechsten drei Stunden gibts angeblich keinen Niederschlag."
    }
    say(str); 
  });
}

function parseWeatherForecast(json, day, say) {
  var today = new Date(new Date().getTime() + (24*day) * 60 * 60 * 1000);
  var todayStr = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
  var list = json.list;
  var city = json.city.name;
  var str = "Wetter in " + city + " am " +todayStr + ": ";
  for(i in list) {
    if(list[i].dt_txt.startsWith(todayStr)) {
      str = str + list[i].dt_txt.substring(todayStr.length+1);
      str = str + " " + list[i].main.temp + "°C ";
      if('rain' in list[i] && '3h' in list[i].rain) {
        str = str + list[i].rain['3h'] + "mm Regen"
      } else if('snow' in list[i] && '3h' in list[i].snow) {
        str = str + list[i]['snow']['3h'] + "mm Schnee"
      }
      str = str + " | "
    }
  }
  say(str);
}
