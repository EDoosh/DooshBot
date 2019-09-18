const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(!hasMod && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');

    let mentions = ''
    if(message.mentions.members.first()) mentions = message.mentions.members.first().id
    else if(bot.users.find(user => user.id == args[1])) mentions = args[1]
    else return message.channel.send('`Error - Unspecified member to check warnings of!`\nCommand usage: `' + prefix + 'warnings [@user] [list | deleteid | clear | count] (warn to delete) (reason)`');
    
    let mentionsun = bot.users.find(user => user.id == mentions).username;
    switch(args[2]){
        case 'list':
            let fnow = await db.get(`warns_${mentions}_${message.guild.id}.amount`);
            if(fnow === null || fnow === 0) return message.channel.send("This user has no warn history!")
            else {
                let reasons = await db.get(`warns_${mentions}_${message.guild.id}.reasons`);
                let times = await db.get(`warns_${mentions}_${message.guild.id}.times`);
                let warner = await db.get(`warns_${mentions}_${message.guild.id}.warner`);
                let warnerusername = await db.get(`warns_${mentions}_${message.guild.id}.warnerusername`);
                for(i = 1; i < fnow + 1; i++) {
                    let warningsembed = new Discord.RichEmbed()
                        .setTitle(`:clock3: Warning History of ${mentionsun} (${mentions})`)
                        .addField(`Reason: ${reasons[i-1]}`, 
                        `Warner: ${warnerusername[i-1]} (${warner[i-1]})\n` + 
                        `Time: ${times[i-1]}`)
                        .setFooter(`Warn ID ${i}`)
                        .setColor(0xeed555);
                    message.channel.send(warningsembed)
                }
            }
            break;

        case 'deleteid':
            if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
            let fnowid = await db.get(`warns_${mentions}_${message.guild.id}.amount`);
            if(fnowid === null || fnowid === 0) return message.channel.send("This user has no warn history!")
            if(isNaN(args[3])) return message.channel.send('`Error - Bad ID!`\nCommand usage: `' + prefix + 'warnings [@user] [list | deleteid | clear | count] (warn to delete) (reason)`');
            if(fnowid > args[3] || fnow <= 0) return message.channel.send('`Error - Bad ID!`\nCommand usage: `' + prefix + 'warnings [@user] [list | deleteid | clear | count] (warn to delete) (reason)`');

            let reasonsdel = await db.get(`warns_${mentions}_${message.guild.id}.reasons`);
            let timesdel = await db.get(`warns_${mentions}_${message.guild.id}.times`);
            let warnerdel = await db.get(`warns_${mentions}_${message.guild.id}.warner`);
            let warnerusernamedel = await db.get(`warns_${mentions}_${message.guild.id}.warnerusername`);

            db.set(`warns_${mentions}_${message.guild.id}.reasons`, reasonsdel.splice(args[3-1], 1))
            db.set(`warns_${mentions}_${message.guild.id}.times`, timesdel.splice(args[3-1], 1))
            db.set(`warns_${mentions}_${message.guild.id}.warner`, warnerdel.splice(args[3-1], 1))
            db.set(`warns_${mentions}_${message.guild.id}.warnerusername`, warnerusernamedel.splice(args[3-1], 1))
            db.subtract(`warns_${mentions}_${message.guild.id}.amount`, 1)

            let reasonfordelete = 'None given.'
            if(args[4]){
                for(i = 2 + 1; i < args.length; i++) {
                    reasonfordelete += ' ' + args[i];
                }
            }
            message.channel.send(`Warn deleted from ${mentionsun}!`)            
            let warningsdelembed = new Discord.RichEmbed()
                .setTitle(`:grey_exclamation: Warning Deleted`)
                .addField(`Warned User: ${mentionsun} (${mentions})`, 
                `Warning Reason: ${reasonsdel[i-1]}\n` + 
                `Warning Warner: ${warnerusername[i-1]} (${warner[i-1]})\n` + 
                `Warning Time: ${times[i-1]}`)
                .addField(`Deletion Reason:${reasonfordelete}`,
                `Deletion User: ${message.author.username} (${message.author.id})\n` +
                `Deleted Warn ID: ${args[1]}`)
                .setTimestamp(Date.now())
                .setColor(0x77F731);
            if(logChannel != null) logChannel.send(warningsdelembed);
            break;

        case 'clear':
            if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
            let fnowdel = await db.get(`warns_${mentions}_${message.guild.id}.amount`);
            if(fnowdel === null || fnowdel === 0) return message.channel.send("This user has no warn history!")
            db.set(`warns_${mentions}_${message.guild.id}`, { amount: 0, reasons: [], times: [], warner: [], warnerusername: [] })
            message.channel.send(`Warns cleared from ${mentionsun}!`)
            let warningsdelallembed = new Discord.RichEmbed()
                .setTitle(`:white_check_mark: All Warnings Deleted`)
                .addField(`Cleared ${fnowdel} warns from ${mentionsun} (${mentions})`, 
                `Cleared by: ${message.author.username} (${message.author.id})`)
                .setTimestamp(Date.now())
                .setColor(0xd2ee55);
            if(logChannel != null) logChannel.send(warningsdelallembed);
            break;

        case 'count':
            let fcount = await db.get(`warns_${mentions}_${message.guild.id}.amount`);
            if(fcount === null || fcount === 0) return message.channel.send("This user has no warn history!")
            message.channel.send(`This user has ${fcount} warns!`)

        default:
            message.channel.send('`Error - Unspecified argument!`\nCommand usage: `' + prefix + 'warnings [@user] [list | deleteid | clear | count] (warn to delete) (reason)`');
            break;
    }

}

module.exports.config = {
    command: "warnings"
}