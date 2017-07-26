#!/usr/local/bin/node

var config = {
    userName: "Rainer",
    realName: "geh weg",
    channels: ["#clafoutis"],
    server: "irc.iz-smart.net",
    botName: "Rainer",
    port: 6697,
    secure: true,
    selfSigned: true,
    certExpired: true,
    autoRejoin: true
};

var sleep = require('sleep');
var irc = require('irc');
var random = require('random-js')();
var drama = require("./drama.js");
var weather = require("./weather.js");
var onlineRequests = require("./onlineRequests.js");

var warnings = require("./resources/warnhinweysze.json");
var reasons = require("./resources/reasons.json");
var boa = require("./resources/boarisch.json");
var drachenlord = require("./resources/drachen.json");

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

bot.addListener("registered", function(message) {
    console.log('Connected');
});

bot.addListener("motd", function(motd) {
    console.log('MOTD received');
});

function isPhrase(ziel, nachricht) {
    if(nachricht.startsWith("!sprichwort")) {
      onlineRequests.getPhrase(function(phrase) {
        sleep.sleep(1);
        bot.say(ziel, phrase);
        console.log(phrase);
      });
      return true;
    }
    return false;
}

function isOnAir(ziel, nachricht) {
    if(nachricht.startsWith("!soundportal")) {
      onlineRequests.getOnAir(function(phrase) {
        sleep.sleep(1);
        bot.say(ziel, phrase);
        console.log(phrase);
      });
      return true;
    }
    return false;
}

function greeting(to, message) {
  var res = message.split(/[\s,]+/).filter(function(n) { return n.trim() != ''}); 
  if(res.length == 0) {
    bot.say(to, "Ich glaube ich lebe in einer Realität, die du in deinem ganzen Leben nicht begreifen wirst");
  }
  for(var i = 0; i < res.length; i++) {
    //var isBoarisch = random.integer(0,1);
    //var isBoarisch = Math.floor((Math.random() * 2));
    //console.log("1: " + isBoarisch);
    var greeting = 'TT' + res[i].substring(0,1) + ', ';
    //if (isBoarisch > 0) {
    //  greeting = (greeting + "SE ").toUpperCase();
    //  var index = Math.floor((Math.random() * (boa.list.length)));  
    //  var title = boa.list[index].toUpperCase();
    //  bot.say(to, greeting + title + '!');
    //  console.log(greeting + title + '!');
    //} else {
    greeting = (greeting + "SIE ").toUpperCase();
    onlineRequests.getRandomWikiTitle(greeting, function(prefix, title) {
      sleep.sleep(1);
      title = title.toUpperCase();
      bot.say(to, prefix + title + '!');
      console.log(prefix + title + '!');
    });
    //}
  }
}

function getDrachenQuote(callback) {
  var index = Math.floor((Math.random() * (drachenlord.list.length)));  
  var title = drachenlord.list[index];
  callback(title);
}

function getBoa(callback) {
  var index = Math.floor((Math.random() * (boa.list.length)));  
  var title = boa.list[index].toUpperCase();
  callback(title);
}

function getReason(first, callback) {
  var index;
  var text;
  if(first == 0) {
    index = Math.floor((Math.random() * (reasons.list1.length)));  
    text = reasons.list1[index];
  } else {
    index = Math.floor((Math.random() * (reasons.list2.length)));  
    text = reasons.list2[index];
  }
  callback(text);
}

function getWarning(callback) {
  var warningNum = (Math.floor(Math.random()*warnings.list.length));
  var warning = "ACHTYNG: " + warnings.list[warningNum];
  sleep.sleep(2);
  callback(warning);
}

function reagieren(absender, ziel, nachricht) {
  var regex = '^!begruesze (.*)';
  var result = nachricht.match(regex);
  var regex2 = config.botName +"(,|:| )( )*(bin|bist|soll|kann|ist|darf|muss|hat|hab|meint).*";
  var result2 = nachricht.match(regex2);
  if(result != null) {
    greeting(ziel, result[1]);
  } else if(nachricht.startsWith("!wetter")) {
    getBoa(function(title) {
      weather.getWeather(absender, title, nachricht, function(msg) {
          bot.say(ziel, msg);
      });
    });
  } else if(nachricht.startsWith("!drachenlord")) {
    getDrachenQuote(function(title) {
      bot.say(ziel, absender+ ', '+ title);
    });
  } else if(nachricht.startsWith("!warnhinweysz")) {
      getWarning(function(warning) {
        bot.say(ziel, warning);
      });
  } else if(result2 != null) {
    var isYes = Math.floor((Math.random() * 2));
    var isFirstList = Math.floor((Math.random() * 2));
    var str = "";
    if(isYes == 0) {
      str = "Ja"
    } else {
      str = "Nein"
    }
    if(isFirstList == 0) {
      str = str + ", denn ";
    } else {
      str = str + ". ";
    }
    getReason(isFirstList, function(text) {
      bot.say(ziel, str + text);
    });
  } else if(isPhrase(ziel, nachricht)) {
  } else if(isOnAir(ziel, nachricht)) {
  } else {
    drama.dramaFunc(absender, config.botName, nachricht, function(msg) {
      bot.say(ziel, msg);
    });
  }
}

bot.addListener("topic", function(channel, topic, nick, message) {
    console.log("Topic for", channel + " is", topic);
    drama.join(function(msg) {
      bot.say(channel, msg);
    });
});

bot.addListener("error", function(message) {
    console.log("Error: ", message);
});

bot.addListener("join", function(channel, who) {
    drama.begruessen(who, config.botName, function(msg) {
      bot.say(channel, msg);
    }); 
});

bot.addListener("message", function(from, to, text, message) {
    if(text == "!rainer RAISE!") {
      bot.send("NAMES", "#clafoutis");
      console.log("MSG: " +message);
      console.log("TO: " + to);
      console.log("FROM: " + from);
    } else {
      reagieren(from, to, text); 
    }
});

bot.addListener("selfMessage", function(to, text) {
  console.log("SelfMessage " + text);
});

bot.addListener("kick", function(channel, nick, by, reason, message) {
  drama.verabschieden(function(bye) {
    bot.say(channel, bye);
  });
});

bot.addListener("names", function(channel, nicks) { 
  console.log("CHANNEL:" + channel);
  console.log(nicks);
});

bot.addListener("names#clafoutis", function(channel, nicks) { 
  console.log("CHANNEL1:" + channel);
  console.log(nicks);
});

bot.addListener("ctcp-notice", function(from, to, text, message) { 
  console.log("CHANNEL:" + from);
  console.log(text);
});

bot.addListener("ctcp", function(from, to, text, type, message) { 
  console.log("CHANNEL1:" + from);
  console.log(text);
});


bot.addListener("quit", function(nick, reason, channels, message) {
  drama.verabschieden(function(bye) {
    bot.say(channels, bye);
  });
});
