const Discord = require("discord.js");
module.exports = {
  name: "test",
  description: "this is a ping command!",
  hidden: true,
  execute(message, args) {
    let datetest = new Date();
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Some title")
      .setURL("https://discord.js.org/")
      .setAuthor(
        "Some name",
        "https://i.imgur.com/wSTFkRM.png",
        "https://discord.js.org"
      )
      .setDescription("Some description here")
      .setThumbnail("https://i.imgur.com/wSTFkRM.png")

      .addField("Inline field title", "Some value here", true)
      .setImage("https://i.imgur.com/wSTFkRM.png")
      .setTimestamp()
      .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");

    exampleEmbed.addFields(
      { name: "Regular field title", datetest },
      { name: "\u200B", value: "\u200B" },
      { name: "Inline field title", value: "Some value here" },
      { name: "Inline field title", value: "Some value here" }
    );
    let d = new Date();
    message.channel.send(d + " " + args.length);
    message.channel.send(exampleEmbed).then((msg) => {
      msg.delete({ timeout: 5000 });
    });
  },
};
