const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    if(!useallcmds.includes(msgUserID)) return message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');
    if(args[1] === "key") return message.channel.send(`rmrole: rmrole guildid\nmodrole: modrole guildid\nadminrole: adminrole guildid\n` + 
                                                        `logChannel: logChannel guildid\nprefix: prefix guildid\n` + 
                                                        `Warns: warns warnedid guildid   .amount .reasons .time .warner .warnerusername\n` + 
                                                        `TellMe: tm tellme userid`)
    if(!args[2]) return message.channel.send(`${prefix}tmset (value) (db)`)
    for(i = 2 + 1; i < args.length; i++) {
    	args[2] += ' ' + args[i];
    }
    db.set(args[2], args[1])
    message.channel.send('Done!')
}

module.exports.config = {
    command: "tmset"
}