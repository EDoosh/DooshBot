const db = require('quick.db');


module.exports.run = async (bot, message, args) => {
    function combineArgs(combineTo) { // Combines args
        for(i = combineTo + 1; i < args.length; i++) {
            args[combineTo] += ' ' + args[i];
        }
    }

    switch(args[1]) { // Checks for cases
        case 'mr':
        case 'mod-role': // If user wants to edit modrole
            combineArgs(2); // Combine everything after argument 2
            if(!args[2]) { // If there isn't an argument 2
                if(modrole.length === 0) { // If there isn't anything in modrole, say so
                    message.channel.send('No roles exist with mod-role permission in the bot!');
                }else{ // If there is stuff in modrole, say the roles
                    let modmessage = [];
                    for(i=0; i < modrole.length; i++){
                        let modcol = message.guild.roles.find(x => x.id == modrole[i])
                        if(!modcol) {modmessage.push(`**DELETED ROLE** (${modrole[i]})`); continue; }
                        modmessage.push(`${modcol.name} (${modrole[i]})`)
                    }
                    message.channel.send('Current roles with mod-role: ' + modmessage.join(', '));
                }
            }else if(modrole.includes(args[2])){ // If there is already that id in the modrole...
                modrole.splice(modrole.indexOf(args[2]), 1); // Remove it from modrole
                db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
                message.channel.send('The role `' + args[2] + '` has been removed from Moderator permissions for this bot!'); // Say its been removed
            }else{
                // Create collection of the role
                let modcol;
                if(message.guild.roles.find(x => x.id == args[2])) modcol = message.guild.roles.find(x => x.id == args[2])
                else if(message.guild.roles.find(x => x.name == args[2])) modcol = message.guild.roles.find(x => x.name == args[2])
                // Check if there is a role. If not, throw error.
                if(!modcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
                // Remove by name
                if(modrole.includes(modcol.id)) {
                    modrole.splice(modrole.indexOf(modcol.id), 1); // Remove it from modrole
                    db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
                    message.channel.send('The role `' + modcol.name + '` has been removed from Moderator permissions for this bot!'); // Say its been removed
                } else {
                    modrole.push(modcol.id); // Add it in to modrole
                    db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
                    message.channel.send('The role `' + modcol.name + '` now has Moderator permission for this bot!'); // Say its been added
                }
            }
            break;

        case 'ar':
        case 'admin-role': // Same structure as ModRole
            combineArgs(2); // Combine everything after argument 2
            if(!args[2]) { // If there isn't an argument 2
                if(adminrole.length === 0) { // If there isn't anything in modrole, say so
                    message.channel.send('No roles exist with admin-role permission in the bot!');
                }else{ // If there is stuff in modrole, say the roles
                    let adminmessage = [];
                    for(i=0; i < adminrole.length; i++){
                        let admincol = message.guild.roles.find(x => x.id == adminrole[i])
                        if(!admincol) {adminmessage.push(`**DELETED ROLE** (${adminrole[i]})`); continue; }
                        adminmessage.push(`${admincol.name} (${adminrole[i]})`)
                    }
                    message.channel.send('Current roles with admin-role: ' + adminmessage.join(', '));
                }
            }else if(adminrole.includes(args[2])){ // If there is already that id in the modrole...
                adminrole.splice(adminrole.indexOf(args[2]), 1); // Remove it from modrole
                db.set(`adminrole_${message.guild.id}`, adminrole); // Set the new modrole into the database
                message.channel.send('The role `' + args[2] + '` has been removed from Admin permissions for this bot!'); // Say its been removed
            }else{
                // Create collection of the role
                let admincol;
                if(message.guild.roles.find(x => x.id == args[2])) admincol = message.guild.roles.find(x => x.id == args[2])
                else if(message.guild.roles.find(x => x.name == args[2])) admincol = message.guild.roles.find(x => x.name == args[2])
                // Check if there is a role. If not, throw error.
                if(!admincol) return message.channel.send('The role `' + args[2] + '` does not exist!');
                // Remove by name
                if(adminrole.includes(admincol.id)) {
                    adminrole.splice(adminrole.indexOf(admincol.id), 1); // Remove it from modrole
                    db.set(`adminrole_${message.guild.id}`, adminrole); // Set the new modrole into the database
                    message.channel.send('The role `' + admincol.name + '` has been removed from Admin permissions for this bot!'); // Say its been removed
                } else {
                    adminrole.push(admincol.id); // Add it in to modrole
                    db.set(`adminrole_${message.guild.id}`, adminrole); // Set the new modrole into the database
                    message.channel.send('The role `' + admincol.name + '` now has Admin permission for this bot!'); // Say its been added
                }
            }
            break;

        case 'rm':
        case 'role-modify': // Same structure as ModRole
            combineArgs(2); // Combine everything after argument 2
            if(!args[2]) { // If there isn't an argument 2
                if(rmrole.length === 0) { // If there isn't anything in modrole, say so
                    message.channel.send('No roles exist with role-modify permission in the bot!');
                }else{ // If there is stuff in modrole, say the roles
                    let rmmessage = [];
                    for(i=0; i < rmrole.length; i++){
                        let rmcol = message.guild.roles.find(x => x.id == rmrole[i])
                        if(!rmcol) {rmmessage.push(`**DELETED ROLE** (${rmrole[i]})`); continue; }
                        rmmessage.push(`${rmcol.name} (${rmrole[i]})`)
                    }
                    message.channel.send('Current roles with role-modify: ' + rmmessage.join(', '));
                }
            }else if(rmrole.includes(args[2])){ // If there is already that id in the modrole...
                rmrole.splice(rmrole.indexOf(args[2]), 1); // Remove it from modrole
                db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
                message.channel.send('The role `' + args[2] + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
            }else{
                // Create collection of the role
                let rmcol;
                if(message.guild.roles.find(x => x.id == args[2])) rmcol = message.guild.roles.find(x => x.id == args[2])
                else if(message.guild.roles.find(x => x.name == args[2])) rmcol = message.guild.roles.find(x => x.name == args[2])
                // Check if there is a role. If not, throw error.
                if(!rmcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
                // Remove by name
                if(rmrole.includes(rmcol.id)) {
                    rmrole.splice(rmrole.indexOf(rmcol.id), 1); // Remove it from modrole
                    db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
                    message.channel.send('The role `' + rmcol.name + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
                } else {
                    rmrole.push(rmcol.id); // Add it in to modrole
                    db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
                    message.channel.send('The role `' + rmcol.name + '` now has Role Modify permission for this bot!'); // Say its been added
                }
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
            }else {
                let listcol;
                if(message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))
                else if(message.guild.channels.find(channel => channel.id == args[2])) listcol = message.guild.channels.find(channel => channel.id == args[2])
                else if(message.guild.channels.find(channel => channel.name == args[2])) listcol = message.guild.channels.find(channel => channel.name == args[2])

                if(!listcol) { // If there is a mentioned channel but it doesnt exist
                    errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
                }else{ // If a channel does exist
                    message.channel.send('New channel set to <#' + listcol.id + '>'); // Say new channel
                    let logChanID = listcol.id; // Set logchannelid
                    logChannel = bot.channels.get(logChanID); // set log channel
                    db.set(`logChannel_${message.guild.id}`, logChanID); // set logchannel in db to logchannelid
                    logChannel.send('Log channel set to here!'); // announce
                }
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
            }else {
                let listcol;
                if(message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))
                else if(message.guild.channels.find(channel => channel.id == args[2])) listcol = message.guild.channels.find(channel => channel.id == args[2])
                else if(message.guild.channels.find(channel => channel.name == args[2])) listcol = message.guild.channels.find(channel => channel.name == args[2])

                if(!listcol) { // If there is a mentioned channel but it doesnt exist
                    errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
                }else{ // If a channel does exist
                    message.channel.send('New channel set to <#' + listcol.id + '>'); // Say new channel
                    let qcID = listcol.id; // Set logchannelid
                    qc = bot.channels.get(qcID); // set log channel
                    db.set(`quoteChannel_${message.guild.id}`, qcID); // set logchannel in db to logchannelid
                    qc.send('Quote channel set to here!'); // announce
                }
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
            }else {
                let listcol;
                if(message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))
                else if(message.guild.channels.find(channel => channel.id == args[2])) listcol = message.guild.channels.find(channel => channel.id == args[2])
                else if(message.guild.channels.find(channel => channel.name == args[2])) listcol = message.guild.channels.find(channel => channel.name == args[2])

                if(!listcol) { // If there is a mentioned channel but it doesnt exist
                    errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
                }else{ // If a channel does exist
                    message.channel.send('New channel set to <#' + listcol.id + '>'); // Say new channel
                    let bucID = listcol.id; // Set logchannelid
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
            "Admin", "[mod-role | admin-role | role-modify] [rolename | roleid]", "Adds/removes a role from that permission, depending on whether it is already in there.",
            "Admin", "[log-channel | quote-channel | bot-updates]", "Displays the current channel it is set to.",
            "Admin", "[log-channel | quote-channel | bot-updates] off", "Turns off logging/quoting/bot updates on the server.",
            "Admin", "[log-channel | quote-channel | bot-updates] [channelID | channelMention | channelName]", "Sets the logging/quoting/bot updates channel to that channel ID."],
    helpg: "[mod-role | admin-role | role-modify | log-channel | quote-channel | bot-updates]"
}