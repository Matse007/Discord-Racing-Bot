let memes;
var fs = require("fs");
module.exports = {
  execute(message) {
    memes = JSON.parse(fs.readFileSync("./ressources/memes.json", "utf8"));
    for (key in memes) {
      if (message.content.toLowerCase().includes(key.toLowerCase())) {
        message.channel.send(memes[key.toLowerCase()]);
        return;
      }
    }
  },
};
