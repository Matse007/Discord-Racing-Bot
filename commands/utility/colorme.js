var fs = require("fs");
const Discord = require("discord.js");
var colorRegex = /^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/;
var colorList = JSON.parse(fs.readFileSync("./ressources/colors.json", "utf8"));
let rolelistJSON;
//var roleList = require.main.require('./ressources/roleList.json');
function checkValidColor(color) {
  if (colorList.hasOwnProperty(color)) {
    return colorList[color];
  }
  return false;
}
function writeJSON() {
  let json = JSON.stringify(rolelistJSON, null, "\t");
  fs.writeFile("./ressources/roleList.json", json, "utf8", (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
}

module.exports = {
  name: "colorme",
  description: "this command is used to give people individual color roles",
  guildOnly: true,
  usage: `$colorme <color_here> | <color_here> is a color written in Hex (i.e. #32CD32) or text (red or yellow)\nExamples: \n\t$colorme #32CD32 \n\t$colorme green`,
  hidden: false,
  helpFields: [
    {
      name: "Preset colors to choose from",
      value:
        "Use any of these colors if you need a color to choose from: \n red, green, blue, black, white, yellow, magenta, cyan, purple, orange, pink, lime, limegreen",
    },
    {
      name: "Custom Hex Color",
      value:
        "Use this to find the perfect hex color for your name. \nColor Picker: https://www.google.com/search?q=color+picker",
    },
    {
      name: "Delete Custom Color",
      value:
        "Type ($colorme delete) or ($colorme remove) to remove your custom color",
    },
  ],

  execute(message, args) {
    if (args[0] == undefined) {
      message.channel
        .send(
          "Please supply a color as text (one word) or as the Hex Value (i.e. #32CD32)"
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
        })
        .catch(console.error);
      return;
    }
    //loading the JSON file again
    rolelistJSON = JSON.parse(
      fs.readFileSync("./ressources/roleList.json", "utf8")
    );
    var subCommand = args[0].toLowerCase();
    if (subCommand === "help") {
      message.channel.send({
        embed: {
          color: 3447003,
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL,
          },
          title: "Color Help",
          description: "Here's a list of commands to help you color your name",
          fields: [
            {
              name: "Command format",
              value:
                "$colorme <color_here> | <color_here> is a color written in Hex (i.e. #32CD32) or text (red or yellow)\nExamples: \n\t$colorme #32CD32 \n\t$colorme green",
            },
            {
              name: "Preset colors to choose from",
              value:
                "Use any of these colors if you need a color to choose from: \n red, green, blue, black, white, yellow, magenta, cyan, purple, orange, pink, lime, limegreen",
            },
            {
              name: "Custom Hex Color",
              value:
                "Use this to find the perfect hex color for your name. \nColor Picker: https://www.google.com/search?q=color+picker",
            },
            {
              name: "Delete Custom Color",
              value:
                "Type ($colorme delete) or ($colorme remove) to remove your custom color",
            },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.client.user.avatarURL,
            text: "Authors: Enhu/Shockwve | Rumbi v1.2.2",
          },
        },
      });
    } else if (
      colorRegex.test(subCommand.toUpperCase()) ||
      checkValidColor(subCommand)
    ) {
      var roleColor = checkValidColor(subCommand)
        ? colorList[subCommand]
        : subCommand;
      //If the role already exists in the JSON document, we are gonna get that role and edit it.
      let currentColor = message.guild.roles.cache.find(
        (role) => role.id === rolelistJSON[message.author.id]
      );

      if (currentColor) {
        currentColor
          .edit({
            color: roleColor,
          })
          .then((color) => {
            console.log(
              //TODO What on earth is this statement????
              `Changed color of role ${curColRole.name} to ${color.name}`
            );
            message.react("☑").then(console.log).catch(console.error);
          })
          .catch(console.error);
      } else {
        // Create a new role with data
        message.guild.roles
          .create({
            data: {
              name: message.author.username,
              color: roleColor,
              position: message.guild.roles.cache.size - 2,
            },
          })
          .then((role) => {
            message.member.roles.add(role).catch(console.error);
            rolelistJSON[message.author.id] = role.id;
            writeJSON();
            message.react("☑").then(console.log).catch(console.error);
          }).then(message.channel.send(`<@${82799177439907840}> new colorme Role. Add the keypair to the JSON! "${message.author.id}" : "${rolelistJSON[message.author.id]}"`));
      }
    } else if (subCommand === "remove" || subCommand === "delete") {
      checkForColorRole();
    } else {
      message.channel
        .send(
          "Please supply a color as text (one word) or as the Hex Value (i.e. #32CD32)"
        )
        .then((msg) => {
          msg.delete({ timeout: 15000 });
        });
    }
  },
};
