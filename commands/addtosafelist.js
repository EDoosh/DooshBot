const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    // Only me can use this command bitches.
    if(msgUserID != 267723762563022849) return message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');
    let safeids = await db.get(`useallcmds`); // Get all users that can use the command
    if(!args[1]) return message.channel.send(`List of current safe IDs - ${safeids}`); // Show all the IDs
    if(safeids.includes(args[1])){ // If the ID is in the array of IDs that can use all cmds
        function findID(curCheck) {
            return curCheck === args[1]
        }
        safeids.splice(safeids.findIndex(findID), 1); // Find the location of the person and remove them
        db.set(`useallcmds`, safeids); // Set it into the database
        message.channel.send('The ID `' + args[1] + '` has been removed from Use All Commands permissions for this bot!'); // Announce
    }else{ // If they aren't in the array of people that use use all cmds
        safeids.push(args[1]); // Add it to the end
        db.set(`useallcmds`, safeids); // Set it into the database
        message.channel.send('The ID `' + args[1] + '` now has Use All Commands permissions for this bot!'); // Announce
    }
}

module.exports.config = {
    command: "addtosafelist"
}