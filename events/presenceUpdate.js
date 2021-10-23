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
    var isStreaming = false;
    newPresence.activities.forEach((activity) => {
      if (activity.name === "Twitch" && activity.state === "A Hat in Time")
        isStreaming = true;
    });

    if(isStreaming){
      if(newPresence.member.roles.cache.has(streamrole.id)) return;
      console.log(new Date().toLocaleString());
      newPresence.member.roles.add(streamrole).catch(console.error);
      console.log(newPresence.member.user.tag + " assigned Stream Role");
    }

    if(!isStreaming && newPresence.member.roles.cache.has(streamrole.id)){
      console.log(new Date().toLocaleString());
      newPresence.member.roles.remove(streamrole).catch(console.error);
      console.log(newPresence.member.user.tag + " removed Stream Role");
    }  
  },
};