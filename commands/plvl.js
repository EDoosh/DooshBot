const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
    if(!args[2]) return message.channel.send('`Error - Unspecified config to edit!`\nCommand usage: `' + prefix + 'plvl [kick | ban | notify] [warn count]`');
    switch(args[1]){
        case 'kick':
            db.set(`plvl_kick_${message.guild.id}`, args[2]);
            message.channel.send(`Kick level set to \`${args[2]}\` warns.`);
            break;

        case 'ban':
            db.set(`plvl_ban_${message.guild.id}`, args[2]);
            message.channel.send(`Ban level set to \`${args[2]}\` warns.`);
            break;

        case 'notify':
            db.set(`plvl_warn_${message.guild.id}`, args[2]);
            message.channel.send(`Notify level set to \`${args[2]}\` warns.`);
            break;
    }
}

module.exports.config = {
    command: "plvl"
}