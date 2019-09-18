const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    // If it isnt an admin, show error.
    if(!hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
    // If there isn't a config to edit, show error
    if(!args[1]) return message.channel.send('`Error - Unspecified config to edit!`\nCommand usage: `' + prefix + 'plvl [kick | ban | notify] [warn count]`');
    if(!args[2]){ // If the user wants the levels its currently set to
        switch(args[1]){ // Sets case search to first argument
            case 'kick': // If they want to get the kick level...
                let kicklevel = await db.get(`plvl_kick_${message.guild.id}`) // Get the kick level from the DB and set it to kicklevel
                message.channel.send(`The current kick level is set to \`${kicklevel}\``) // Announce
                break; // Exit the case.
            case 'ban':
                let banlevel = await db.get(`plvl_ban_${message.guild.id}`)
                message.channel.send(`The current ban level is set to \`${banlevel}\``)
                break;
            case 'notify':
                let warnlevel = await db.get(`plvl_warn_${message.guild.id}`)
                message.channel.send(`The current notify level is set to \`${warnlevel}\``)
                break;
        }
    } else { // If there is something to set the values to..
        switch(args[1]){ // Sets case search to first argument
            case 'kick': // If they want to set the kick level...
                db.set(`plvl_kick_${message.guild.id}`, args[2]); // Set the database to second argument
                message.channel.send(`Kick level set to \`${args[2]}\` warns.`); // Announce the change
                break; // Exit the case

            case 'ban':
                db.set(`plvl_ban_${message.guild.id}`, args[2]);
                message.channel.send(`Ban level set to \`${args[2]}\` warns.`);
                break;

            case 'notify':
                db.set(`plvl_warn_${message.guild.id}`, args[2]);
                message.channel.send(`Notify level set to \`${args[2]}\` warns.`);
                break;
        }
    }
}

module.exports.config = {
    command: "plvl"
}