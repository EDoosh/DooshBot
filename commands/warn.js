const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    // Check if they have mod
    if(!hasMod && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
    
    let mentionsid = '' // Set mentionsid to nothing
    if(message.mentions.members.first()) mentionsid = message.mentions.members.first().id // If there is a mention, set mentionsid to the mentioned's id
    else if(message.guild.members.find(user => user.id === args[1])) mentionsid = args[1] // Otherwise, check if there is a person with that ID and set mentionsid to that
    else return message.channel.send('`Error - Unspecified member to warn!`\nCommand usage: `' + prefix + 'warn [@user] (amount of warns) (reason)`'); // If neither of the above, throw error
    mentions = message.guild.members.find(user => user.id == mentionsid); // Set mentions to the user collection of the member with the mentionsid

    let mentionsun = bot.users.find(user => user.id == mentions.id).username; // Get their username too.
    // If they have mod and not admin, and they're trying to warn a mod, disallow it.
    if(mentions.roles.find(role => modrole.includes(role.name)) && hasMod && !hasAdmin) return message.channel.send("`Error - Don't try warning a fellow moderator!`");
    // Otherwise if they have admin disallow it entirely.
    if(mentions.roles.find(role => adminrole.includes(role.name))) return message.channel.send("`Error - Don't try warning a fellow admin!`");
    // Allow a maximum of 20 warns at once to prevent database errors.
    if(!isNaN(args[2]) && args[2] > 20) return message.channel.send("Too many warns! Maximum is 20 at once.")
    // Set reason and loopnum to defaults.
    let reason = "None given."
    let loopnum = 1
    if(args[2]){   // If there is a reason OR amount to warn
        if(!isNaN(args[2])){   // If there is an amount to warn
            loopnum = parseInt(args[2]) // Set loopnum to amount to warn
            if(args[3]){ // If there is a reason too
                for(i = 3 + 1; i < args.length; i++) { // Combine args into reason 
                    args[3] += ' ' + args[i];
                }
                reason = args[3] // Set reason to args3
            }
        }else{ // If there is only a reason
            for(i = 2 + 1; i < args.length; i++) { // Combine args into reason
                args[2] += ' ' + args[i];
            }
            reason = args[2] // Set reason to args3
        }
    }

    let plvlkick = parseInt(db.get(`plvl_kick_${message.guild.id}`)); // Get levels to kick, ban, and warn at.
    let plvlban = parseInt(db.get(`plvl_ban_${message.guild.id}`));
    let plvlwarn = parseInt(db.get(`plvl_warn_${message.guild.id}`));

    // Loop through the amount of times to warn them
    for(i = 1; i < loopnum + 1; i++) {
        // Get the amount of warns they have
        let fnow = await db.get(`warns_${mentions.id}_${message.guild.id}.amount`)
        // If they haven't had anything done to their warns yet, set the classes
        if(fnow === null) db.set(`warns_${mentions.id}_${message.guild.id}`, { amount: 0, reasons: [], times: [], warner: [], warnerusername: [] })

        // Add everything to the database.
        db.push(`warns_${mentions.id}_${message.guild.id}.reasons`, reason) // Add reason to the database
        db.push(`warns_${mentions.id}_${message.guild.id}.times`, dateTime) // Add time to the database
        db.push(`warns_${mentions.id}_${message.guild.id}.warner`, message.author.id) // Add the warner's id
        db.push(`warns_${mentions.id}_${message.guild.id}.warnerusername`, message.author.username) // Add the warner's username
        db.add(`warns_${mentions.id}_${message.guild.id}.amount`, 1) // Increment the number of warns

        let famount = await db.get(`warns_${mentions.id}_${message.guild.id}.amount`); // Get the new amount of warns they have
        if(famount === plvlkick){ // If they've reached the pwarn level to be kicked
            let kickeduser = mentions // Set kickuser to the same collection as mentioned user
            kickeduser.kick().then(() => { // Kick the user
                message.channel.send(`${mentionsun} (${mentions.id}) was kicked for reaching the warn kick limit.`); // If the kickening succeeded, say they were kicked
                let kickembed = new Discord.RichEmbed() // Ooo embeds! My favourite!
                    .setTitle(`:boot: Kicked user ${mentionsun} (${mentions.id})`)
                    .addField(`Reason: Reached warn kick limit.`, '\n')
                    .setFooter(`Use '${prefix}warnings ${mentions.id} list' to view warn history`)
                    .setTimestamp(Date.now())
                    .setColor(0x9055ee);
                if(logChannel != 0) logChannel.send(kickembed); // Send embed in logchannel if it exists
            }).catch(() => { // If the kickening failed... announce.
                message.channel.send('Could not kick user for reaching warn limit as the bot has a lack of permissions.\n\`Required permission: Kick User\`');
                if(logChannel != 0) logChannel.send(`Attempted to kick ${mentionsun} for reaching warn limit, failed due to the bot having a lack of permissions.\n\`Required permission: Kick User\``)
            })
        }else if(famount === plvlban){ // Same as above pretty much.
            banneduser = bot.users.find(user => user.id === mentionsid);
            message.guild.ban(banneduser).then(() => {
                message.channel.send(`${mentionsun} (${mentions.id}) was banned for reaching the warn ban limit.`);
                let banembed = new Discord.RichEmbed()
                    .setTitle(`:hammer: Banned user ${mentionsun} (${mentions.id})`)
                    .addField(`Reason: Reached warn ban limit.`, `Use '${prefix}unban ${mentions.id} (reason)' to unban them.`)
                    .setFooter(`Use '${prefix}warnings ${mentions.id} list' to view warn history`)
                    .setTimestamp(Date.now())
                    .setColor(0x000000);
                if(logChannel != 0) logChannel.send(banembed);
            }).catch(() => {
                message.channel.send('Could not ban user for reaching warn limit as the bot has a lack of permissions.\n\`Required permission: Ban User\`');
                if(logChannel != 0) logChannel.send(`Attempted to ban ${mentionsun} for reaching warn limit, failed due to the bot having a lack of permissions.\n\`Required permission: Ban User\``)
            })
        }else if(famount === plvlwarn){ // If theyre at notify level
            message.channel.send(`This user has reached the notify level at ${plvlwarn} warns!`); // Announce
            let notifyembed = new Discord.RichEmbed() // Embed
                .setTitle(`:warning: User ${mentionsun} (${mentions.id}) at notify level!`)
                .setFooter(`Use '${prefix}warnings ${mentionsun} list' to view warn history`)
                .setTimestamp(Date.now())
                .setColor(0x07deaf);
            if(logChannel != 0) logChannel.send(notifyembed); // Send embed in logchannel if it exists
        }
    }

    message.channel.send(`Added \`${loopnum}\` warns to ${mentionsun} for reason \`${reason}\``); // Announce warns added
    let warncount = await db.get(`warns_${mentions.id}_${message.guild.id}.amount`); // Get amount of warns
    let warnembed = new Discord.RichEmbed() // New embed time
        .setTitle(':exclamation: User Warned')
        .addField(`${msgUsername} has warned ${mentionsun} (${mentionsid}) for ${loopnum} warns.`,
        `Reason given: ${reason}\n` +
        `This user now has ${warncount} offences.`)
        .setColor(0xF55656)
        .setTimestamp(Date.now())
        .setFooter(`Use ${prefix}warnings @${mentionsun} list' to view their server warning history.`);
    if(logChannel != 0) logChannel.send(warnembed); // Send embed in logchannel if it exists.
}

module.exports.config = {
    command: "warn"
}