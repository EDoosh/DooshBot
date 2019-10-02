const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    let mentions; // Make mentions exist with nothing in it.
    if(message.mentions.members.first()) mentions = message.mentions.members.first().id // If there is a mention, get their id and put it in mentions
    else if(bot.users.find(user => user.id == args[1])) mentions = args[1] // If there is a valid user ID, get their ID and put it in mentions
    else if(bot.users.find(user => user.username === args[1])) mentions = bot.users.find(user => user.username === args[1]).id // If a name was said, get their ID
    // If neither of the above, throw error
    else return errormsg.run(bot, message, args, "a", `\`Unspecified member!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}`);
    
    let mentionsun = bot.users.find(user => user.id == mentions).username; // Make mentionsun (Mentions username) to be the found username of the userID
    switch(args[2]){ // Make it select from the second argument, or the one they want to check.
        case 'list': // If they want to list all the warns
            let fnow = await db.get(`warns_${mentions}_${message.guild.id}.amount`); // Get amount of warns
            if(fnow === null || fnow === 0) return message.channel.send("This user has no warn history!") // If they have no warns, say so.
            else { // If they have warns...
                let reasons = await db.get(`warns_${mentions}_${message.guild.id}.reasons`); // Get reasons for those warns
                let times = await db.get(`warns_${mentions}_${message.guild.id}.times`); // Get times they were warned at (UTC+12/13, depending on NZT or NZDT)
                let warner = await db.get(`warns_${mentions}_${message.guild.id}.warner`); // Get the warner's ID
                let warnerusername = await db.get(`warns_${mentions}_${message.guild.id}.warnerusername`); // Get the warner's username when they warned them.
                for(i = 1; i < fnow + 1; i++) { // For all the warns they have...
                    let warningsembed = new Discord.RichEmbed() // Make a new embed
                        .setTitle(`:clock3: Warning History of ${mentionsun} (${mentions})`) // Set the title to be the warned's current username and id
                        .addField(`Reason: ${reasons[i-1]}`,  // Set field text to the reason and add it to the title of the field
                        `Warner: ${warnerusername[i-1]} (${warner[i-1]})\n` +  // Set field text to the warners username when they warned, and their ID
                        `Time: ${times[i-1]}`) // Set field text to the time they were warned at
                        .setFooter(`Warn ID ${i}`) // Set the footer to the warn ID
                        .setColor(0xeed555); // Colour
                    message.channel.send(warningsembed) // Send the embed
                }
            }
            break; // Exit the case.

        case 'deleteid':
            // Check that they have admin
            if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
            let fnowid = await db.get(`warns_${mentions}_${message.guild.id}.amount`); // Get the number of warns they have
            if(fnowid === null || fnowid === 0) return message.channel.send("This user has no warn history!") // If its none, throw error
            // If the ID to delete isn't a number, throw error
            if(isNaN(args[3])) return errormsg.run(bot, message, args, 3, "That ID isn't even a number");
            // If the ID to delete is larger than the number they have, or smaller than 1, throw error
            if(args[3] > fnowid || args[3] <= 0) return errormsg.run(bot, message, args, 3, "Bad ID");

            let reasons = await db.get(`warns_${mentions}_${message.guild.id}.reasons`); // Get all the reasons they were warned
            let times = await db.get(`warns_${mentions}_${message.guild.id}.times`); // Get all the times they were warned
            let warner = await db.get(`warns_${mentions}_${message.guild.id}.warner`); // Warner's userID
            let warnerusername = await db.get(`warns_${mentions}_${message.guild.id}.warnerusername`); // Warner's name at time of warn

            let reasonfordelete = ' None given.' // Set reasonsfordelete to 'None given.' as defualt
            if(args[4]){ // If there is a reason
                for(i = 3 + 1; i < args.length; i++) { // Combine the reason args together into reasonsfordelete
                    reasonfordelete += ' ' + args[i];
                }
            }
            message.channel.send(`Warn deleted from ${mentionsun}!`) // Send message it has been done  
            let warningsdelembed = new Discord.RichEmbed() // New embed! MUST be done before splicing so that old reason, warner, and time can be stated.
                .setTitle(`:grey_exclamation: Warning Deleted`)
                .addField(`Warned User: ${mentionsun} (${mentions})`, 
                `Warning Reason: ${reasons[args[3]-1]}\n` + 
                `Warning Warner: ${warnerusername[args[3]-1]} (${warner[args[3]-1]})\n` + 
                `Warning Time: ${times[args[3]-1]}`)
                .addField(`Deletion Reason:${reasonfordelete}`,
                `Deletion User: ${message.author.username} (${message.author.id})\n` +
                `Deleted Warn ID: ${args[3]}`)
                .setTimestamp(Date.now())
                .setColor(0x77F731);
            if(logChannel != 0) logChannel.send(warningsdelembed); // If logchannel, send embed

            reasons.splice(args[3] - 1, 1) // Cut the one that needs to be removed
            times.splice(args[3] - 1, 1) // Same as above
            warner.splice(args[3] - 1, 1)
            warnerusername.splice(args[3] - 1, 1)

            db.set(`warns_${mentions}_${message.guild.id}.reasons`, reasons) // Set into the database the previous reasons without the one removed.
            db.set(`warns_${mentions}_${message.guild.id}.times`, times) // Rest are just same as above
            db.set(`warns_${mentions}_${message.guild.id}.warner`, warner)
            db.set(`warns_${mentions}_${message.guild.id}.warnerusername`, warnerusername)
            db.subtract(`warns_${mentions}_${message.guild.id}.amount`, 1) // Remove 1 from the amount of warns they have
            break; // Exit case.

        case 'clear': // If they want to clear all their warns
            // Check if they have admin permissions
            if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
            let fnowdel = await db.get(`warns_${mentions}_${message.guild.id}.amount`); // Get the amount of warns mentioned user has
            if(fnowdel === null || fnowdel === 0) return message.channel.send("This user has no warn history!") // If no warns, say so.
            db.set(`warns_${mentions}_${message.guild.id}`, { amount: 0, reasons: [], times: [], warner: [], warnerusername: [] }) // Clear their info in the database to default
            message.channel.send(`Warns cleared from ${mentionsun}!`) // Announce they were cleared
            let warningsdelallembed = new Discord.RichEmbed() // New embed
                .setTitle(`:white_check_mark: All Warnings Deleted`)
                .addField(`Cleared ${fnowdel} warns from ${mentionsun} (${mentions})`, 
                `Cleared by: ${message.author.username} (${message.author.id})`)
                .setTimestamp(Date.now())
                .setColor(0xd2ee55);
            if(logChannel != 0) logChannel.send(warningsdelallembed); // Send embed in logchannel, if there is one.
            break; // Exit the case.

        case 'count': // If they want the number of warns the mentioned has
            let fcount = await db.get(`warns_${mentions}_${message.guild.id}.amount`); // Get the number of warns they have
            if(fcount === null || fcount === 0) return message.channel.send("This user has no warn history!") // If they dont have any warns, say so
            message.channel.send(`This user has ${fcount} warns!`) // Otherwise, say how many warns they have
            break; // Exit the case

        default: // If none of the above, send an error
            errormsg.run(bot, message, args, "a", `\`Unspecified argument!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}`)
            break;
    }

}

module.exports.config = {
    command: ["warnings", "warns", "ws"],
    permlvl: "Mod",
    help: ["Mod", "Clear, Delete, List, and Count the number of warns a user has.",
            "Mod", "[mention | userID | username] list", "List all the warns a user has.",
            "Mod", "[mention | userID | username] count", "Display the number of warns a user has.",
            "Admin", "[mention | userID | username] deleteID [warnID] (reason)", "Delete a warn by its warnID. If reason is specified, use that in logchannel.",
            "Admin", "[mention | userID | username] clear", "Clear all the warns a user has."],
    helpg: "[mention | userID | username] [list | count | deleteID | clear]"
}