//bot variable declarations
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

//connects the bot to the discord users
client.login(config.token);

//bot logged in succesfully and it's ready to be used
client.on("ready", () => {
  console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
});

client.on("message", (message) => {
  //message variable declarations
  let prefix = config.prefix;
  var raceOpened = false;
  var raceStarted = false;
  var playersReady = [];
  var index;
  var time;
  var screenshot;
  const category = "Any%" ; //hardcoded for now, will make it dynamic at some point

  //any message done by the bot will return nothing
  if(message.author.bot) return;

  //opens the race
  if(message.content.startsWith(prefix + "openrace")){
    if(raceOpened == false && raceStarted == false){
      message.channel.send("A new race was opened. To join the current race type !join.");
      raceOpened = true;
    }else{
      message.channel.send("Error: a race was already opened, please join the current race or wait until it finishes.");
    }
  }
  //puts the user on the ready status
  if (message.content.startsWith(prefix + "ready")) {
    if (raceOpened == true && raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        index = playersReady.findIndex(hasPlayerJoined);
        playersReady[index].ready = true;
        message.channel.send(message.author + "is ready!");
      }else{
        message.channel.send("Error: you never joined a race. To join the current opened race type !join.");
      }
    }else{
      message.channel.send("Error: you never joined a race, or a race was never opened." );
    }
  }

  //makes the user able to join the race
  if (message.content.startsWith(prefix + "join")){
    if(raceOpened == true && raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        message.channel.send("Error: you already joined this race.");
      }else {
        playersReady.push({id: message.author.user.id, ready: false, finished: false, time: "00:00", verification: null});
        message.channel.send("You joined the " + category + " race! Type !ready when you're ready, and please standy by until all players are ready." );
      }
    }else{
      message.channel.send("Error: a race was never opened. Type !openrace to open a new race.");
    }
  }

  //starts the race, this will eventually be removed
  if(message.content.startsWith(prefix + "startrace")){
    if(playersReady.some(item => item.ready = false)){
      message.channel.send("Error: some players are still not ready, please stand by.");
    }else {
      message.channel.send("The race is gonna start in 100 years! gotem");
      raceStarted = true;
      raceOpened = false;
    }
  }

  //makes a user forfeit the race, making their time invalid
  if(message.content.startsWith(prefix + "forfeit")){
    //finish
  }

  //makes the user finish a race, time and screenshot verification will be validated in the future
  if(message.content.startsWith(prefix + "done" + " " + time + " " + screenshot)){
    if(raceOpened == true && raceStarted == true){
      if(playersReady.find(hasPlayerJoined) != undefined){
        index = playersReady.findIndex(hasPlayerJoined);
        if(playersReady[index].finished == true){
          message.channel.send("Error: you alraedy submitted your time. If you want to edit your current time, type !edittime");
        }else{
          playersReady[index].finished = true;
          playersReady[index].time = time;
          playersReady[index].verification = screenshot;
          if(playersReady.some(item => item.finished == false)){
            return;
          }else {
            message.channel.send("The race is done! Thank you all for participating!");
            //foreach player display them on their respective positions according to their time
          }
        }
      }
    }else{
      message.channel.send("Your time has been saved! Thank you for participating!");
    }
  }

  //gives the user the racing role
  if(message.content.startsWith(prefix + "getrole")){
    const guildMember = message.member;
    guildMember.addRole("racing");
  }

  //finds a user on the players array
  function hasPlayerJoined(player){
    return player.id == message.author.user.id;
  }

});

//shows errors on console
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
