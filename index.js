//bot variable declarations
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

let prefix = config.prefix;
var timeRegex = /^(?:(?:([01]?\d|2[0-3]):)([0-5]?\d):)([0-5]?\d)$/;
var raceOpened = false;
var raceStarted = false;
var playersReady = [];
var index;
var category = ["Any%", "ATP", "AA", "any", "any%", "atp", "aa"];
//connects the bot to the discord users
client.login(config.token);

//bot logged in successfully and it's ready to be used
client.on("ready", () => {
  console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
});

client.on("message", (message) => {
  //message variable declarations
  let racingRole = message.guild.roles.find("name", "racing");

  if (message.content.startsWith("shockwve")) {
    message.channel.send("white graps LMAO");
  }
  //any message done by the bot will return nothing
  if(message.author.bot) return;
  //for performance purposes
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "reset"){
    if(message.member.roles.find("name", "Moderators") || message.member.roles.find("name", "Discord Mod") || message.author.id == "92816669910519808"){
	resetBot(message.channel);
    }
  }

  //opens the race
  if(command === "newrace"){
    if(raceOpened == false && raceStarted == false){
      if(category.includes(args[0]) == true){
      category = args[0];
      message.channel.send("A new **" + category + "** race was opened. To join type $join.");
      raceOpened = true;
    }else{
      message.channel.send("**Error:** please indicate the proper category (use only acronyms e.g: ATP)").then(msg => {msg.delete(5000)});
    }
    }else{
      message.channel.send("**Error:** a race was already opened, wait or join the current one.").then(msg => {msg.delete(5000)});
    }
  }
  //puts the user on the ready status
  if (command === "ready") {
    if (raceOpened == true && raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        index = playersReady.findIndex(hasPlayerJoined);
        playersReady[index].ready = true;
        message.channel.send(message.author + " is ready!");
      }else{
        message.channel.send("**Error:** you never joined a race. To join the current race type $join.").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** A race was never opened." ).then(msg => {msg.delete(5000)});
    }
  }

  if (command === "seed")
  {
    message.channel.send("https://shockwve.github.io/?seed=" + Math.floor(Math.random() * 999999) + 1);
  }

  if (command === "notready") {
    if (raceOpened == true && raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        index = playersReady.findIndex(hasPlayerJoined);
        playersReady[index].ready = false;
        message.channel.send(message.author + " is not ready!").then(msg => {msg.delete(5000)});
      }else{
        message.channel.send("**Error:** you never joined a race. To join the current race type $join.").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** A race was never opened." ).then(msg => {msg.delete(5000)});
    }
  }
  //makes the user able to join the race
  if (command === "join"){
    var playerId = message.author.id;
    var playerName = message.author.username;
    if(raceOpened == true && raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        message.channel.send("**Error:** you already joined this race.");
      }else {
        var playerObject = {id: playerId, name: playerName, ready: false, finished: false, time: null, verification: null};
        playersReady.push(playerObject);
        message.channel.send("You joined the **" + category + "** race! To ready up, type $ready." ).then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** a race was never opened. Type $newrace to open a new race.").then(msg => {msg.delete(5000)});
    }
  }

  //starts the race, this will eventually be removed
  if(command === "startrace"){
    if(raceOpened == true && raceStarted == false){
      if(playersReady.length != 0 && playersReady.length > 1){
        if(playersReady.some(item => item.ready == false)){
          message.channel.send("**Error:** some players are still not ready, please stand by.").then(msg => {msg.delete(5000)});
        }else {
          message.channel.send("The race is on! Race will start in around 30 seconds, good luck and have fun!");
          raceStarted = true;
          raceOpened = true;
          setTimeout(function() {
          var timer = 6;

          a = setInterval(function(){
              timer = timer-1;
              if(timer > 0){
                message.channel.send("```" + timer + "```");
              }else{
                message.channel.send("```GO!```");
                clearInterval(a);
              }
                }, 1000);
            }, 30000);
        }
      }else{
        message.channel.send("**Error:** you can only start the race with 2 participants or more").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** a race was never opened or a race is going on.").then(msg => {msg.delete(5000)});
    }
  }

  if(command === "retreat"){
    //finish
    if(raceOpened == true){
      if(raceStarted == false){
      if(playersReady.find(hasPlayerJoined) != undefined){
        index = playersReady.findIndex(hasPlayerJoined);
        playersReady.splice(index, 1)
        message.channel.send("You have successfully retreated the race.").then(msg => {msg.delete(5000)});
      }else{
        message.channel.send("**Error:** you never joined a race.").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** a race is going on at the moment. Please use the $forfeit command").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** a race was never opened.").then(msg => {msg.delete(5000)});
    }
  }

  //makes a user forfeit the race, making their time invalid
  if(command === "forfeit"){
    //finish
    if(raceOpened == true && raceStarted == true){
      if(playersReady.find(hasPlayerJoined) != undefined){

        index = playersReady.findIndex(hasPlayerJoined);
        if(playersReady[index].finished == true){
          message.channel.send("Error: you already submitted your time").then(msg => {msg.delete(5000)});
        }else{
          playersReady[index].finished = true;
          playersReady[index].time = "23:00:00";
          message.channel.send("Your result has been submitted. Thank you for participating.").then(msg => {msg.delete(5000)});
          if(playersReady.some(item => item.finished == false)){
            return;
          }else{
            message.channel.send("The race is done! Thank you all for participating!");
            playersReady.sort(function (a, b) {
				return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
			});
      var position = 0;
			playersReady.forEach(function(item, i) { if (item.time == "23:00:00") playersReady[i].time = "Forfeit" });
      message.channel.send("------------------------------------------------------");
      message.channel.send("**Results:**");
      playersReady.forEach(function(player){
              position = position + 1;
              message.channel.send("**#" + position + "**       > **Player:** " + player.name + " | **Time:** " + player.time);
            });
            //rework this later on
			      playersReady = [];
            raceOpened = false;
            raceStarted = false;
          }
        }
      }else{
        message.channel.send("**Error:** you never joined a race.").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** a race was never opened or started.").then(msg => {msg.delete(5000)});
    }
  }

//kills the race, unsure of this command for now (reset does the same function)
  /*if(command === "kill"){
    //kill the race
    playersReady = [];
    raceOpened = false;
    raceStarted = false;
    message.channel.send("The race has successfully been deleted.").then(msg => {msg.delete(5000)});
  }*/

  //makes the user finish a race
  if(command === "done"){
    if(raceOpened == true && raceStarted == true){
      if(playersReady.find(hasPlayerJoined) != undefined){
          if(timeRegex.test(args[0]) == true){
        index = playersReady.findIndex(hasPlayerJoined);
        if(playersReady[index].finished == true){
          message.channel.send("Error: you already submitted your time").then(msg => {msg.delete(5000)});
        }else{
          playersReady[index].finished = true;
          playersReady[index].time = args[0];
          message.channel.send("Your result has been submitted. Thank you for participating!").then(msg => {msg.delete(5000)});
          if(playersReady.some(item => item.finished == false)){
            return;
          }else{
            message.channel.send("The race is done! Thank you all for participating!");
            playersReady.sort(function (a, b) {
				return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
			});
      var position = 0;
			playersReady.forEach(function(item, i) { if (item.time == "23:00:00") playersReady[i].time = "Forfeit" });
      message.channel.send("```------------------------------------------------------```");
      message.channel.send("**Results:**");
      playersReady.forEach(function(player){
        position = position + 1;
        message.channel.send("**#" + position + "**       > **Player:** " + player.name + " | **Time:** " + player.time);
            });
            //rework this later on
			      playersReady = [];
            raceOpened = false;
            raceStarted = false;
            //foreach player display them on their respective positions according to their time
            //FIX TIME COMPARISON YOU LAZY FUCK (update: i fixed it!)
          }
        }
        }else{
          message.channel.send("**Error:** you didn't submit a time or the time submitted is wrong (e.g of correct time: xx:xx:xx or x:xx:xx)").then(msg => {msg.delete(5000)});
        }
      }else{
        message.channel.send("**Error:** you never joined a race.").then(msg => {msg.delete(5000)});
      }
    }else{
      message.channel.send("**Error:** a race was never opened/started or you never joined it.").then(msg => {msg.delete(5000)});
    }
  }

  //gives the user the racing role
  if(command === "getrole"){
    const guildMember = message.member;
    if (message.member.roles.find("name", "racing")){
      message.channel.send("Error: you already have the role.").then(msg => {msg.delete(5000)});
    }else{
      guildMember.addRole(racingRole).catch(console.error);
      message.channel.send("Success!").then(msg => {msg.delete(5000)});
    }
  }

  //removes the role from the user
  if(command === "removerole"){
    const guildMember = message.member;
    if (message.member.roles.find("name", "racing")){
      guildMember.removeRole(racingRole).catch(console.error);
      message.channel.send("Success!").then(msg => {msg.delete(5000)});
    }else{
      message.channel.send("**Error**: you don't have the racing role.").then(msg => {msg.delete(5000)});
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
        name: "$newrace category (Any%, ATP, AA, AR)",
        value: "Opens a race, you can choose which category you want to race (e.g: Any%, ATP, AA, AR)."
      },
      {
        name: "$join",
        value: "You can join the current open race by using this command, this will put you on the players queue."
      },
      {
        name: "$ready",
        value: "Use this command when you're ready to race."
      },
      {
        name: "$notready",
        value: "Use this command to notify you're still not ready to race."
      },
      {
        name: "$startrace",
        value: "Use this command to start the race."
      },
      {
        name: "$retreat",
        value: "Lets you retreat from the race before starting it."
      },
      {
        name: "$forfeit",
        value: "Use this command to forfeit the race."
      },
      {
        name: "$done yourtime (e.g: xx:xx:xx)",
        value: "Use this command to submit your time."
      },
      {
        name: "$getrole",
        value: "Use this command to get the 'racing' role."
      },
      {
        name: "$removerole",
        value: "Use this command to remove the 'racing' role from your roles."
      },
	  {
        name: "$reset",
        value: "Use this command reset the bot (only available for discord mods)"
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

//reset the bot
  function resetBot(channel) {
    //send channel a message that you're resetting bot
    channel.send('Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(config.token));
}

  //finds a user on the players array
  function hasPlayerJoined(player){
    return player.id == message.author.id;
  }

  //for future use

});

//shows errors on console
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
