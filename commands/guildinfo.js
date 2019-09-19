const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(!args[1]){
        guildid = message.guild.id
    } else {
        guildid = args[1]
    }
    guildcol = bot.guilds.find(guild => guild.id === guildid)
    message.channel.send(`There are ${guildcol.memberCount} members with ${guildcol.channels.size} channels in ${guildcol.name}.`)
}

module.exports.config = {
    command: "guildinfo"
}