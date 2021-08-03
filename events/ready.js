//bot logged in successfully and it's ready to be used
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.user.setPresence({
      activity: {
        name: "$help for more info!",
      },
    });
    console.log(
      `Ready to  server in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`
    );
  },
};
