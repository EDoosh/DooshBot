const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(hasMod || hasAdmin || useallcmds.includes(msgUserID)) { // Make sure they have Mod or above
        if(!args[1]) { // If there isnt an amount of messages to delete
            message.channel.send('`Error - Unspecified number of messages to delete!`\nCommand usage: `' + prefix + 'clear [message count] (reason)`'); // Throw error
        }else if(args[1] > 100 || args[1] <= 0) { // If its outside the allowed message count
            message.channel.send('`Error - Too many messages! Maximum of 100`\nCommand usage: `' + prefix + 'clear [message count] (reason)`'); // Throw error
        }else{ // If the command is okay
            if(message.member.guild.me.hasPermission("MANAGE_MESSAGES")) { // Check if it can actually delete messages
                message.channel.bulkDelete(args[1]); // Delete them!
                message.channel.send('Successfully deleted ' + args[1] + ' messages!'); // Announce
                if(args[2]) { // Check if there was a reason
                    for(i = 2 + 1; i < args.length; i++) { // Combine everything after arg 2 into arg 2
                        args[2] += ' ' + args[i];
                    }
                    reason = args[2] // Set reason to arg 2
                } else { // If no reason
                    reason = 'None given.' // Set reason to None Given
                }
                var clearembed = new Discord.RichEmbed() // Create embed with the below things.
                    .setTitle(':wastebasket: Bulk Delete')
                    .addField(msgUsername + ' has bulk deleted ' + args[1] + ' messages.', 
                    'Reason given: ' + reason)
                    .setColor(0xED3984)
                    .setFooter(dateTime);
                if(logChannel != 0) logChannel.send(clearembed); // If there is a logchannel, send the embed into there
            } else { // If there are no permissions, announce
                message.channel.send('Could not delete message as the bot has a lack of permissions.\n\`Required permission: Manage Messages\`');
                if(logChannel != 0) logChannel.send(`Attempted to delete ${args[1]} messages, failed due to the bot having a lack of permissions.\n\`Required permission: Manage Messages\``)
            }
        }
    }else{ // Throw error if no perms
        message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
    }
}

module.exports.config = {
    command: "clear"
}