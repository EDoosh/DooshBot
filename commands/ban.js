const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send(`Could not ban user ${mentionsun} as the bot has a lack of permissions.\n\`Required permission: Ban User\``);

    let mentions = message.mentions.members.first(); // Get the mentioned person
    let usercollection; // Its a surprise tool that will help us later!
    if(mentions) usercollection = bot.users.find(user => user.id == mentions.id) // If there is a mentioned person, set usercollection to be the retrieved user collection
    else if(bot.users.find(user => user.id === args[1])) usercollection = bot.users.find(user => user.id == args[1]) // Otherwise check if a userID was said, set usercollection to be the retrieved user collection
    else if(bot.users.find(user => user.username === args[1])) usercollection = bot.users.find(user => user.username === args[1]) // Otherwise check if a raw username was said, set... you get the point
    else return errormsg.run(bot, message, args, 1, "Invalid user to ban")
    mentionsid = usercollection.id
    mentionsun = usercollection.username
    
    let argstart = 2
    if(args[2] === 's') argstart = 3
    
    let reason = 'None given.' // Combine reasons
    for(i = argstart + 1; i < args.length; i++) {
        args[argstart] += ' ' + args[i];
    }
    if(args[argstart]) reason = args[argstart]

    let banorsoft = 'Banned'
    if(argstart === 2) {
        usercollection.send(`You were banned from ${message.guild.name} for reason '${reason}'`).then(() => {
            banUser()
        }).catch(() => banUser())
    } else {
        banUser()
        banorsoft = 'Soft-banned'
    }

    function banUser() {
        message.guild.ban(usercollection, `User ${banorsoft} by ${message.author.username} (${message.author.id}) for reason '${reason}'`).then(() => {
            message.channel.send(`${mentionsun} (${mentionsid}) was ${banorsoft} for ${reason}`);
            let banembed = new Discord.RichEmbed()
                .setTitle(`:hammer: ${banorsoft} user ${mentionsun} (${mentionsid})`)
                .addField(`Reason: ${reason}`, `${banorsoft} by ${message.author.username} (${message.author.id})\n` + `Use '${prefix}unban ${mentionsid} (reason)' to unban them.`)
                .setFooter(`Use '${prefix}warnings ${mentionsid} list' to view warn history`)
                .setTimestamp(Date.now())
                .setColor(0x000000);
            if(logChannel != 0) logChannel.send(banembed);
        }).catch(() => {
            message.channel.send(`An error occured while trying to ban member ${mentionsun} (${mentionsid})`)
            if(logChannel != 0) message.channel.send(`An error occured while trying to ban member ${mentionsun} (${mentionsid})`)
        })
    }
}

module.exports.config = {
    command: ["ban", "b"],
    permlvl: "Admin",
    help: ["Admin", "Ban a user for a specified reason.",
            "Admin", "[mention | userID | username] (reason)", "Ban a user and tell them. If a reason is specified, the user is told and that reason is used in the logchannel.",
            "Admin", "[mention | userID | username] s (reason)", "Softbans a user. Same as above but they aren't notified."]
}