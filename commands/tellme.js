const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    if(args[1]) {
        let mentionedmember = ''
        let tellmenum = ''
        let memberid = ''
        if(message.mentions.members.first()) {
            if(args[2]) {
                mentionedmember = bot.users.find(user => user.id == message.mentions.members.first().id).username;
                memberid = message.mentions.members.first().id
                args[1] = args[2]
                for(i = 2 + 1; i < args.length; i++) {
                    args[1] += ' ' + args[i];
                }
            } else {
                return message.channel.send('`Error - Unspecified input to evaluate!`\nCommand usage: `' + prefix + 'tellme (@user) [thing]`');
            }
        } else {
            mentionedmember = message.author.username
            memberid = message.author.id
            for(i = 1 + 1; i < args.length; i++) {
                args[1] += ' ' + args[i];
            }
        }

        let ftellme = await db.fetch(`tm_${args[1]}_${memberid}`);
        if (ftellme === null) {
            tellmenum = parseInt(Math.random() * 10)
            db.set(`tm_${args[1]}_${memberid}`, tellmenum)
        } else {
            tellmenum = ftellme;
        }
        message.channel.send(`**${mentionedmember}** scored a **${tellmenum}/10** for **${args[1]}**!`)
    } else {
        message.channel.send('`Error - Unspecified input to evaluate!`\nCommand usage: `' + prefix + 'tellme (@user) [thing]`');
    }
}

module.exports.config = {
    command: "tellme"
}