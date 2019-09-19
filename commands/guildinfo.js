const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(!args[1]){ // If there is not a guild id, use the current
        guildid = message.guild.id
    } else { // If there is a guild ID, use that
        guildid = args[1]
    }
    guildcol = bot.guilds.find(guild => guild.id === guildid) // Set guildcollection to the collection gotten from the guilds ID
    if(guildcol === null) return message.channel.send('An error has occured. Are you sure you entered a correct ID?');
    message.channel.send(`There are ${guildcol.memberCount} members with ${guildcol.channels.size} channels in ${guildcol.name}.`) // Say info about the server
}

module.exports.config = {
    command: "guildinfo"
}