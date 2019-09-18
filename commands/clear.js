const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(hasMod || hasAdmin || useallcmds.includes(msgUserID)) {
        if(!args[1]) {
            message.channel.send('`Error - Unspecified number of messages to delete!`\nCommand usage: `' + prefix + 'clear [message count] (reason)`');
        }else if(args[1] > 100) {
            message.channel.send('`Error - Too many messages! Maximum of 100`\nCommand usage: `' + prefix + 'clear [message count] (reason)`');
        }else{
            if(message.member.guild.me.hasPermission("MANAGE_MESSAGES")) {
                message.channel.bulkDelete(args[1]);
                message.channel.send('Successfully deleted ' + args[1] + ' messages!');
                if(args[2]) {
                    for(i = 2 + 1; i < args.length; i++) {
                        args[2] += ' ' + args[i];
                    }
                    reason = args[2]
                } else {
                    reason = 'None given.'
                }
                var clearembed = new Discord.RichEmbed()
                    .setTitle(':wastebasket: Bulk Delete')
                    .addField(msgUsername + ' has bulk deleted ' + args[1] + ' messages.', 
                    'Reason given: ' + reason)
                    .setColor(0xED3984)
                    .setFooter(dateTime);
                if(logChannel != null) logChannel.send(clearembed);
            } else {
                message.channel.send('Could not delete message as the bot has a lack of permissions.\n\`Required permission: Manage Messages\`');
                if(logChannel != null) logChannel.send(`Attempted to delete ${args[1]} messages, failed due to the bot having a lack of permissions.\n\`Required permission: Manage Messages\``)
            }
        }
    }else{
        message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
    }
}

module.exports.config = {
    command: "clear"
}