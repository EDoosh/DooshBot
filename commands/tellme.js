const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    if(args[1]) { // If there is a second argument
        let mentionedmember = '' // Set variables
        let tellmenum = ''
        let memberid = ''
        if(message.mentions.members.first()) { // If there is a mentioned member
            if(args[2]) { // If there is a second argument
                mentionedmember = bot.users.find(user => user.id == message.mentions.members.first().id).username; // Get the username of the mentioned member
                memberid = message.mentions.members.first().id // Get the ID of the mentioned member
                args[1] = args[2] // Combine everything after the mention to evaluate it
                for(i = 2 + 1; i < args.length; i++) {
                    args[1] += ' ' + args[i];
                }
            } else { // If there is nothing to evaluate, say so.
                return message.channel.send('`Error - Unspecified input to evaluate!`\nCommand usage: `' + prefix + 'tellme (@user) [thing]`');
            }
        } else { // If there is not a mentioned member
            mentionedmember = message.author.username // Get the username of the message author
            memberid = message.author.id // Get the authors ID
            for(i = 1 + 1; i < args.length; i++) { // Combine everything after the mention to evaluate it
                args[1] += ' ' + args[i];
            }
        }

        let ftellme = await db.fetch(`tm_${args[1]}_${memberid}`); // Get the number it previously evaluated at from the database
        if (ftellme === null) { // If it wasn't previously evaluated, it returns null
            tellmenum = parseInt(Math.random() * 10) // Gets a random number between 1 and 10 to be shown to the member later
            db.set(`tm_${args[1]}_${memberid}`, tellmenum) // Adds to the database so it can be retrieved next time
        } else { // If it was previously evaluated
            tellmenum = ftellme; // Sets the number that will be told to the member to the one gotten from the database
        }
        message.channel.send(`**${mentionedmember}** scored a **${tellmenum}/10** for **${args[1]}**!`) // Show the member
    } else { // If there isn't an argument 1, show error
        message.channel.send('`Error - Unspecified input to evaluate!`\nCommand usage: `' + prefix + 'tellme (@user) [thing]`');
    }
}

module.exports.config = {
    command: "tellme"
}