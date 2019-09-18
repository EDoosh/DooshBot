const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(!hasMod && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
    
    let mentionsid = ''
    if(message.mentions.members.first()) mentionsid = message.mentions.members.first().id
    else if(message.guild.members.find(user => user.id === args[1])) mentionsid = args[1]
    else return message.channel.send('`Error - Unspecified member to warn!`\nCommand usage: `' + prefix + 'warn [@user] (amount of warns) (reason)`');
    mentions = message.guild.members.find(user => user.id == mentionsid);

    let mentionsun = bot.users.find(user => user.id == mentions.id).username;
    if(mentions.roles.find(role => modrole.includes(role.name)) && hasMod) return message.channel.send("`Error - Don't try warning a fellow moderator!`");
    if(mentions.roles.find(role => adminrole.includes(role.name))) return message.channel.send("`Error - Don't try warning a fellow admin!`");
    if(!isNaN(args[2]) && args[2] > 20) return message.channel.send("Too many warns! Maximum is 20 at once.")
    let reason = "None given."
    let loopnum = 1
    if(args[2]){   // If there is a reason or amount to warn
        if(!isNaN(args[2])){   // If there is an amount to warn
            loopnum = parseInt(args[2])
            if(args[3]){
                for(i = 3 + 1; i < args.length; i++) {
                    args[3] += ' ' + args[i];
                }
                reason = args[3]
            }
        }else{
            for(i = 2 + 1; i < args.length; i++) {
                args[2] += ' ' + args[i];
            }
            reason = args[2]
        }
    }

    let plvlkick = parseInt(db.get(`plvl_kick_${message.guild.id}`));
    let plvlban = parseInt(db.get(`plvl_ban_${message.guild.id}`));
    let plvlwarn = parseInt(db.get(`plvl_warn_${message.guild.id}`));

    for(i = 1; i < loopnum + 1; i++) {
        let fnow = await db.get(`warns_${mentions.id}_${message.guild.id}.amount`)
        if(fnow === null) db.set(`warns_${mentions.id}_${message.guild.id}`, { amount: 0, reasons: [], times: [], warner: [], warnerusername: [] })

        db.push(`warns_${mentions.id}_${message.guild.id}.reasons`, reason)
        db.push(`warns_${mentions.id}_${message.guild.id}.times`, dateTime)
        db.push(`warns_${mentions.id}_${message.guild.id}.warner`, message.author.id)
        db.push(`warns_${mentions.id}_${message.guild.id}.warnerusername`, message.author.username)
        db.add(`warns_${mentions.id}_${message.guild.id}.amount`, 1)

        let famount = await db.get(`warns_${mentions.id}_${message.guild.id}.amount`);
        let kickeduser = mentions
        if(famount === plvlkick){
            kickeduser.kick().then((member) => {
                member.send('You were kicked for reaching the warn kick limit! You may rejoin the server.');
                message.channel.send(`${mentionsun} (${mentions.id}) was kicked for reaching the warn kick limit.`);
                let kickembed = new Discord.RichEmbed()
                    .setTitle(`:boot: Kicked user ${mentionsun} (${mentions.id})`)
                    .addField(`Reason: Reached warn kick limit.`)
                    .setFooter(`Use '${prefix}warnings ${mentions.id} list' to view warn history`)
                    .setTimestamp(Date.now())
                    .setColor(0x9055ee);
                if(logChannel != null) logChannel.send(kickembed);
            }).catch(() => {
                message.channel.send('Could not kick user for reaching warn limit as the bot has a lack of permissions.\n\`Required permission: Kick User\`');
                if(logChannel != null) logChannel.send(`Attempted to kick ${mentionsun} for reaching warn limit, failed due to the bot having a lack of permissions.\n\`Required permission: Kick User\``)
            })
        }else if(famount === plvlban){
            banneduser = bot.users.find(user => user.id === mentionsid);
            message.guild.ban(banneduser).then((member) => {
                banneduser.send('You were banned for reaching the warn kick limit!');
                message.channel.send(`${mentionsun} (${mentions.id}) was banned for reaching the warn ban limit.`);
                let banembed = new Discord.RichEmbed()
                    .setTitle(`:hammer: Banned user ${mentionsun} (${mentions.id})`)
                    .addField(`Reason: Reached warn ban limit.`, `Use '${prefix}unban ${mentions.id} (reason)' to unban them.`)
                    .setFooter(`Use '${prefix}warnings ${mentions.id} list' to view warn history`)
                    .setTimestamp(Date.now())
                    .setColor(0x3b0202);
                if(logChannel != null) logChannel.send(banembed);
            }).catch(() => {
                message.channel.send('Could not ban user for reaching warn limit as the bot has a lack of permissions.\n\`Required permission: Ban User\`');
                if(logChannel != null) logChannel.send(`Attempted to ban ${mentionsun} for reaching warn limit, failed due to the bot having a lack of permissions.\n\`Required permission: Ban User\``)
            })
        }else if(famount === plvlwarn){
            message.channel.send(`This user has reached the notify level at ${plvlwarn} warns!`);
            let notifyembed = new Discord.RichEmbed()
                .setTitle(`:warning: User ${mentionsun} (${mentions.id}) at notify level!`)
                .setFooter(`Use '${prefix}warnings ${mentionsun} list' to view warn history`)
                .setTimestamp(Date.now())
                .setColor(0x07deaf);
            if(logChannel != null) logChannel.send(notifyembed);
        }
    }

    message.channel.send(`Added \`${loopnum}\` warns to ${mentionsun} for reason \`${reason}\``);
    let warncount = await db.get(`warns_${mentions.id}_${message.guild.id}.amount`);
    let warnembed = new Discord.RichEmbed()
        .setTitle(':exclamation: User Warned')
        .addField(msgUsername + ' has warned ' + mentionsun + ' for ' + loopnum + ' warns.\n',
        'Reason given: ' + reason + "\n" +
        'This user now has ' + warncount + ' offences.')
        .setColor(0xF55656)
        .setTimestamp(Date.now())
        .setFooter("Use '" + prefix + "warnings @" + mentionsun + " list' to view their server warning history.");
    if(logChannel != null) logChannel.send(warnembed);
}

module.exports.config = {
    command: "warn"
}