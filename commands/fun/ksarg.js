var fs = require("fs");
const cfg = JSON.parse(fs.readFileSync("./ressources/config.json", "utf8"));
module.exports = {
  name: "ksarg",
  description: "For talking in the main channel of the server",
  hidden: true,
  guildOnly: true,
  execute(message, args) {
    //TODO: Implement this command that allowing access can be granted dynamically. Probably through a JSON in the ressource folder.
    if (
      message.author.id == "78321950904033280" ||
      message.author.id == "72182588885700608" ||
      message.author.id == "82799177439907840"
    ) {
      client.channels.get("484800903539458079").send(args.join(" "));
    }
    //Debug version of the command for my (Matse007's) testing server.
    // if(message.author.id == "78321950904033280" || message.author.id == "72182588885700608" || message.author.id == "82799177439907840"){
    // message.client.channels.cache.get("722374549794193421").send(args.join(' '));
    // }
  },
};
