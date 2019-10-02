const db = require('quick.db');


module.exports.run = async (bot, message, args) => {
    function combineArgs(combineTo) { // Combines args
        for(i = combineTo + 1; i < args.length; i++) {
            args[combineTo] += ' ' + args[i];
        }
    }
    function findRole(curCheck) { // Checks if role exists
        return curCheck === args[2]
    }

    switch(args[1]) { // Checks for cases
        case 'mr':
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

        case 'ar':
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

        case 'rm':
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

        case 'lc':
        case 'log-channel': // If the user wants to edit the logchannel
            if(!args[2]) { // If they want to see which the logchannel is
                if(logChannel == 0){ // If logging channels is off
                    message.channel.send('Logging channel is off.') // Say
                }else{ // If it isnt off
                    message.channel.send('Current log channel set to <#' + logChannel + '>'); // Announce log channel
                }
            }else if(args[2] === 'off'){ // When they want to turn it off...
                message.channel.send(`Turned off logging channels`); // Announce
                db.set(`logChannel_${message.guild.id}`, 0); // Set to a channel.
            }else if(!message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) { // If there is a mentioned channel but it doesnt exist
                errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
            }else{ // If a channel does exist
                message.channel.send('New channel set to ' + args[2] + ''); // Say new channel
                let logChanID = args[2].slice(2, (args[2].length) - 1); // Set logchannelid
                logChannel = bot.channels.get(logChanID); // set log channel
                db.set(`logChannel_${message.guild.id}`, logChanID); // set logchannel in db to logchannelid
                logChannel.send('Log channel set to here!'); // announce
            }
            break;

        case 'qc':
        case 'quote-channel': // If the user wants to edit the quotechannel
            let fqc = await db.get(`quoteChannel_${message.guild.id}`);
            let qc;
            if (fqc == null || fqc == 0) qc = 0
            else qc = message.guild.channels.get(fqc);
            if(!args[2]) { // If they want to see which the quotechannel is
                if(qc == 0){ // If logging channels is off
                    message.channel.send('Quote channel is off.') // Say
                }else{ // If it isnt off
                    message.channel.send('Current quote channel set to ' + qc); // Announce log channel
                }
            }else if(args[2] === 'off'){ // When they want to turn it off...
                message.channel.send(`Turned off quote channel.`); // Announce
                db.set(`quoteChannel_${message.guild.id}`, 0); // Set to a channel.
            }else if(!message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) { // If there is a mentioned channel but it doesnt exist
                errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
            }else{ // If a channel does exist
                message.channel.send('New channel set to ' + args[2] + ''); // Say new channel
                let qcID = args[2].slice(2, (args[2].length) - 1); // Set logchannelid
                qc = bot.channels.get(qcID); // set log channel
                db.set(`quoteChannel_${message.guild.id}`, qcID); // set logchannel in db to logchannelid
                qc.send('Quote channel set to here!'); // announce
            }
            break;

        case 'bu':
        case 'bot-updates': // If the user wants to edit the quotechannel
            let fbuca = await db.get(`botupChannel`);

            let fbuc
            if(!fbuca.guild.includes(message.guild.id)) {
                fbuc = null
            } else {
                fbuc = fbuca.channel[fbuca.guild.indexOf(message.guild.id)]
            }
            let buc;
            if (fbuc == null) buc = 0
            else buc = message.guild.channels.get(fbuc);
            if(!args[2]) { // If they want to see which the quotechannel is
                if(buc == 0){ // If logging channels is off
                    message.channel.send('Bot Updates channel is off.') // Say
                }else{ // If it isnt off
                    message.channel.send('Current bot updates channel set to ' + buc); // Announce log channel
                }
            }else if(args[2] === 'off'){ // When they want to turn it off...
                message.channel.send(`Turned off bot updates channel.`); // Announce
                if (fbuc == null) return
                fbuca.guild.splice(fbuca.guild.indexOf(message.guild.id), 1)
                fbuca.channel.splice(fbuca.guild.indexOf(message.guild.id), 1)
                db.set(`botupChannel`, { guild: fbuca.guild, channel: fbuca.channel }); // Set to a channel.
            }else if(!message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) { // If there is a mentioned channel but it doesnt exist
                errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
            }else{ // If a channel does exist
                message.channel.send('New channel set to ' + args[2] + ''); // Say new channel
                let bucID = args[2].slice(2, (args[2].length) - 1); // Set logchannelid
                buc = bot.channels.get(bucID); // set log channel
                if (fbuc != null){
                    fbuca.guild.splice(fbuca.guild.indexOf(message.guild.id), 1)
                    fbuca.channel.splice(fbuca.guild.indexOf(message.guild.id), 1)

                }
                fbuca.guild.push(message.guild.id)
                fbuca.channel.push(bucID)
                db.set(`botupChannel`, { guild: fbuca.guild, channel: fbuca.channel }); // set logchannel in db to logchannelid
                buc.send('Bot updates channel set to here!'); // announce
            }
            break;

        // case 'p':
        //     let e = await db.get(`botupChannel`);
        //     console.log(e)
        //     break;

        // case 'e':
        //     db.set(`botupChannel`, { guild: [], channel: [] });
        //     break;

        default: // If no permission to modify, complain
            errormsg.run(bot, message, args, "a", `\`Unspecified permission to modify!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}`)
            break;
    }
}

module.exports.config = {
    command: ["modify", "m"],
    permlvl: "Admin",
    help: ["Admin", "Modify a part of the bot.",
            "Admin", "[mod-role | admin-role | role-modify]", "List all roles with that permission.",
            "Admin", "[mod-role | admin-role | role-modify] [rolename]", "Adds/removes a role from that permission, depending on whether it is already in there.",
            "Admin", "[log-channel | quote-channel | bot-updates]", "Displays the current channel it is set to.",
            "Admin", "[log-channel | quote-channel | bot-updates] off", "Turns off logging/quoting/bot updates on the server.",
            "Admin", "[log-channel | quote-channel | bot-updates] [channelID]", "Sets the logging/quoting/bot updates channel to that channel ID."],
    helpg: "[mod-role | admin-role | role-modify | log-channel | quote-channel | bot-updates]"
}