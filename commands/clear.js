const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!args[1]) { // If there isnt an amount of messages to delete
        errormsg.run(bot, message, args, 1, "Unspecified number of messages to delete") // Throw error
    }else if(args[1] > 99 || args[1] <= 0) { // If its outside the allowed message count
        errormsg.run(bot, message, args, 1, "Too many messages! Maximum of 99") // Throw error
    }else{ // If the command is okay
        if(message.member.guild.me.hasPermission("MANAGE_MESSAGES")) { // Check if it can actually delete messages
            message.channel.bulkDelete((parseInt(args[1]) + 1)); // Delete them!
            let delmsg = await message.channel.send('Successfully deleted ' + args[1] + ' messages!'); // Announce
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
            setTimeout(() => {delmsg.delete().catch(() => {console.log(`IGNORE: CLEAR: A 'messages deleted' message was sent and then deleted.`)})}, 5000);
        } else { // If there are no permissions, announce
            message.channel.send('Could not delete message as the bot has a lack of permissions.\n\`Required permission: Manage Messages\`');
            if(logChannel != 0) logChannel.send(`Attempted to delete ${args[1]} messages, failed due to the bot having a lack of permissions.\n\`Required permission: Manage Messages\``)
        }
    }
}

module.exports.config = {
    command: ["clear", "clr"],
    permlvl: "Mod",
    help: ["Mod", "Clear a certain number of messages.",
            "Mod", "[1-99] (reason)", "Clear that number of messages and, if specified, provides a reason for Log Channel."]
}