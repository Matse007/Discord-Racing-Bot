module.exports = {
  name: "getrole",
  description: "Use this command to get the 'racing' role.",
  execute(message, args) {
    //TODO Implement
    racingrole = message.guild.roles.cache.find((r) => r.name === "racing");
    if (message.member.roles.cache.find((role) => role.name === "racing")) {
      message.channel.send("Error: you already have the role.").then((msg) => {
        msg.delete({ timeout: 5000 });
      });
    } else {
      message.member.roles.add(racingrole).catch(console.error);
      message.channel.send("Success!").then((msg) => {
        msg.delete({ timeout: 5000 });
      });
    }
  },
};
