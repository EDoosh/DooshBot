module.exports.run = async (bot, message, args) => {
    // Combine anything from the second argument onwards
    for(i = 2 + 1; i < args.length; i++) {
        args[2] += ' ' + args[i];
    }
    console.log(`${message.author.username} (${message.author.id}) ran '${message.content}'`)
    switch(args[1]) { // Check what the first argument is. 
        case 'w':
        case 'watching': // If first argument is watching...
            bot.user.setActivity(args[2], { type: 'WATCHING' }); // Set activity to 'Watching ' and then the combined arguements from before
            message.channel.send('Set playing status to `Watching ' + args[2] + '`'); // Announce
            break; // Exit the case.
        case 'p':
        case 'playing':
            bot.user.setActivity(args[2]);
            message.channel.send('Set playing status to `Playing ' + args[2] + '`');
            break;
        case 'l':
        case 'listening':
            bot.user.setActivity(args[2], { type: 'LISTENING' });
            message.channel.send('Set playing status to `Listenting to ' + args[2] + '`');
            break;
        default: // If it matches none of the cases, shows syntax.
            message.channel.send('`' + prefix + 'playing [watching | listening | playing] [status]`'); 
            break;
    }
}

module.exports.config = {
    command: ["playing", "pl", "play"],
    permlvl: "Trusted",
    help: ["Trusted", "Set the playing status of the bot.",
            "Trusted", "[playing | watching | listening] [status]", "Set the status of the bot."]
}