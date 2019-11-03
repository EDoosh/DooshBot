const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send(`Could not unban user ${mentionsun} as the bot has a lack of permissions, or they are not banned.\n\`Required permission: Ban User\``);

    let usercollection = await bot.fetchUser(args[1])
    // If couldnt find them by username or ID, return error.
    if(!usercollection) return errormsg.run(bot, message, args, 1, "No banned user with that ID")
    mentionsid = usercollection.id
    mentionsun = usercollection.username
    
    let reason = 'None given.'
    for(i = 2 + 1; i < args.length; i++) {
        args[2] += ' ' + args[i];
    }
    if(args[2]) reason = args[2]

    message.guild.unban(usercollection, `User unbanned by ${message.author.username} (${message.author.id}) for reason '${reason}'`)
    message.channel.send(`${mentionsun} (${mentionsid}) was unbanned for ${reason}.`);
    let unbanembed = new Discord.RichEmbed()
        .setTitle(`:ballot_box_with_check: Unbanned user ${mentionsun} (${mentionsid})`)
        .addField(`Reason: ${reason}`, `Unbanned by ${message.author.username} (${message.author.id})`)
        .setFooter(`Use '${prefix}warnings ${mentionsid} list' to view warn history`)
        .setTimestamp(Date.now())
        .setColor(0xffffff);
    if(logChannel != 0) logChannel.send(unbanembed);
}

module.exports.config = {
    command: ["unban", "ub"],
    permlvl: "Admin",
    help: ["Admin", "Unban a user.",
            "Admin", "[userID] (reason)", "Unban a user. If a reason is provided, it is used in the Log Channel."]
}