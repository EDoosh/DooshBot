const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
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
    command: ["addtosafelist", "atsl"],
    permlvl: "EDoosh",
    help: ["EDoosh", "The list of people allowed to use any command, anywhere",
            "EDoosh", "", "Show all users in the safe-list",
            "EDoosh", "[userID]", "If the ID is not in the safe list already, it adds it in. Otherwise, it removes it."]
}