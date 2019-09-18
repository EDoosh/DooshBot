const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    if(!args[1]) {
        message.channel.send('Server prefix is set to `' + prefix + '`')
    } else if(args[1].includes('prefix')) {
        message.channel.send("Please don't use 'prefix' or a backslash in a prefix. It confuses the bot.")
    } else {
        if(hasAdmin || msgUsername == serverOwner || useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
        else {
            db.set(`prefix_${message.guild.id}`, args[1])
            message.channel.send('Successfully set prefix to `' + args[1] + '`');
        }
    }
}

module.exports.config = {
    command: "prefix"
}