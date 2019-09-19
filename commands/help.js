const Discord = require('discord.js');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    let dmto = bot.users.get(msgUserID) // Set the bot to DM to the command issuer
    if(args[1] === 'c') dmto = message.channel // If the first argument is c, set it to send in the channel instead
    // The following is essentially 'Make an embed, add to the embed'
    let helpabout = new Discord.RichEmbed()
        .setTitle('About the bot.')
        .addField(`${prefix}help`, 'DM to the user this help screen.')
        .addField(`${prefix}info`, 'Display bot information.')
        .setColor(0xeee655)
        .setFooter(`${NAME}'s Command Help - Version ${VERSION}`);
    let helpfun = new Discord.RichEmbed()
        .setTitle('Fun!')
        .addField(`${prefix}tellme (@user) [thing]`, 'Tell the user their score about a thing on a scale of 0 to 10!')
        .addField(`${prefix}avatar (@user)`, 'Get the avatar + link of yourself or another person.')
        .addField(`${prefix}reddit [subreddit]`, 'Get the best posts of the week from reddit and post them in the chat!')
        .setColor(0x58ee55)
        .setFooter(`${NAME}'s Command Help - Version ${VERSION}`);
    let helpmod = new Discord.RichEmbed()
        .setTitle('Moderation.')
        .addField(`${prefix}embed [flags]`, `Creates a rich embed. Run '${prefix}embed' for flag help.`)
        .addField(`${prefix}clear [msg count] (reason)`, 'Clears [msg count] number of messages from the channel.')
        .addField(`${prefix}warn [@user | userID] (warns to issue) (reason)`, 'Warn the user (warns to issue) times for (reason).')
        .addField(`${prefix}warnings [@user | userID] list`, 'List all the warnings of the user.')
        .addField(`${prefix}warnings [@user | userID] count`, 'Display the number of warns a user has.')
        .setColor(0xee55e1)
        .setFooter(`${NAME}'s Command Help - Version ${VERSION}`);
    let helpadmin = new Discord.RichEmbed()
        .setTitle('Administration.')
        .addField(`${prefix}modify [mod-role | admin-role | role-modify]`, 'Displays the roles with that permission.')
        .addField(`${prefix}modify [mod-role | admin-role | role-modify] [role name]`, 'Adds permissions to it if it doesn\'t have them, otherwise removes them from it.')
        .addField(`${prefix}modify log-channel`, 'Displays current log channel.')
        .addField(`${prefix}modify log-channel [channel name]`, 'Changes log channel to that location.')
        .addField(`${prefix}modify log-channel off`, 'Turns off logging to a log channel.')
        .addField(`${prefix}prefix [new prefix]`, 'Changes the prefix for the server.')
        .addField(`${prefix}warnings [@user | userID] clear`, 'Delete all the warnings of a user.')
        .addField(`${prefix}warnings [@user | userID] deleteid [ID] (reason)`, 'Delete a warn off a user based off the warn ID.')
        .addField(`${prefix}plvl [kick | ban] [warn amount]`, 'Kick / Ban the user at that amount of warns.')
        .addField(`${prefix}plvl notify [warn amount]`, 'Send a message in the log channel that a user has reached that amount of warns.')
        .setColor(0xee5555)
        .setFooter(`${NAME}'s Command Help - Version ${VERSION}`);
    let helpother = new Discord.RichEmbed()
        .setTitle('Other.')
        .addField(`${prefix}ping`, 'Pong!')
        .addField(`getdbprefix`, 'Get the prefix of the server.')
        .addField(`${prefix}guildinfo`, 'Get information about the server.')
        .setColor(0x55eeee)
        .setFooter(`${NAME}'s Command Help - Version ${VERSION}`);
    let helpcmds = new Discord.RichEmbed()
        .setTitle('Trusted Users.')
        .setDescription('As you are trusted, I also trust you to realise I am logging any of the following commands you use.')
        .addField(`${prefix}say (Channel ID) [Message to send]`, 'Get the bot to say something in a channel, even on another server!')
        .addField(`${prefix}tmset [value] [database]`, 'Change the value of something in the database. DO NOT CHANGE ANYTHING IN THE USEALLCMDS DATABASE OR ELSE YOU WILL BE BANNED FROM IT.')
        .addField(`${prefix}playing [playing | listening | watching] [text]`, 'Set the playing status of the bot.')
        .setColor(0x000000)
        .setFooter(`${NAME}'s Command Help - Version ${VERSION}`);

    dmto.send(helpabout).then(() => { // It will attempt to send to the user/channel
        dmto.send(helpfun); // If successful, send the rest
        if(hasMod || hasAdmin || useallcmds.includes(msgUserID)) dmto.send(helpmod); // Check if they have admin or mod
        if(hasAdmin || useallcmds.includes(msgUserID)) dmto.send(helpadmin); // Check if they have admin
        if(useallcmds.includes(msgUserID)) dmto.send(helpcmds); // Check if they have useallcmds
        dmto.send(helpother);
        // If they haven't got admin say commands were ommitted.
        if(!hasAdmin && !useallcmds.includes(msgUserID)) dmto.send(`Some commands have been ommitted, as you do not have access to the commands in the server you used '${prefix}help' in.`)
    }).catch(() => { // If sending the message wasnt successful, announce.
        message.channel.send('An error has occured. Maybe your DM\'s are disabled?' + `\nTry '${prefix}help c' to send it to this channel.`)
    })
}

module.exports.config = {
    command: "help"
}