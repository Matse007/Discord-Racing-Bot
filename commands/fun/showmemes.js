let memes;
var fs = require("fs");
//TODO: Make an embedd with all memes?
module.exports = {
  name: "showmeme",
  description: "this is a meme command!",
  guildOnly: true,
  hidden: true,
  execute(message, args) {
    // memes = JSON.parse(fs.readFileSync("./ressources/memes.json", "utf8"));
    /* if (
      message.member.roles.cache.find((role) => (role.name = "Admins")) ||
      message.author.id == "72182588885700608" || message.author.id == "82799177439907840"
    ) 
      memes = JSON.parse(fs.readFileSync("./ressources/memes.json", "utf8"));
      let newMeme = args.join(" ").split("|");
      message.channel.send(
        "Adding new meme: " + newMeme[0].toLowerCase() + " -> " + newMeme[1]
      );
      memes[newMeme[0].toLowerCase()] = newMeme[1];
      fs.writeFile(
        "./ressources/memes.json",
        JSON.stringify(memes, null, "\t"),
        "utf8",
        (err) => {
          if (err) {
            console.log("Error writing file", err);
          } else {
            console.log("Successfully wrote file");
          }
        }
      );
     */
  },
};
