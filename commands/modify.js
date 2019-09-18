const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    if(msgUsername === serverOwner || hasAdmin || useallcmds.includes(msgUserID)) { // If command issuer is server owner, is admin, or is AllCmds, allow them to run command

        function combineArgs(combineTo) { // Combines args
            for(i = combineTo + 1; i < args.length; i++) {
                args[combineTo] += ' ' + args[i];
            }
        }
        function findRole(curCheck) { // Checks if role exists
            return curCheck === args[2]
        }

        switch(args[1]) { // Checks for cases
            case 'mod-role': // If user wants to edit modrole
                combineArgs(2); // Combine everything after argument 2
                if(!args[2]) { // If there isn't an argument 2
                    if(modrole.length === 0) { // If there isn't anything in modrole, say so
                        message.channel.send('No roles exist with mod-role permission in the bot!');
                    }else{ // If there is stuff in modrole, say the roles
                        message.channel.send('Current roles with mod-role: ' + modrole);
                    }
                }else if(!message.guild.roles.find(x => x.name == args[2])) { // If there is an arg2 but cant find anything with the name, say so
                    message.channel.send('The role `' + args[2] + '` does not exist!');
                }else if(modrole.includes(args[2])){ // If there is already that role in the modrole...
                    modrole.splice(modrole.findIndex(findRole), 1); // Remove it from modrole
                    db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
                    message.channel.send('The role `' + args[2] + '` has been removed from Moderator permissions for this bot!'); // Say its been removed
                }else{ // If its new to the database.
                    modrole.push(args[2]); // Add it in to modrole
                    db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
                    message.channel.send('The role `' + args[2] + '` now has Moderator permission for this bot!'); // Say its been added
                }
                break;

            case 'admin-role': // Same structure as ModRole
                combineArgs(2);
                if(!args[2]) {
                    if(adminrole.length === 0) {
                        message.channel.send('No roles exist with admin-role permission in the bot!');
                    }else{
                        message.channel.send('Current roles with admin-role: ' + adminrole);
                    }
                }else if(!message.guild.roles.find(x => x.name == args[2])) {
                    message.channel.send('The role `' + args[2] + '` does not exist!');
                }else if(adminrole.includes(args[2])){
                    adminrole.splice(adminrole.findIndex(findRole), 1);
                    db.set(`adminrole_${message.guild.id}`, adminrole);
                    message.channel.send('The role `' + args[2] + '` has been removed from Admin permissions for this bot!');
                }else{
                    adminrole.push(args[2]);
                    db.set(`adminrole_${message.guild.id}`, adminrole);
                    message.channel.send('The role `' + args[2] + '` now has Admin permission for this bot!');
                }
                break;

            case 'role-modify': // Same structure as ModRole
                combineArgs(2);
                if(!args[2]) {
                    if(rmrole.length === 0) {
                        message.channel.send('No roles exist with role-modify permission in the bot!');
                    }else{
                        message.channel.send('Current roles with role-modify: ' + rmrole);
                    }
                }else if(!message.guild.roles.find(x => x.name == args[2])) {
                    message.channel.send('The role `' + args[2] + '` does not exist!');
                }else if(rmrole.includes(args[2])){
                    rmrole.splice(rmrole.findIndex(findRole), 1);
                    db.set(`rmrole_${message.guild.id}`, rmrole);
                    message.channel.send('The role `' + args[2] + '` has been removed from Role Modify permissions for this bot!');
                }else{
                    rmrole.push(args[2]);
                    db.set(`rmrole_${message.guild.id}`, rmrole);
                    message.channel.send('The role `' + args[2] + '` now has Role Modify permission for this bot!');
                }
                break;        

            case 'log-channel': // If the user wants to edit the logchannel
                if(!args[2]) { // If they want to see which the logchannel is
                    if(logChannel == null || logChannel == 623817067870814208){ // If logging channels is off
                        message.channel.send('Logging channel is off.') // Say
                    }else{ // If it isnt off
                        message.channel.send('Current log channel set to <#' + logChannel + '>'); // Announce log channel
                    }
                }else if(args[2] === 'off'){ // When they want to turn it off...
                    message.channel.send(`Turned off logging channels`); // Announce
                    db.set(`logChannel_${message.guild.id}`, 623817067870814208); // Set to a channel.
                    // I know, you guys are going to acuse me of stealing data.
                    // This isn't the case. This is the only way I can think of that wont throw errors.
                    // I cant use 'null' or 'undefined' cause then quickdb throws a tantrum and it does nothing :/
                }else if(!message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) { // If there is a mentioned channel but it doesnt exist
                    message.channel.send('`Error - Channel does not exist!`\nCommand usage: `' + prefix + 'modify log-channel [new log-channel]`'); // Complain the channel doesnt exist
                }else{ // If a channel does exist
                    message.channel.send('New channel set to ' + args[2] + ''); // Say new channel
                    let logChanID = args[2].slice(2, (args[2].length) - 1); // Set logchannelid
                    logChannel = bot.channels.get(logChanID); // set log channel
                    db.set(`logChannel_${message.guild.id}`, logChanID); // set logchannel in db to logchannelid
                    logChannel.send('Log channel set to here!'); // announce
                }
                break;

            default: // If no permission to modify, complain
                message.channel.send('`Error - Unspecified permission to modify!`\nCommand usage: `' + prefix + 'modify [mod-role | admin-role | role-modify | log-channel]`');
                break;
        }
    }else{ // If no admin perms, say so.
        message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
    }
}

module.exports.config = {
    command: "modify"
}