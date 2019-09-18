module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    // Combine anything from the second argument onwards
    for(i = 2 + 1; i < args.length; i++) {
        args[2] += ' ' + args[i];
    }
    if(useallcmds.includes(msgUserID)) {
        switch(args[1]) {
            case 'watching':
                bot.user.setActivity(args[2], { type: 'WATCHING' });
                message.channel.send('Set playing status to `Watching ' + args[2] + '`');
                break;
            case 'playing':
                bot.user.setActivity(args[2]);
                message.channel.send('Set playing status to `Playing ' + args[2] + '`');
                break;
            case 'listening':
                bot.user.setActivity(args[2], { type: 'LISTENING' });
                message.channel.send('Set playing status to `Listenting to ' + args[2] + '`');
                break;
            default:
                message.channel.send('`' + prefix + 'playing [watching | listening | playing] [status]`');
                break;
        }
    } else {
        message.channel.send('Error - Requires EDoosh or other completely approved members to run this command! Wait, how did you find out about it..?');
    }
}

module.exports.config = {
    command: "playing"
}