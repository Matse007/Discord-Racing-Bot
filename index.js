//bot variable declarations
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

let prefix = config.prefix;
var raceOpened = false;
var raceStarted = false;
var playersReady = [];
var index;
var category;
//connects the bot to the discord users
client.login(config.token);

//bot logged in succesfully and it's ready to be used
client.on("ready", () => {
  console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
});

client.on("message", (message) => {
  //message variable declarations
  let racingRole = message.guild.roles.find("name", "racing");

  //any message done by the bot will return nothing
  if(message.author.bot) return;
  //for performance purposes
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //opens the race
  if(command === "newrace"){
    if(raceOpened == false && raceStarted == false){
      category = args[0];
      message.channel.send("A new " + category + "race was opened. To join the current race type !join.");
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
        message.channel.send(message.author + " is ready!");
      }else{
        message.channel.send("Error: you never joined a race. To join the current opened race type !join.");
      }
    }else{
      message.channel.send("Error: you never joined a race, or a race was never opened." );
    }
  }

  //makes the user able to join the race
  if (command === "join"){
    var playerId = message.author.id;
    var playerName = message.author;
    if(raceOpened == true && raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        message.channel.send("Error: you already joined this race.");
      }else {
        var playerObject = {id: playerId, name: playerName, ready: false, finished: false, time: "00:00", verification: null};
        playersReady.push(playerObject);
        message.channel.send("You joined the " + category + " race! Type !ready when you're ready, and please stand by until all players are ready." );
      }
    }else{
      message.channel.send("Error: a race was never opened. Type !openrace to open a new race.");
    }
  }

  //starts the race, this will eventually be removed
  if(command === "startrace"){
    if(raceOpened == true && raceStarted == false){
      if(playersReady.length > 0){
        if(playersReady.some(item => item.ready == false)){
          message.channel.send("Error: some players are still not ready, please stand by.");
        }else {
          message.channel.send("The race is gonna start in 100 years! gotem");
          raceStarted = true;
          raceOpened = true;
        }
      }else{
        message.channel.send("Error: no one joined the race.");
      }
    }else{
      message.channel.send("Error: a race was never opened or a race is going on.");
    }
  }

  //makes a user forfeit the race, making their time invalid
  if(message.content.startsWith(prefix + "forfeit")){
    //finish
    if(raceOpened == true && raceStarted == true){
      if(playersReady.find(hasPlayerJoined) != undefined){
        playersReady[index].finished = true;
        playersReady[index].time = "Forfeit";
        message.channel.send("Your result has been submitted. Thank you for participating.");
      }else{
        message.channel.send("Error: you never joined a race.");
      }
    }else{
      message.channel.send("Error: a race was never opened, or started.");
    }
  }

  //makes the user finish a race, time and screenshot verification will be validated in the future
  if(command === "done"){
    if(raceOpened == true && raceStarted == true){
      if(playersReady.find(hasPlayerJoined) != undefined){
        index = playersReady.findIndex(hasPlayerJoined);
        if(playersReady[index].finished == true){
          message.channel.send("Error: you already submitted your time. If you want to edit your current time, type !edittime");
        }else{
          playersReady[index].finished = true;
          playersReady[index].time = args[0];
          message.channel.send("Your time has been saved! Thank you for participating!");
          if(playersReady.some(item => item.finished == false)){
            return;
          }else{
            message.channel.send("The race is done! Thank you all for participating!");
            playersReady.sort(compareTimes);
            playersReady.forEach(function(player){
              message.channel.send("Player: " + player.name.username + " | Time: " + player.time);
            });
            playersReady = [];
            raceOpened = false;
            raceStarted = false;
            //foreach player display them on their respective positions according to their time
          }
        }
      }
    }else{
      message.channel.send("Error: a race was never opened, or you never joined it.");
    }
  }

  //gives the user the racing role
  if(command === "getrole"){
    const guildMember = message.member;
    if (message.member.roles.find("name", "racing")){
      message.channel.send("Error: you already have the role.");
    }else{
      guildMember.addRole(racingRole).catch(console.error);
      message.channel.send("Success!");
    }
  }

  //removes the role from the user
  if(command === "removerole"){
    const guildMember = message.member;
    if (message.member.roles.find("name", "racing")){
      guildMember.removeRole(racingRole).catch(console.error);
      message.channel.send("Success!");
    }else{
      message.channel.send("Error: you don't have the racing role.");
    }
  }

  if(command === "help"){
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "List of commands",
      description: "Here's a list of commands with details of each one of them.",
      fields: [{
        name: "!newrace Category",
        value: "Opens a race, you can choose which category you want to race, as long as it's Any%, ATP, AA or AR."
      },
      {
        name: "!join",
        value: "You can join the current open race by using this command, this will put you on the players queue."
      },
      {
        name: "!ready",
        value: "Use this command when you're ready to race!"
      },
      {
        name: "!startrace",
        value: "Use this command to start the race. After using this command, a 30 seconds countdown will start."
      },
      {
        name: "!forfeit",
        value: "Use this command to forfeit the race."
      },
      {
        name: "!done yourtime",
        value: "Use this command when you finished the run. Keep in mind you will need to submit a time and a screenshot for verification, otherwise your time won't be allowed on the final results."
      },
      {
        name: "!getrole",
        value: "Use this command to get the 'racing' role."
      },
      {
        name: "!removerolet",
        value: "Use this command to remove the 'racing' role from your roles."
      }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "© Enhu"
      }
    }
    });
  }

  //finds a user on the players array
  function hasPlayerJoined(player){
    return player.id == message.author.id;
  }

  function compareTimes(player1, player2){
    if (player1.time > player2.time)
      return player1.time - player2.time;
  }

  //for future use

});

//shows errors on console
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
