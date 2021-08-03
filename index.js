/*
 * BOT VARIABLE DECLARATIONS
 */

const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
require("dotenv").config();

//const db = require('./db');

var fs = require("fs");
//Command folder with all commands
let prefix = process.env.PREFIX;
var timeRegex = /^(?:(?:([01]?\d|2[0-3]):)([0-5]?\d):)([0-5]?\d)$/;
var colorRegex = /^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/;
var raceOpened = false;
var raceStarted = false;
var playersReady = [];
var index;
var category = ["Any%", "ATP", "AA", "any", "any%", "atp", "aa"];

var consoleChannel = "";
/**
 * Initializing the command Collection. Note that all commands have to be moved in their respective subfolder.
 *  */
client.commands = new Discord.Collection();
client.commandFolders = [];

const commandFolders = fs.readdirSync("./commands");

client.commandFolders = commandFolders;
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}
/*
 *   Initializing the EventHandler
 */
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client, prefix));
  }
}

/*
 * JSON FILES
 */

var channelList = JSON.parse(
  fs.readFileSync("./ressources/channels.json", "utf8")
);
var colorList = JSON.parse(fs.readFileSync("./ressources/colors.json", "utf8"));
/*
Initializing of other global variables such as the eventlist
*/
client.prefix = prefix;
//connects the bot to the discord users
console.log(process.env.BOT_TOKEN);
client.login(process.env.BOT_TOKEN);
/*
 * DEBUGGING STUFF
 */

var messageLogging = false;
var stdin = process.openStdin();
stdin.addListener("data", function (d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that
  // with toString() and then trim()
  var textInput = d.toString().split(" ");
  var command = textInput.shift();
  var msg = textInput.join(" ").trim();
  if (command === "select") {
    consoleChannel = channelList[msg];
    console.log("Sending console input to " + msg);
  } else if (command === "stopinput") {
    consoleChannel = "";
    console.log("Setting console input channel to null");
  } else if (command === "send") {
    client.channels.get(consoleChannel).send(msg);
  }
});
