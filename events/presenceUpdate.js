var fs = require("fs");
let cfg = JSON.parse(fs.readFileSync("./ressources/cfg.json", "utf8"));
module.exports = {
  name: "presenceUpdate",
  execute(oldPresence, newPresence, client) {
    const guildid = cfg.streamingguilds.booptroop;
    guild = client.guilds.cache.get(guildid);
    //this requires that a streaming role does exist.
    streamrole = guild.roles.cache.find((r) => r.name === "Streaming"); 
    if (!newPresence.activities) return false;
    let lenghtvar = newPresence.activities.length;
    newPresence.activities.forEach((activity) => {
      if (activity.name === "Twitch" && activity.state === "A Hat in Time") {
        console.log(new Date().toLocaleString());
        newPresence.member.roles.add(streamrole).catch(console.error);
        console.log(newPresence.member.user.tag + " assigned Stream Role");
        return;
      } else {
        if(newPresence.member.roles.cache.has(streamrole.id)) {   
        newPresence.member.roles.remove(streamrole).catch(console.error);
        }
      }
    });
    if (newPresence.activities.length == 0 && newPresence.member.roles.cache.has(streamrole.id)) {
        newPresence.member.roles.remove(streamrole).catch(console.error);
        
    }
  },
};