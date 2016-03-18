#!/usr/local/bin/node

var config = {
    userName: "nodi",
    realName: "geh weg",
    channels: ["#clafoutis"],
    server: "irc.iz-smart.net",
    botName: "nodi",
    port: 6697,
    secure: true,
    selfSigned: true,
    certExpired: true,
    autoRejoin: true
};

var sleep = require('sleep');
var irc = require('irc');
var request = require('request');
var fs = require('fs');
//var YQL = require('yql');
var weather = require('openweathermap')

var verwirrtes = ["ups", "oh hi", "oh oh...", "na sowas", "oh.. du warst nicht gemeint", "oh.. hi", "argh, mist", "oh scheisse", "oh verdammt", "wenn man vom teufel spricht", "gutes timing", "hm, das ist jetzt unangenehm", "oh, peinlich.."];
var gruesse = ["hi", "hallo", "tag", "moin", "mahlzeit", "tach", "hallo fans"];
var boeseabschiede = ["und tschüss", "na endlich", "plötzlich riechts hier viel besser", "na also", "endlich weg", "auf nimmerwiedersehen", "dieser typ...", "ja, hau doch ab", "ja, geh doch", "genau, raus hier"];
var liebeabschiede = ["och :(", "verlass mich noch nicht :(", "schade", "oh nein :(", "bleib doch hier!", "wohin gehst du so schnell? :(", "ach schade", "den mag ich", "neeeein :("];
var boa = fs.readFileSync("boarisch.txt").toString().split("\n");

var beleidigungen = [
    " ist so ein depp",
    " ist so eine kleine dramaqueen",
    " ist ein schlappschwanz",
    " hat hier nichts beizutragen",
    " soll sich endlich verpissen",
    " ist eine ziemliche aufmerksamkeitshure",
    " ist ein ziemliches stück dreck, warum ist er noch hier?",
    " nervt",
    " ist ein wertloser Gnom",
    " keiner will den hier haben, aber sag ihm das nicht",
    " ist hier nicht sonderlich beliebt",
    " ist immer so",
    " weiß aber nichts davon?",
    " ist echt ein versager",
    " darf das aber nicht hören",
    " ist so ein spast",
    " ist ne fotze",
    " kann echt nichts",
    " hat sie nicht mehr alle",
    " hat wahrscheinlich psychische probleme",
    " kann mich mal kreuzweise",
    " mangelt es an esprit",
    " hat hier gar nichts zu melden",
    " braucht gar nicht mehr angekrochen zu kommen",
    " Wann i sog i kauf des Kinderwagl, dann kauf i des Kinderwagl, do gibt's kane Wiaschtln!",
    " Ja auf goa koan Foi, wo dengst‘n du hi du Hoibdepp du dahauda, wia kimmst’n auf sowos, oiso wirkli!",
    " Kimm du mia blos ned aso, wei sunst kimm i dia abfikatisch!"
]; 

var lobe = [
    " ist ganz nett",
    " ist echt intelligent",
    " ist lieb",
    " mag fast jeder",
    " ist hier recht beliebt",
    " ist ziemich gebildet",
    " sieht glaube ich ganz hübsch aus",
    " ist zu gut für diese welt",
    " wird es noch weit bringen",
    " hat da wirklich talent",
    " ist ziemlich sexy",
    " ist wunderschön",
    " kann echt nett sein"
];

var eroeffnung = [
    "ja, ",
    "jo ",
    "absolut, ",
    "ernsthaft, ",
    "stimme 100%% zu, ",
    "volle zustimmung, ",
    "jeder wird mir da recht geben, ",
    "ja, der meinte neulich auch, ",
    "ich stimme da zu, ",
    "richtig, ",
    "korrekt, ",
    "absolut richtig, ",
    "wie gesagt, ",
    "da stimme ich absolut zu, ",
    "das sagen alle: "
];

var reaktionboese = [
    "hat jemand die null gewählt?",
    "was labert die denn schon wieder?",
    "so ein blödsinn",
    "totaler quatsch",
    "bist du wahnsinnig?",
    "gäääähn",
    "hackts?",
    "gehts noch?",
    "wie langweilig",
    "ach komm, das will keiner lesen",
    "ich kann mir das nicht länger durchlesen",
    "kann dem mal einer das maul stopfen?",
    "wir sind hier nicht bei knuddels...",
    "ruhe jetzt",
    "schnauze!",
    "es kann sprechen...",
    "immer der selbe blödsinn",
    "pff, blödsinn",
    "halt doch endlich die fresse",
    "schwachsinn",
    "was redest du so ein blech?",
    "kannst du auch mal was intelligentes sagen?",
    "keiner mag dich...",
    "ratte...",
    "schwein...",
    "-.-",
    "D:",
    "%, Mein Wort als Metaller ist mehr wert, als alle Diamanten der Weld",
    "Nun jungs da könnt ihr noch Lange übern ich bin ein zimlich extremer hetbanger und auch wen ich jetzt seit fast 4 monerten nur ein oder zwei mal gebangt habe habe ich doch vor einem Jahr fast jeden Freitag und Samstag geheadbangt aber habe trozdem genik schmerzen gehabt",
    "%, es gibt nicht zu jung, es gibt nur zu eng" ,
    "%, hädde Columbus Amerika nie entdeckt, wären Indianer heute sowas wie Elfen",
    "%, was ist schwerer ein gramm federn oder ein gramm eisen? Federn sind schwerer, wobei es auf den grundgedanken ankommt.",
    "%, ich bezweifle das man Kondome Normen kann. Kondome bestehen aus Latex einem Big samen und elastischen material. Genormte Sachen bestehen dagegen aus Festen und nicht so leicht zu verformenden material wie Eisen. Also ich weiß nicht wo du deine Kondome kaufst aber ich würde mir kein Metal Kondom überziehen das ding ist scheiß kalt.",
    "Brot kann scheissen, was könnt ihr?",
    "Selbstmord mach ich, wenn deine Mutter tot vor mir liegt und sagt 'Ficken?'",
    "%, ich werde mich nun hinlegen und werde die königin so positzioniren das du ihn ihre votze kannst aber ich auch ferstest du"
];

var reaktionlieb = [
    "stimmt",
    "du bist so klug!",
    "wow, so hab ich das noch nie gesehen :)",
    "du weißt echt viel",
    "haaach *_*",
    "du bist echt toll",
    "ich will dich nie verlieren :)",
    "hoffentlich bleibst du noch lange :)",
    "du bist so schön :)",
    "du bist so lieb <3",
    "erzähl mir mehr davon :)",
    "du bist einer der wenigen vernünftigen hier :)",
    "ich glaube ich mag dich :)",
    "%, Hass kann aber durch etwas geheilt werden: Liebe, Zuneigung, Freundschaft." 
];

var laune = -10;

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});
bot.addListener("registered", function(message) {
    console.log('Connected');
});
bot.addListener("motd", function(motd) {
    console.log('MOTD received');
});

function verbalLaune(laune) {
    if (laune < 0) {
        return "schlecht";
    } else {
        return "gut";
    }
}

function verabschieden(ziel) {
    var byebye = boeseabschiede[Math.floor(Math.random() * boeseabschiede.length)];
    var adieu = liebeabschiede[Math.floor(Math.random() * liebeabschiede.length)];
    if (laune < 0) {
        bot.say(ziel, byebye);
    } else {
        bot.say(ziel, adieu);
    }
}

function begruessen(ziel, person) {
    var beleidigung = beleidigungen[Math.floor(Math.random() * beleidigungen.length)];
    var liebe = lobe[Math.floor(Math.random() * lobe.length)];
    var start = eroeffnung[Math.floor(Math.random() * eroeffnung.length)];
    var oops = verwirrtes[Math.floor(Math.random() * verwirrtes.length)];
    switch (person) {
        case config.botName:
            console.log('successfully joined');
            break;

        default:
            if (Math.random() > 0.5) {
                if (laune < 0) {
                    sleep.sleep(2);
                    bot.say(ziel, start + person + beleidigung);
                    sleep.sleep(3);
                    bot.say(ziel, oops);
                    laune = laune + (100 * Math.random());
                } else {
                    bot.say(ziel, start + person + liebe);
                    laune = laune - (100 * Math.random());
                }
                break;
            }
    }
}

function getWeather(requestor, to, message) {
  var index = Math.floor((Math.random() * boa.length-1));  
  var title = boa[index].toUpperCase();
  var check = message.split(' ');
  var abfrage = message.substring(message.indexOf(' ')+1)
  if(check.length == 1) {
    bot.say(to, requestor +', verarschen koennen Sie sich selbst, SIE ' + title + '!');
    return;
  }
  var cfg = {units: 'metric', lang: 'de', mode: 'json', APPID : 'a83e93e4c9dba881856bc57eb0c32edc', q: abfrage};
  weather.now(cfg, function(err, json) {
    if(json['main'] == null) {
      bot.say(to, requestor +', sowas gibts gar nicht, SIE ' + title + '!');
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
    bot.say(to, str); 
  });
}

function getRandomWikiTitle(prefix, callback) {
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

function getPhrase(callback) {
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

function isPhrase(ziel, nachricht) {
    if(nachricht.startsWith("!sprichwort")) {
      getPhrase(function(phrase) {
        sleep.sleep(1);
        bot.say(ziel, phrase);
        console.log(phrase);
      });
      return true;
    }
    return false;
}

function greeting(to, message) {
  var res = message.split(/[\s,]+/); 
  for(var i = 0; i < res.length; i++) {
    var isBoarisch = Math.floor((Math.random() * 100));
    console.log("1: " + isBoarisch);
    isBoarisch = isBoarisch %2;
    var greeting = 'TT' + res[i].substring(0,1) + ', ';
    console.log("2: " + isBoarisch);
    if (isBoarisch > 0) {
      greeting = (greeting + "SE ").toUpperCase();
      var index = Math.floor((Math.random() * boa.length-1));  
      var title = boa[index].toUpperCase();
      bot.say(to, greeting + title + '!');
      console.log(greeting + title + '!');
    } else {
      greeting = (greeting + "SIE ").toUpperCase();
      getRandomWikiTitle(greeting, function(prefix, title) {
          sleep.sleep(1);
          title = title.toUpperCase();
          bot.say(to, prefix + title + '!');
          console.log(prefix + title + '!');
          });
    }
  }
}

function reagieren(absender, ziel, nachricht) {
    var regex = '^!begruesze (.*)'
    var result = nachricht.match(regex);
    if(result != null) {
      greeting(ziel, result[1]);
    } else if(nachricht.startsWith("!wetter")) {
      getWeather(absender, ziel, nachricht);
    } else if(isPhrase(ziel, nachricht)) {
    } else {
      var antwortboese = reaktionboese[Math.floor(Math.random() * reaktionboese.length)];
      var antwortlieb = reaktionlieb[Math.floor(Math.random() * reaktionlieb.length)];
      if(antwortboese.startsWith("%")) {
        antwortboese = absender + antwortboese.substring(1); 
      }
      if(antwortlieb.startsWith("%")) {
        antwortlieb = absender + antwortlieb.substring(1); 
      }
      if (Math.random() < 0.1) {
        if (laune < 0) {
          if (laune < 0) {
            sleep.sleep(2);
            bot.say(ziel, antwortboese);
            laune = laune + (100 * Math.random());
          } else {
            sleep.sleep(2);
            bot.say(ziel, antwortlieb);
            laune = laune - (100 * Math.random());
          }
        }
      }

      if (nachricht.indexOf(config.botName) > -1) {
        if (nachricht.indexOf("wie geht") == -1) {

          if (laune < 0) {
            sleep.sleep(2);
            bot.say(ziel, antwortboese);
          } else {
            sleep.sleep(2);
            bot.say(ziel, antwortlieb);
          }
        } else {
          sleep.sleep(2);
          bot.say(ziel, verbalLaune(laune));
          laune = laune - 5;
        }
      }
  }
}


bot.addListener("topic", function(channel, topic, nick, message) {
    console.log("Topic for", channel + " is", topic);
    var gruss = gruesse[Math.floor(Math.random() * gruesse.length)];
    bot.say(channel, gruss);
});

bot.addListener("error", function(message) {
    console.log("Error: ", message);
});

bot.addListener("join", function(channel, who) {
    begruessen(channel, who); 
});

bot.addListener("message", function(from, to, text, message) {
    reagieren(from, to,text); 
});

bot.addListener("kick", function(channel, nick, by, reason, message) {
    verabschieden(channel);
    laune = laune + 5;
});

bot.addListener("quit", function(nick, reason, channels, message) {
    verabschieden(channels);
});

