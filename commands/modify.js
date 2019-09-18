const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    if(msgUsername === serverOwner || hasAdmin || useallcmds.includes(msgUserID)) {

        function combineArgs(combineTo) {
            for(i = combineTo + 1; i < args.length; i++) {
                args[combineTo] += ' ' + args[i];
            }
        }
        function findRole(curCheck) {
            return curCheck === args[2]
        }

        switch(args[1]) {
        case 'mod-role':
            combineArgs(2);
            if(!args[2]) {
                if(modrole.length === 0) {
                    message.channel.send('No roles exist with mod-role permission in the bot!');
                }else{
                    let modroleroles = ''
                    for(i=1; i <= modrole.length; i++){
                        // Get name from ID
                        // 
                    }
                    message.channel.send('Current roles with mod-role: ' + modroleroles);
                }
            }else if(!message.guild.roles.find(x => x.name == args[2])) {
                message.channel.send('The role `' + args[2] + '` does not exist!');
            }else if(modrole.includes(args[2])){
                modrole.splice(modrole.findIndex(findRole), 1);
                db.set(`modrole_${message.guild.id}`, modrole);
                message.channel.send('The role `' + args[2] + '` has been removed from Moderator permissions for this bot!');
            }else{
                modrole.push(args[2]);
                db.set(`modrole_${message.guild.id}`, modrole);
                message.channel.send('The role `' + args[2] + '` now has Moderator permission for this bot!');
            }
            break;

        case 'admin-role':
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

        case 'role-modify':
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

        case 'log-channel':
            if(!args[2]) {
                message.channel.send('Current log channel set to <#' + logChannel + '>');
            }else if(args[2] === 'off'){
                message.channel.send(`Turned off logging channels`);
                db.set(`logChannel_${message.guild.id}`, null);
            }else if(!message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) {
                message.channel.send('`Error - Channel does not exist!`\nCommand usage: `' + prefix + 'modify log-channel [new log-channel]`');
            }else{
                message.channel.send('New channel set to ' + args[2] + '');
                let logChanID = args[2].slice(2, (args[2].length) - 1);
                logChannel = bot.channels.get(logChanID);
                db.set(`logChannel_${message.guild.id}`, logChanID);
                logChannel.send('Log channel set to here!');
            }
            break;

        default:
            message.channel.send('`Error - Unspecified permission to modify!`\nCommand usage: `' + prefix + 'modify [mod-role | admin-role | role-modify | log-channel]`');
            break;
        }
    }else{
        message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
    }
}

module.exports.config = {
    command: "modify"
}