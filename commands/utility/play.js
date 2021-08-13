const Discord = require("discord.js");
function addTime(date, hours, minutes, seconds) {
  const newDate = new Date(date);
  newDate.setHours(
    newDate.getHours() + hours,
    newDate.getMinutes() + minutes,
    newDate.getSeconds() + seconds
  );
  return newDate;
}

module.exports = {
  name: "play",
  description: "Lets you retreat from the race before starting it.",
  usage: `$play <activity name> <hours> <minutes> <seconds>`,
  hidden: false,
  guildOnly: true,
  helpFields: null,
  execute(message, args) {
    //TODO Implement command
    if (
      args[0] == undefined ||
      args.length < 2 ||
      typeof args[1] === "number"
    ) {
      message.channel
        .send(
          `Not proper usage of the command. Please use ${message.client.prefix}help ${this.name} for more information on how to use the command.`
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
        })
        .catch(console.error);
      return;
    }

    if (isNaN(args[2])) args[2] = 0;
    if (isNaN(args[3])) args[3] = 0;
    let currentdate = new Date();
    let targetdate = addTime(
      currentdate,
      parseInt(args[1]),
      parseInt(args[2]),
      parseInt(args[3])
    );
    let timeout =
      (parseInt(args[1]) * 60 * 60 +
        parseInt(args[2]) * 60 +
        parseInt(args[3])) *
      1000;
    const dateoptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    console.log(timeout);
    let utc_offset = targetdate.getTimezoneOffset();
    let uct_targetdate = addTime(targetdate, 0, utc_offset, 0);
    //targetdate.setMinutes(targetdate.getMinutes() + utc_offset);
    let est_time = addTime(uct_targetdate, 0, -300, 0);
    //uct_targetdate.setMinutes(uct_targetdate.getMinutes() - 300);
    let et_time = addTime(uct_targetdate, 0, -240, 0);
    // uct_targetdate.setMinutes(uct_targetdate.getMinutes() - 240);
    let bst_time = addTime(uct_targetdate, 0, 60, 0);
    // uct_targetdate.setMinutes(uct_targetdate.getMinutes() + 60);
    let cet_time = addTime(uct_targetdate, 0, 120, 0);
    // uct_targetdate.setMinutes(uct_targetdate.getMinutes() + 120);
    //If the user did not specify any minutes or seconds, it will default those to 0 instead.
    const raidEmbed = new Discord.MessageEmbed()
      .setColor("#0087f5")
      .setAuthor(message.client.user.username, message.client.user.avatarURL())
      .setFooter(
        "Authors: Enhu/Shockwve/Matse007 | Rumbi v2.0.0",
        message.client.user.avatarURL()
      )
      .setTimestamp()
      .setTitle(args[0])
      .setDescription(
        `${message.author} wants to play ${args[0]} in ${args[1]} hour(s) ${args[2]} minute(s) and ${args[3]} second(s).\nPlease react with the corresponding emoji.`
      )
      .addField(
        "Planned time:",
        targetdate +
          "\n**EST:** " +
          est_time.toLocaleDateString("en-GB", dateoptions) +
          "\n**ET**: " +
          et_time.toLocaleDateString("en-GB", dateoptions) +
          "\n**BST:** " +
          bst_time.toLocaleDateString("en-GB", dateoptions) +
          "\n**CEST:** " +
          cet_time.toLocaleDateString("en-GB", dateoptions),
        false
      )
      .addFields(
        {
          name: "I have time 👍",
          value: "-",
          inline: true,
        },
        {
          name: "I don't have time 👎",
          value: "-",
          inline: true,
        },
        {
          name: "Maybe 🤷",
          value: "-",
          inline: true,
        }
      );

    message.channel.send({ embed: raidEmbed }).then((msg) => {
      msg.react("👍");
      msg.react("👎");
      msg.react("🤷");

      const yesFilter = (reaction, user) =>
        reaction.emoji.name === "👍";
      const noFilter = (reaction, user) =>
        reaction.emoji.name === "👎";
      const maybeFilter = (reaction, user) =>
        reaction.emoji.name === "🤷";

      const yes = msg.createReactionCollector(yesFilter, {
        time: timeout,
        dispose: true,
      });
      const no = msg.createReactionCollector(noFilter, {
        time: timeout,
        dispose: true,
      });
      const maybe = msg.createReactionCollector(maybeFilter, {
        time: timeout,
        dispose: true,
      });

      //Yes I have time reaction
      yes.on("collect", (reaction, user) => {
        if (user.id !== msg.author.id) {
          if(raidEmbed.fields[1].value.includes("-")) raidEmbed.fields[1].value = raidEmbed.fields[1].value.replace("-","");
          raidEmbed.fields[1].value = raidEmbed.fields[1].value + `\n${user}`;
          msg.edit({ embed: raidEmbed });
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      //No I have no time
      no.on("collect", (reaction, user) => {
        if (user.id !== msg.author.id) {
          if(raidEmbed.fields[2].value.includes("-")) raidEmbed.fields[2].value = raidEmbed.fields[2].value.replace("-","");
          raidEmbed.fields[2].value = raidEmbed.fields[2].value + `\n${user}`;
          msg.edit({ embed: raidEmbed });
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      //Maybe I have time
      maybe.on("collect", (reaction, user) => {
        if (user.id !== msg.author.id) {
          if(raidEmbed.fields[3].value.includes("-")) raidEmbed.fields[3].value = raidEmbed.fields[3].value.replace("-","");
          raidEmbed.fields[3].value = raidEmbed.fields[3].value + `\n${user}`;
          msg.edit({ embed: raidEmbed });
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      yes.on("remove", (reaction, user) => {
        if (
          user.id !== msg.author.id &&
          raidEmbed.fields[1].value.includes(user)
        ) {
          raidEmbed.fields[1].value = raidEmbed.fields[1].value.replace(
            user,
            ""
          );
          raidEmbed.fields[1].value = raidEmbed.fields[1].value.trim();
          if(!raidEmbed.fields[1].value) raidEmbed.fields[1].value = "-";
          msg.edit({ embed: raidEmbed });
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      //No I have no time
      no.on("remove", (reaction, user) => {
        if (
          user.id !== msg.author.id &&
          raidEmbed.fields[2].value.includes(user)
        ) {
          raidEmbed.fields[2].value = raidEmbed.fields[2].value.replace(
            user,
            ""
          );
          raidEmbed.fields[2].value = raidEmbed.fields[2].value.trim();
          if(!raidEmbed.fields[2].value) raidEmbed.fields[2].value = "-";
          msg.edit({ embed: raidEmbed });
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      //Maybe I have time
      maybe.on("remove", (reaction, user) => {
        if (
          user.id !== msg.author.id &&
          raidEmbed.fields[3].value.includes(user)
        ) {
          raidEmbed.fields[3].value = raidEmbed.fields[3].value.replace(
            user,
            ""
          );
          raidEmbed.fields[3].value = raidEmbed.fields[3].value.trim();
          if(!raidEmbed.fields[3].value) raidEmbed.fields[3].value = "-";
          msg.edit({ embed: raidEmbed });
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        }
      });
      /*
      Once Collection of Emojis ends, the following functions are being called
      */
      yes.on("end", (reaction, user) => {
        raidEmbed.description += "\n**Signups are closed! Time to play!**";
        msg.edit({ embed: raidEmbed });
        console.log(`Stopped looking for reactions`);
      });
    });
  },
};
