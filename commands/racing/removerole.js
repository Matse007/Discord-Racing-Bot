module.exports = {
  name: "removerole",
  description: "Use this command to remove the 'racing' role from your roles.",
  hidden: false,
  guildOnly: false,
  execute(message, args) {
    //We are saving the racing role for later use, then determine if the user has a role called racing.
    //If that is the case, the role will be removed and the message will be deleted shortly after.
    //If not the user will be informed about him not having the racing role.
    racingrole = message.guild.roles.cache.find((r) => r.name === "racing");
    if (message.member.roles.cache.find((role) => role.name === "racing")) {
      message.member.roles.remove(racingrole).catch(console.error);
      message.channel
        .send("Succesfully removed the racing role.")
        .then((msg) => {
          msg.delete({ timeout: 5000 });
        });
    } else {
      message.channel
        .send("Something went wrong. You don't have the racing role.")
        .then((msg) => {
          msg.delete({ timeout: 5000 });
        });
    }
  },
};
