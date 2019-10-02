const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let dmto = bot.users.get(msgUserID) // Set the bot to DM to the command issuer
    if(args[1] === 'c') dmto = message.channel // If the first argument is c, set it to send in the channel instead
    // Create embed, print embed. Simple, really.
    var infoembed = new Discord.RichEmbed()
        .setTitle(`About ${NAME}`)
        .addField('Developer', `EDoosh#9599`, true)
        .addField('Current version', `${VERSION}`, true)
        .addField('Invite link', `Currently disabled.\nIf you would like to get the bot on your server, contact EDoosh#9599`, true)
        .addField('Profile Picture', `Made by Bluee! You should check her out!`, true)
        .setThumbnail(bot.user.avatarURL)
        .setColor(0x55eeee);
    dmto.send(infoembed);
}

module.exports.config = {
    command: ["info", "i"],
    permlvl: "All",
    help: ["Bot", "Get information about the discord bot.",
            "All", "", "Get information about the discord bot DM'd to you.",
            "All", "c", "Get information about the discord bot sent to the current channel."]
}