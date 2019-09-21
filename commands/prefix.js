const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, usedcmd) => {
    if(!args[1]) { // If there isn't a second argument, show current prefix.
        message.channel.send('Server prefix is set to `' + prefix + '`')
    } else if(args[1].includes('prefix') || args[1].includes('\\')) { // If the prefix includes the word 'prefix' or '\' show error
        message.channel.send("Please don't use 'prefix' or a backslash in a prefix. It confuses the bot.")
    } else { // Otherwise...
        // Check if they have admin.
        if(!hasAdmin && !msgUsername == serverOwner && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
        db.set(`prefix_${message.guild.id}`, args[1]) // Set prefix to prefix argument in database
        message.channel.send('Successfully set prefix to `' + args[1] + '`'); // Announce

    }
}

module.exports.config = {
    command: "prefix"
}