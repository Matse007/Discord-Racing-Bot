const Discord = require("discord.js");
module.exports = {
  name: "guildMemberAdd",
  execute(member, client) {
    let tempuser = member.user;
    let timestamp = tempuser.createdTimestamp;
    let timestampstring = `<t:${timestamp}:R>`;
    const logEmbed = new Discord.MessageEmbed()
      .setColor("#0087f5")
      .setAuthor(member.user.username, member.user.avatarURL())
      .setFooter(
        `${member.id} | Rumbi v2.0.0`,
        member.user.avatarURL()
      )
      .setTimestamp()
      .setTitle("Member joined")
      .setDescription(
        `${member.user} joined \n Account created: ` + (timestamp < 60 * 60 * 24 * 14 ? `⚠ **NEW ACCOUNT** <t:${Math.round(timestamp / 1000)}:R> ⚠` : `<t:${Math.round(timestamp / 1000)}:R>`));
    //send log message into log channel
    tempchannel = client.channels.cache.get("957593853634953226");
    tempchannel.send({
        embed: logEmbed
      }).then(message => console.log(`Sent message: ${message.content}`))
      .catch(console.error);;
  },
};