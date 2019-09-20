const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    // Check if they have admin or higher permissions
    if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
    if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send(`Could not unban user ${mentionsun} as the bot has a lack of permissions, or they are not banned.\n\`Required permission: Ban User\``);

    let usercollection = await bot.fetchUser(args[1])
    // If couldnt find them by username or ID, return error.
    if(!usercollection) return message.channel.send(`\`Error - No banned user with that ID!\`\nCommand usage: \`${prefix}unban [userID] (reason)\``)
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
    command: "unban"
}