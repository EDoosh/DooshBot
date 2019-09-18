const Discord = require('discord.js');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    var infoembed = new Discord.RichEmbed()
        .setTitle(NAME)
        .addField('About the bot:',
        'Developer  |   EDoosh#9599\n' +
        'Current ' + NAME + ' version  |   ' + VERSION + '\n' +
        'Invite link  |   Currently disabled due to bot being in alpha.\n' + 
        'Profile Picture made by Bluee! Thank you!')
        .setColor(0x55eeee);
    message.channel.send(infoembed);
}

module.exports.config = {
    command: "info"
}