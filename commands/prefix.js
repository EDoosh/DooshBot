const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!args[1]) { // If there isn't a second argument, show current prefix.
        message.channel.send('Server prefix is set to `' + prefix + '`')
    } else if(args[1].includes('prefix') || args[1].includes('\\') || args[2]) { // If the prefix includes the word 'prefix' or '\' show error
        message.channel.send("Please don't use 'prefix', a space, or a backslash in a prefix. It confuses the bot.")
    } else { // Otherwise...
        db.set(`prefix_${message.guild.id}`, args[1]) // Set prefix to prefix argument in database
        message.channel.send('Successfully set prefix to `' + args[1] + '`'); // Announce

    }
}

module.exports.config = {
    command: ["prefix", "pref", "pre", "px"],
    permlvl: "Admin",
    help: ["Admin", "Set the current prefix.",
            "Admin", "", "Sends the DooshBot prefix.",
            "Admin", "[new-prefix]", "Set a new DooshBot server prefix"]
}