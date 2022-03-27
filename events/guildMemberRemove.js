const Discord = require("discord.js");
module.exports = {
    name: "guildMemberRemove",
    execute(member, client) {
      let tempuser = member.user;
      let timestamp = tempuser.createdTimestamp;
    const logEmbed = new Discord.MessageEmbed()
      .setColor("#0087f5")
      .setAuthor(member.user.username, member.user.avatarURL())
      .setFooter(
        `ID: ${member.id} | Rumbi v2.0.0`,
        member.user.avatarURL()
      )
      .setTimestamp()
      .setTitle("Member left")
      .setDescription(
        `${member.user} left \n Account created: <t:${Math.round(timestamp / 1000)}:R>`
      )
      .addField('Roles:', member.roles.cache.map(r => `${r}`).join('\n'), true)
      //send log message into log channel
      tempchannel = client.channels.cache.get("957593853634953226")
      tempchannel.send( {embed: logEmbed} ).then(message => console.log(`Sent message: ${message.content}`))
      .catch(console.error);;
    },
  };
  