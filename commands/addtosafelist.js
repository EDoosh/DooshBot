const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(msgUserID != 267723762563022849) return message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');
    let safeids = await db.get(`useallcmds`);
    if(!args[1]) return message.channel.send(`List of current safe IDs - ${safeids}`);
    if(safeids.includes(args[1])){
        function findRole(curCheck) {
            return curCheck === args[1]
        }
        safeids.splice(safeids.findIndex(findRole), 1);
        db.set(`useallcmds`, safeids);
        message.channel.send('The ID `' + args[1] + '` has been removed from Use All Commands permissions for this bot!');
    }else{
        safeids.push(args[1]);
        db.set(`useallcmds`, safeids);
        message.channel.send('The ID `' + args[1] + '` now has Use All Commands permissions for this bot!');
    }
}

module.exports.config = {
    command: "addtosafelist"
}