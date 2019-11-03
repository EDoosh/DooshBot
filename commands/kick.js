const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
   if(!message.guild.me.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) return message.channel.send('Could not kick user as the bot has a lack of permissions.\n\`Required permission: Kick User\`');

    let mentions = message.mentions.members.first(); // Get the mentioned person
    let usercollection; // Its a surprise tool that will help us later!
    if(mentions) usercollection = bot.users.find(user => user.id == mentions.id) // If there is a mentioned person, set usercollection to be the retrieved user collection
    else if(bot.users.find(user => user.id === args[1])) usercollection = bot.users.find(user => user.id == args[1]) // Otherwise check if a userID was said, set usercollection to be the retrieved user collection
    else if(bot.users.find(user => user.username === args[1])) usercollection = bot.users.find(user => user.username === args[1]) // Otherwise check if a raw username was said, set... you get the point
    else return errormsg.run(bot, message, args, 1, "Invalid user to kick") // If none of the above, give an error
    mentionsid = usercollection.id
    mentionsun = usercollection.username

    let argstart = 2
    if(args[2] === 's') argstart = 3
    
    let reason = 'None given.' // Combine reasons
    for(i = argstart + 1; i < args.length; i++) {
        args[argstart] += ' ' + args[i];
    }
    if(args[argstart]) reason = args[argstart]

    let kickeduser = message.guild.members.find(member => member.id === mentionsid) // Kicked user needs to be as a guildmember and not a user I think.
    let kickorsoft = 'Kicked'
    if(argstart === 2) {
        kickeduser.send(`You were kicked from ${message.guild.name} for reason '${reason}'`).then(() => {
            kickUser()
        }).catch(() => kickUser())
    } else {
        kickUser()
        kickorsoft = 'Soft-kicked'
    }

    function kickUser() {
        kickeduser.kick().then(() => {
            message.channel.send(`${mentionsun} (${mentionsid}) was ${kickorsoft} for reason '${reason}'`);
            let kickembed = new Discord.RichEmbed()
                .setTitle(`:boot: ${kickorsoft} user ${mentionsun} (${mentionsid})`)
                .addField(`Reason: ${reason}`, `${kickorsoft} by ${message.author.username} (${message.author.id})`)
                .setFooter(`Use '${prefix}warnings ${mentionsid} list' to view warn history`)
                .setTimestamp(Date.now())
                .setColor(0x9055ee);
            if(logChannel != 0) logChannel.send(kickembed);
        }).catch(() => {
            message.channel.send(`An error occured while trying to kick member ${mentionsun} (${mentionsid})`)
            if(logChannel != 0) message.channel.send(`An error occured while trying to kick member ${mentionsun} (${mentionsid})`)
        })
    }
    
}

module.exports.config = {
    command: ["kick", "k"],
    permlvl: "Mod",
    help: ["Mod", "Kick a user for a specified reason.",
            "Mod", "[userRepresentable] (reason)", "Kick a user and DM them the reason if provided. Reason is also used in Log Channel.",
            "Mod", "[userRepresentable] s (reason)", "Soft-Kick a user and uses the reason provided in Log Channel."]
}