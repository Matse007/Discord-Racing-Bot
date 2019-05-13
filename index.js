//bot variable declarations
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const db = require('./db');

var fs = require('fs');

var memes = require('./memes.json');

let prefix = config.prefix;
var timeRegex = /^(?:(?:([01]?\d|2[0-3]):)([0-5]?\d):)([0-5]?\d)$/;
var colorRegex = /^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/;
var raceOpened = false;
var raceStarted = false;
var playersReady = [];
var index;
var category = ["Any%", "ATP", "AA", "any", "any%", "atp", "aa"];

var consoleChannel = "";

/*
* JSON FILES
*/
var channelList = JSON.parse(fs.readFileSync('channels.json', 'utf8'));
var colorList = JSON.parse(fs.readFileSync('colors.json', 'utf8'));

/*
* DEBUGGING VARAIBLES
*/
var messageLogging = false;

//connects the bot to the discord users
client.login(config.token);

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    var textInput = d.toString().split(' ');
    var command = textInput.shift();
    var msg = textInput.join(' ').trim();
    if (command === "select")
    {
      consoleChannel = channelList[msg];
      console.log("Sending console input to " + msg);
    }
    else if (command === "stopinput")
    {
      consoleChannel = "";
      console.log("Setting console input channel to null");
    }
    else if (command === "send")
    {
      client.channels.get(consoleChannel).send(msg);
    }
});

//bot logged in successfully and it's ready to be used
client.on("ready", () => {
  client.user.setPresence({
        game: {
            name: 'in Hat Kid\'s Spaceship',
            type: 0
        }
    });

  // client.channels.forEach((channel, i) => {
  //   console.log (`\"${channel.name}\": \"${channel.id}\",`);
  // });

  console.log(`Ready to server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
});

//console.log(client.channels);


client.on("message", (message) => {

  if (messageLogging)
  {
    console.log("[" + message.channel.name + "] (" 
      + message.author.username + "<>" + message.author.id + ") - " 
      + message.content);
  }

  let guild = message.guild;

  //message variable declarations
  let racingRole = guild.roles.find("name", "racing");  

  //any message done by the bot will return nothing
  if(message.author.bot) return;

  memeCommand(message);

  //for performance purposes
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //console.log(args);

  if(command === "msglog")
  {
    message.channel.send("Turning message logging to: " + !messageLogging).then(msg => {msg.delete(15000)});
    messageLogging = !messageLogging;
  }

  if(command === "colorme")
  {
    if(args[0] == undefined)
    {
      message.channel.send("Please supply a color as text (one word) or as the Hex Value (i.e. #32CD32)").then(msg => {msg.delete(15000)});
      return; 
    }
    var subCommand = args[0].toLowerCase();
    if (subCommand === "help")
    {
      if (args[1] != undefined && args[1].toLowerCase() === "colors")
      {

      }
      else
      message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "Color Help",
      description: "Here's a list of commands to help you color your name",
      fields: [{
        name: "Command format",
        value: "$colorme <color_here> | <color_here> is a color written in Hex (i.e. #32CD32) or text (red or yellow)\nExamples: \n\t$colorme #32CD32 \n\t$colorme green"
      },
      {
        name: "Preset colors to choose from",
        value: "Use any of these colors if you need a color to choose from: \n red, green, blue, black, white, yellow, magenta, cyan, purple, orange, pink, lime, limegreen"
      },
      {
        name: "Custom Hex Color",
        value: "Use this to find the perfect hex color for your name. \nColor Picker: https://www.google.com/search?q=color+picker"
      },
      {
        name: "Delete Custom Color",
        value: "Type ($colorme delete) or ($colorme remove) to remove your custom color"
      }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "Authors: Enhu/Shockwve | Rumbi v1.2.2"
      }
    }
    });
    }
    else if(colorRegex.test(subCommand.toUpperCase())  || checkValidColor(subCommand))
    {
      var roleColor = checkValidColor(subCommand) ? colorList[subCommand] : subCommand;

      checkForColorRole();

      // Create a new role with data
      guild.createRole({
        name: message.author.username,
        color: roleColor,
        position: guild.roles.size - 4
      }).then(role => {
          message.channel.send(`Created new role with name ${role.name} and with color ${subCommand}`).then(msg => {msg.delete(5000)})
          message.member.addRole(role).catch(console.error);
          message.channel.send(`Assigned user ${message.author.username} with new role`).then(msg => {msg.delete(5000)})
      })
    }
    else if(subCommand === "remove" || subCommand === "delete")
    {
      checkForColorRole();
    }
    else {
      message.channel.send("Please supply a color as text (one word) or as the Hex Value (i.e. #32CD32)").then(msg => {msg.delete(15000)});
    }
  }
    
  if(command === "addmeme"){

    if(message.member.roles.find("name", "Admins") || message.author.username == "Shockwve"){
      var newMeme = args.join(' ').split('|');
      message.channel.send("Adding new meme: " + newMeme[0].toLowerCase() + " -> " + newMeme[1])
      memes[newMeme[0].toLowerCase()] = newMeme[1];
      fs.writeFileSync('memes.json', JSON.stringify(memes));

      memes = require('./memes.json');
    }
  }

  if (command === "delmeme"){

    if(message.member.roles.find("name", "Admins") || message.author.id == "72182588885700608"){
      if (args.length <= 0)
      {
        message.channel.send("Next time, try telling me what to delete ya goofnut...");
        return;
      }
      var newMeme = args.join(' ').toLowerCase().split('|');
      message.channel.send("Deleting meme: " + newMeme)
      delete memes[newMeme];
      fs.writeFileSync('memes.json', JSON.stringify(memes));

      memes = require('./memes.json');
    }
  }

  if (command === "ksarg")
  {
    if(message.author.id == "78321950904033280" || message.author.id == "72182588885700608"){
      client.channels.get("484800903539458079").send(args.join(' '));
    }
  }

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
      } else{
        message.channel.send("**Error:** you never joined a race. To join the current race type $join.").then(msg => {msg.delete(5000)});
      }
    } else{
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
          var timer = 4;

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
        if (playersReady[index].finished == true){
          message.channel.send("Error: you already submitted your time").then(msg => {msg.delete(5000)});
        } else {
          playersReady[index].finished = true;
          playersReady[index].time = "23:00:00";
          message.channel.send("Your result has been submitted. Thank you for participating.").then(msg => {msg.delete(5000)});
          if (playersReady.some(item => item.finished == false)) {
            return;
          } else {
            message.channel.send("The race is done! Thank you all for participating!");
            playersReady.sort(function (a, b) {
              return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
            });
            var position = 0;
            playersReady.forEach(function(item, i) { if (item.time == "23:00:00") playersReady[i].time = "Forfeit" });
            //db.storeResults(playersReady);
            postFinishedRaceStats(message);
          }
        }
      } else {
        message.channel.send("**Error:** you never joined a race.").then(msg => {msg.delete(5000)});
      }
    } else {
      message.channel.send("**Error:** a race was never opened or started.").then(msg => {msg.delete(5000)});
    }
  }

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
            //db.storeResults(playersReady);
            postFinishedRaceStats(message);
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
        text: "Authors: Enhu/Shockwve | Rumbi v1.2.2"
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

  function postFinishedRaceStats(message)
  {
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

  function checkForColorRole()
  {
    var currentColor = guild.roles.find(role => role.name === message.author.username);

    if(currentColor)
    {
      guild.roles.find(role => role.name === message.author.username).delete();
      message.channel.send(`Successfully deleted ${message.author.username}'s color role`).then(msg => {msg.delete(3000)})
    }
    else
    {
      message.channel.send("**Error:** you have no current color role.").then(msg => {msg.delete(5000)});
    }
  }

  //for future use

});


function memeCommand(message)
{
  for (key in memes)
  { 
    //console.log("checking " + message.content + " for meme key: " + key);
    if (message.content.toLowerCase().includes(key.toLowerCase())) {
      //console.log("found matching meme key")
      //console.log(memes[key.toLowerCase()]);
      message.channel.send(memes[key.toLowerCase()]);
      return;
    }
  }
  if (message.content.toLowerCase().includes("danielcnr") || message.content.toLowerCase().includes("dancnr") /*|| message.content.includes("<@78322089320263680>")*/) {
    if (message.channel.id == 484800903539458079)
    {
      message.channel.send("THE DIVING IS SMS https://clips.twitch.tv/OilyHelpfulDoveBigBrother");
      var voiceChannel = message.member.voiceChannel;
      /*if (voiceChannel) {
        voiceChannel.join().then(connection => {
            const dispatcher = connection.playFile('G:\\Discord Racing Bot\\sms.wav');
            dispatcher.on("end", end => {
              voiceChannel.leave();
            });
          })
          .catch(err => console.log(err));
        voiceChannel.leave();
      } */
    }
  }
}

//shows errors on console
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function checkValidColor(color)
{
  if(colorList.hasOwnProperty(color))
  {
    return colorList[color];
  }
  return false;
}

function getJSONObjectKeys(jsonObject)
{
  var keyList = [];
  for (key in jsonObject)
  {
    keyList.push(key);
  }
  return keyList;
}