const fs = require("fs");
//The JSON is formatted the following way: First the ID of the User as a key and then the roleID assigned to them as a value.
module.exports = {
  name: "getroles",
  description:
    "This command is used to populate the json role file for the updated colorme command!",
  permissions: "MANAGE_GUILD",
  hidden: false,

  execute(message, args) {
    var rolelistJSON = JSON.parse(
      fs.readFileSync("./ressources/roleList.json", "utf8")
    );
    message.guild.members.cache.each((user) => {
      let identicalrole = message.guild.roles.cache.find(
        (role) => role.name === user.user.username
      );
      if (identicalrole) {
        //DEBUG MESSAGE
        message.channel.send(
          identicalrole + "rolename and now user " + user.user.username
        );
        rolelistJSON[user.user.id] = identicalrole.id;
      }
    });
    var json = JSON.stringify(rolelistJSON, null, "\t");
    fs.writeFile("./ressources/roleList.json", json, "utf8", (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });
  },
};
