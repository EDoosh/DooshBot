module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    // Combine anything from the second argument onwards
    for(i = 2 + 1; i < args.length; i++) {
        args[2] += ' ' + args[i];
    }
    if(useallcmds.includes(msgUserID)) { // If it is an approved user...
        switch(args[1]) { // Check what the first argument is. 
            case 'watching': // If first argument is watching...
                bot.user.setActivity(args[2], { type: 'WATCHING' }); // Set activity to 'Watching ' and then the combined arguements from before
                message.channel.send('Set playing status to `Watching ' + args[2] + '`'); // Announce
                break; // Exit the case.
            case 'playing':
                bot.user.setActivity(args[2]);
                message.channel.send('Set playing status to `Playing ' + args[2] + '`');
                break;
            case 'listening':
                bot.user.setActivity(args[2], { type: 'LISTENING' });
                message.channel.send('Set playing status to `Listenting to ' + args[2] + '`');
                break;
            default: // If it matches none of the cases, shows syntax.
                message.channel.send('`' + prefix + 'playing [watching | listening | playing] [status]`'); 
                break;
        }
    } else { // If it isn't an approved user running the command, show error.
        message.channel.send('Error - Requires EDoosh or other completely approved members to run this command! Wait, how did you find out about it..?');
    }
}

module.exports.config = {
    command: "playing"
}