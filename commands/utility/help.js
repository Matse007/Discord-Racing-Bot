const Discord = require("discord.js");

const prefix = process.env.PREFIX;

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  //aliases: ["commands"],
  usage: "$help [command name]",
  cooldown: 5,
  helpFields: [],
  hidden: false,
  execute(message, args) {
    /* Create a template embed to build all future embeds with. Perhaps not needed.
     */
    const embedTemplate = new Discord.MessageEmbed()
      .setColor("#0087f5")
      .setAuthor(message.client.user.username, message.client.user.avatarURL())
      .setFooter(
        "Authors: Enhu/Shockwve/Matse007 | Rumbi v2.0.0",
        message.client.user.avatarURL()
      )
      .setTimestamp();
    data = [];
    const { commands } = message.client;
    if (!args.length) {
      data.push("Here's a list of all my commands:");
      embedTemplate
        .setTitle("List of commands")
        .setDescription("Here's a list of all my commands:");
      data.push(
        commands
          .map((command) => {
            if (!command.hidden) {
              embedTemplate.addField(
                prefix + command.name,
                command.description
              );
              return command.name;
            }
          })
          .join(", ")
      );
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      return message.author
        .send({ embed: embedTemplate })
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch((error) => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "it seems like I can't DM you! Do you have DMs disabled?"
          );
        });
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command || command.hidden) {
      return message.reply("that's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);
    embedTemplate.setTitle(command.name + " Help");

    if (command.description) {
      data.push(`**Description:** ${command.description}`);
      embedTemplate.addField(prefix + command.name, command.description);
    }
    if (command.usage) {
      //data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
      embedTemplate.addField("Usage of the command:", command.usage);
    }
    if (command.helpFields)
      command.helpFields.forEach((helpfield) => {
        embedTemplate.addField(helpfield.name, helpfield.value);
      });

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
    embedTemplate.addField(`Cooldown:`, `${command.cooldown || 3} second(s)`);
    if (command.aliases)
      embedTemplate.addField(`**Aliases:**`, `${command.aliases.join(", ")}`);
    // data.push(`**Aliases:** ${command.aliases.join(", ")}`);

    //embedTemplate.addField()
    //message.channel.send(data, { split: true });
    message.channel.send({ embed: embedTemplate });
  },
};
