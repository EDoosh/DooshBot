const db = require('quick.db');
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    function combineArgs(combineTo) { // Combines args
        for(i = combineTo + 1; i < args.length; i++) {
            args[combineTo] += ' ' + args[i];
        }
    }

    // Retriev info
	let fdj = await db.get(`djrole_${message.guild.id}`);
    let fmban = await db.get(`mbanrole_${message.guild.id}`);
    let fqc = await db.get(`quoteChannel_${message.guild.id}`);
    let fbuc = await db.get(`botupChannel`);
    let botupID = fbuc.guild.indexOf(message.guild.id)

    let modifySubs = {
        "array": [{
            "title" : "Administrator",
            "desc" : "The roles with the Administrator DooshBot permission, which allows access to all staff commands.",
            "dbpre" : "adminrole",
            "type" : "role",
            "value" : adminrole
        }, {
            "title" : "Moderator",
            "desc" : "The roles with the Moderator DooshBot permission, which allows access to a lot of staff commands.",
            "dbpre" : "modrole",
            "type" : "role",
            "value" : modrole
        }, {
            "title" : "Role Modify",
            "desc" : "The roles with the Role Modify permission, which allows users to create and edit their own custom roles.",
            "dbpre" : "rmrole",
            "type" : "role",
            "value" : rmrole
        }, {
            "title" : "DJ",
            "desc" : "The roles with the DJ permission, which allows access to all music-related commands.",
            "dbpre" : "mbanrole",
            "type" : "role",
            "value" : (fdj == null) ? [] : fdj
        }, {
            "title" : "Music Ban",
            "desc" : "The roles with the Music Ban permission, which denies access to most music-related commands.",
            "dbpre" : "djrole",
            "type" : "role",
            "value" : (fmban === null) ? [] : fmban
        }, {
            "title" : "Log Channel",
            "desc" : "The Log Channel, which all staff related commands will be sent to.",
            "dbpre" : "logChannel",
            "type" : "channel",
            "value" : logChannel
        }, {
            "title" : "Quote Channel",
            "desc" : "The Quote Channel, which all quoted messages will be sent to.",
            "dbpre" : "quoteChannel",
            "type" : "channel",
            "value" : (fqc == null || fqc == 0) ? 0 : message.guild.channels.get(fqc)
        }, {
            "title" : "Bot Updates Channel",
            "desc" : "The Bot Updates Channel, which all DooshBot related messages will be sent to.",
            "dbpre" : "botupChannel",
            "type" : "channel",
            "value" : (botupID === -1) ? 0 : message.guild.channels.get(fbuc.channel[botupID])
        }]
    }

    // Set all the emojis that it can be reacted with
    var reactions = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3"/*,"\u0039\u20E3"*/]
    // Create a new embed with these properties
    let embedAll = new Discord.RichEmbed().setTitle(`Permission and Channel Setup`).setDescription(`React with a number to change a value.\nReact with a 0 to cancel the selection.`).setColor(0x2599f7)
    // For the length of the json we created earlier, add a new field with the sub-command's information
    let cursetto = [];
    for(i=0; i < modifySubs.array.length; i++) {
        let item = modifySubs.array[i]
        let newcursetto = [];

        if(item.type == 'role') {
            if(item.value.length === 0) {
                newcursetto[0] = `No roles exist with ${item.title} permission in the bot!`;
            }else{
                for(j=0; j < item.value.length; j++){
                    let retreiverole = await message.guild.roles.find(x => x.id == item.value[j])
                    if(!retreiverole) {newcursetto.push(`**DELETED ROLE** (${item.value[j]})`); continue; }
                    newcursetto.push(`${retreiverole.name} (${item.value[j]})`)
                }
            }
        } else {
            if(item.value === 0) {
                newcursetto[0] = `${item.type} is set to off!`;
            }else{
                if(item.value === 0) newcursetto.push(`**DELETED CHANNEL**`)
                else newcursetto.push(`#${item.value.name} (${item.value.id})`)
            }
        }

        embedAll.addField(`${reactions[i+1]} ⠀⠀${item.title}`, `${item.desc}\n*\`${newcursetto.join('\n')}\`*`);
        cursetto.push(newcursetto)
    }

    // Send the message and let embedmsg be the message
    let embedmsg = await message.channel.send(embedAll);
    // Create a filter for the following that returns true only if it reactor is the person who ran -=c, and that it is an allowed reaction.
    const filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
    }
    // Create a reaction collector that gets all reactions that are reacted on the previous message for 10 seconds, as long as it complies with the filter.
    var reactcollector = embedmsg.createReactionCollector(filter, { max: 1, time: 20000, errors: ['time'] })
    // When the message is reacted on...
    reactcollector.on('collect', async resp => {
        // Set reaction to the name of the reaction
        const reaction = resp.emoji.name
        // Set switch to the name of the reaction
        switch(reaction) {
            case '0⃣': // If they wish to cancel, then cancel.
                return message.channel.send('Cancelled Modify selection.')
            case '1⃣': // If they want one of the options, set the ID of the subcommand to its location in the reactions array - 1
            case '2⃣':
            case '3⃣':
            case '4⃣':
            case '5⃣':
            case '6⃣':
            case '7⃣':
            case '8⃣':
            case '9⃣':
                var subCmd = modifySubs.array[reactions.indexOf(reaction) - 1];
                break;
            case 'default': // If none of the above, then idk wtf happened.
                return message.channel.send('An issue occured while trying to register what the fuck you just did.');
        }
        // Delete the old embed message
        embedmsg.delete();
        // Create a new one with the subcommands name, desc, cur value, and what it wants.
        let embedval = new Discord.RichEmbed()
            .setTitle(subCmd.title)
            .setDescription(`${subCmd.desc}\n*Currently set to \n\`${cursetto[reactions.indexOf(reaction) - 1].join('\n')}\`*\n**Please type a ${subCmd.type}Representable to set a new value.**`)
            .setColor(0x10e851)
        // Then send it
        let valmsg = await message.channel.send(embedval)
        // New filter for below. If it wants a number, make sure it is a number. If it wants a T/F, make sure it is a T/F. Also make sure it is sent by the original person.
        let filterVal = (pmsg) => {
            if(pmsg.author.id !== message.author.id) {
                return false;
            }
            if(subCmd.type == 'role') {
                // If it can find something with that ID in modrole, something with that ID in the server, or something with that name in the server, it returns true
                return (subCmd.value.includes(pmsg.content)) || (message.guild.roles.find(x => x.id == pmsg.content)) || (message.guild.roles.find(x => x.name == pmsg.content));
            } else {
                // If the user types 'off', a channel is mentioned, a channel id is said, or a channel name is said, it returns true.
                return (pmsg.content == 'off') || (message.guild.channels.find(channel => channel.id == pmsg.content.slice(2, (pmsg.content.length) - 1))) || (message.guild.channels.find(channel => channel.id == pmsg.content)) || (message.guild.channels.find(channel => channel.name == pmsg.content));
            }
        }
        // Await a message which complies with the above and is sent within 20 seconds. If there isn't one, show error.
        try {
            var newval = await message.channel.awaitMessages(filterVal, {
                maxMatches:1,
                time: 20000,
                errors: ['time']
            })
        } catch (err) {
            valmsg.delete();
            return message.channel.send(`Modify value set timed out. Cancelled new value set.`)
        }
        valmsg.delete();
        try { newval.first().delete(); } catch { console.log('') };
        let content = newval.first().content;
        if(subCmd.type == 'role') {
            if(subCmd.value.includes(content)){
                subCmd.value.splice(subCmd.value.indexOf(content), 1);
                db.set(`${subCmd.dbpre}_${message.guild.id}`, subCmd.value);
                message.channel.send(`The role \`${content}\` has been removed from ${subCmd.title} permissions for this bot!`);
            }else{
                // Create collection of the role
                let rolecol;
                if(message.guild.roles.find(x => x.id == content)) rolecol = message.guild.roles.find(x => x.id == content)
                else if(message.guild.roles.find(x => x.name == content)) rolecol = message.guild.roles.find(x => x.name == content)
                // Check if there is a role. If not, throw error.
                if(!rolecol) return message.channel.send(`The role \`${content}\` does not exist!`);
                // Remove by name
                if(subCmd.value.includes(rolecol.id)) {
                    subCmd.value.splice(subCmd.value.indexOf(rolecol.id), 1);
                    db.set(`${subCmd.dbpre}_${message.guild.id}`, subCmd.value);
                    message.channel.send(`The role \`${rolecol.name}\` has been removed from ${subCmd.title} permissions for this bot!`);
                } else {
                    subCmd.value.push(rolecol.id);
                    db.set(`${subCmd.dbpre}_${message.guild.id}`, subCmd.value);
                    message.channel.send(`The role \`${rolecol.name}\` now has ${subCmd.title} permission for this bot!`);
                }
            }
        } else {
            if(content === 'off'){ // When they want to turn it off...
                if(reactions.indexOf(reaction) - 1 === 8) { // If it is Bot Updates Channel
                    if (subCmd.value === 0) return
                    fbuc.guild.splice(botupID, 1)
                    fbuc.channel.splice(botupID, 1)
                    db.set(`botupChannel`, { guild: fbuc.guild, channel: fbuc.channel });
                } else {
                    db.set(`${subCmd.dbpre}_${message.guild.id}`, 0);
                }
                message.channel.send(`Turned off ${subCmd.title}`); // Announce
            } else {
                let chancol;
                if(message.guild.channels.find(channel => channel.id == content.slice(2, (content.length) - 1))) chancol = message.guild.channels.find(channel => channel.id == content.slice(2, (content.length) - 1))
                else if(message.guild.channels.find(channel => channel.id == content)) chancol = message.guild.channels.find(channel => channel.id == content)
                else if(message.guild.channels.find(channel => channel.name == content)) chancol = message.guild.channels.find(channel => channel.name == content)

                if(!chancol) { // If there is a mentioned channel but it doesnt exist
                    message.channel.send(`The channel \`${content}\` does not exist!`);; // Complain the channel doesnt exist
                }else{ // If a channel does exist
                    message.channel.send(`New channel set to <#${chancol.id}>`); // Say new channel
                    let chanID = chancol.id; // Set logchannelid
                    newChannel = bot.channels.get(chanID); // set log channel
                    if(reactions.indexOf(reaction) - 1 === 8) { // If it is Bot Updates Channel
                        if (subCmd.value !== 0){
                            fbuca.guild.splice(botupID, 1)
                            fbuca.channel.splice(botupID, 1)
                        }
                        fbuc.guild.push(message.guild.id)
                        fbuc.channel.push(chanID)
                        db.set(`botupChannel`, { guild: fbuc.guild, channel: fbuc.channel }); // set logchannel in db to logchannelid
                    } else {
                        db.set(`${subCmd.dbpre}_${message.guild.id}`, chanID); // set logchannel in db to logchannelid
                    }
                    newChannel.send(`${subCmd.title} set to this location!`); // announce
                }
            }
        }
    })

    // If the message was never reacted on when the time runs out...
    reactcollector.on('end', collected => {
        if(collected.size != 0) return;
        // Delete the message and say so
        embedmsg.delete();
        message.channel.send(`Modify selection timed out. Cancelled selection.`)
    })

    // React on the server config message. Do this here so that, if a user reacts while the bot is still reacting, it still runs the reactcollector
    for(i=0; i <= modifySubs.array.length; i++) {
        try {
            await embedmsg.react(reactions[i])
        } catch {
            break;
        }
    }





    // switch(args[1]) { // Checks for cases
    //     case 'mr':
    //     case 'mod-role': // If user wants to edit modrole
    //         combineArgs(2); // Combine everything after argument 2
    //         if(!args[2]) { // If there isn't an argument 2
    //             if(modrole.length === 0) { // If there isn't anything in modrole, say so
    //                 message.channel.send('No roles exist with mod-role permission in the bot!');
    //             }else{ // If there is stuff in modrole, say the roles
    //                 let modmessage = [];
    //                 for(i=0; i < modrole.length; i++){
    //                     let modcol = message.guild.roles.find(x => x.id == modrole[i])
    //                     if(!modcol) {modmessage.push(`**DELETED ROLE** (${modrole[i]})`); continue; }
    //                     modmessage.push(`${modcol.name} (${modrole[i]})`)
    //                 }
    //                 message.channel.send('Current roles with mod-role: ' + modmessage.join(', '));
    //             }
    //         }else if(modrole.includes(args[2])){ // If there is already that id in the modrole...
    //             modrole.splice(modrole.indexOf(args[2]), 1); // Remove it from modrole
    //             db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
    //             message.channel.send('The role `' + args[2] + '` has been removed from Moderator permissions for this bot!'); // Say its been removed
    //         }else{
    //             // Create collection of the role
    //             let modcol;
    //             if(message.guild.roles.find(x => x.id == args[2])) modcol = message.guild.roles.find(x => x.id == args[2])
    //             else if(message.guild.roles.find(x => x.name == args[2])) modcol = message.guild.roles.find(x => x.name == args[2])
    //             // Check if there is a role. If not, throw error.
    //             if(!modcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
    //             // Remove by name
    //             if(modrole.includes(modcol.id)) {
    //                 modrole.splice(modrole.indexOf(modcol.id), 1); // Remove it from modrole
    //                 db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + modcol.name + '` has been removed from Moderator permissions for this bot!'); // Say its been removed
    //             } else {
    //                 modrole.push(modcol.id); // Add it in to modrole
    //                 db.set(`modrole_${message.guild.id}`, modrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + modcol.name + '` now has Moderator permission for this bot!'); // Say its been added
    //             }
    //         }
    //         break;

    //     case 'ar':
    //     case 'admin-role': // Same structure as ModRole
    //         combineArgs(2); // Combine everything after argument 2
    //         if(!args[2]) { // If there isn't an argument 2
    //             if(adminrole.length === 0) { // If there isn't anything in modrole, say so
    //                 message.channel.send('No roles exist with admin-role permission in the bot!');
    //             }else{ // If there is stuff in modrole, say the roles
    //                 let adminmessage = [];
    //                 for(i=0; i < adminrole.length; i++){
    //                     let admincol = message.guild.roles.find(x => x.id == adminrole[i])
    //                     if(!admincol) {adminmessage.push(`**DELETED ROLE** (${adminrole[i]})`); continue; }
    //                     adminmessage.push(`${admincol.name} (${adminrole[i]})`)
    //                 }
    //                 message.channel.send('Current roles with admin-role: ' + adminmessage.join(', '));
    //             }
    //         }else if(adminrole.includes(args[2])){ // If there is already that id in the modrole...
    //             adminrole.splice(adminrole.indexOf(args[2]), 1); // Remove it from modrole
    //             db.set(`adminrole_${message.guild.id}`, adminrole); // Set the new modrole into the database
    //             message.channel.send('The role `' + args[2] + '` has been removed from Admin permissions for this bot!'); // Say its been removed
    //         }else{
    //             // Create collection of the role
    //             let admincol;
    //             if(message.guild.roles.find(x => x.id == args[2])) admincol = message.guild.roles.find(x => x.id == args[2])
    //             else if(message.guild.roles.find(x => x.name == args[2])) admincol = message.guild.roles.find(x => x.name == args[2])
    //             // Check if there is a role. If not, throw error.
    //             if(!admincol) return message.channel.send('The role `' + args[2] + '` does not exist!');
    //             // Remove by name
    //             if(adminrole.includes(admincol.id)) {
    //                 adminrole.splice(adminrole.indexOf(admincol.id), 1); // Remove it from modrole
    //                 db.set(`adminrole_${message.guild.id}`, adminrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + admincol.name + '` has been removed from Admin permissions for this bot!'); // Say its been removed
    //             } else {
    //                 adminrole.push(admincol.id); // Add it in to modrole
    //                 db.set(`adminrole_${message.guild.id}`, adminrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + admincol.name + '` now has Admin permission for this bot!'); // Say its been added
    //             }
    //         }
    //         break;

    //     case 'rm':
    //     case 'role-modify': // Same structure as ModRole
    //         combineArgs(2); // Combine everything after argument 2
    //         if(!args[2]) { // If there isn't an argument 2
    //             if(rmrole.length === 0) { // If there isn't anything in modrole, say so
    //                 message.channel.send('No roles exist with role-modify permission in the bot!');
    //             }else{ // If there is stuff in modrole, say the roles
    //                 let rmmessage = [];
    //                 for(i=0; i < rmrole.length; i++){
    //                     let rmcol = message.guild.roles.find(x => x.id == rmrole[i])
    //                     if(!rmcol) {rmmessage.push(`**DELETED ROLE** (${rmrole[i]})`); continue; }
    //                     rmmessage.push(`${rmcol.name} (${rmrole[i]})`)
    //                 }
    //                 message.channel.send('Current roles with role-modify: ' + rmmessage.join(', '));
    //             }
    //         }else if(rmrole.includes(args[2])){ // If there is already that id in the modrole...
    //             rmrole.splice(rmrole.indexOf(args[2]), 1); // Remove it from modrole
    //             db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
    //             message.channel.send('The role `' + args[2] + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
    //         }else{
    //             // Create collection of the role
    //             let rmcol;
    //             if(message.guild.roles.find(x => x.id == args[2])) rmcol = message.guild.roles.find(x => x.id == args[2])
    //             else if(message.guild.roles.find(x => x.name == args[2])) rmcol = message.guild.roles.find(x => x.name == args[2])
    //             // Check if there is a role. If not, throw error.
    //             if(!rmcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
    //             // Remove by name
    //             if(rmrole.includes(rmcol.id)) {
    //                 rmrole.splice(rmrole.indexOf(rmcol.id), 1); // Remove it from modrole
    //                 db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + rmcol.name + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
    //             } else {
    //                 rmrole.push(rmcol.id); // Add it in to modrole
    //                 db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + rmcol.name + '` now has Role Modify permission for this bot!'); // Say its been added
    //             }
    //         }
    //         break;
            
    //     case 'lr':
    //     case 'levelroles': // Same structure as ModRole
    //         combineArgs(3); // Combine everything after argument 3

    //         // Get lr roles
    //         // -=m lr (lr.length == 0)  nothing exists with that
    //         // -=m lr (otherwise)  Lvl __ Name __
    //         // -=m lr _ __ (already exists) Remove and push
    //         // -=m lr _ __ (new) Add and push

    //         let lr = db.get(`lr_${message.guild.id}`)
    //         // lvls & ids

    //         if(!args[2]) { 
    //             if(lr.lvls.length == 0) {
    //                 message.channel.send(`No level roles exist within the bot!`)
    //             } else {
    //                 let lrmessage = [];
    //                 for(i=0; i < lr.lvls.length; i++) {
    //                     let lrcol = message.guild.roles.find(x => x.id == lr.ids[i])
    //                     if(!lrcol) {lrmessage.push(`\n> Level ${lr.lvls[i]}\u2800⬥\u2800**DELETED ROLE** (${lr.ids[i]})`); continue; }
    //                     lrmessage.push(`\n> Level ${lr.lvls[i]}\u2800⬥\u2800${lrcol.name} (${lrcol.id})`)
    //                 }
    //                 message.channel.send(`Current level roles:${lrmessage.join('')}`)
    //             }
    //         } else if (lr.ids.includes(args[3])) {
    //             lr.ids.splice(lr.ids.indexOf(args[3]), 1)
    //             lr.lvls.splice(lr.ids.indexOf(args[3]), 1)
    //             db.set(`lr_${message.guild.id}.ids`, lr.ids);
    //             db.set(`lr_${message.guild.id}.lvls`, lr.lvls);
    //             message.channel.send(`The role \`${args[2]}\` has been removed from `)
    //         }

    //         if(!args[2]) { // If there isn't an argument 2
    //             if(lr.length === 0) { // If there isn't anything in modrole, say so
    //                 message.channel.send('No roles exist with role-modify permission in the bot!');
    //             }else{ // If there is stuff in modrole, say the roles
    //                 let rmmessage = [];
    //                 for(i=0; i < rmrole.length; i++){
    //                     let rmcol = message.guild.roles.find(x => x.id == rmrole[i])
    //                     if(!rmcol) {rmmessage.push(`**DELETED ROLE** (${rmrole[i]})`); continue; }
    //                     rmmessage.push(`${rmcol.name} (${rmrole[i]})`)
    //                 }
    //                 message.channel.send('Current roles with role-modify: ' + rmmessage.join(', '));
    //             }
    //         }else if(rmrole.includes(args[2])){ // If there is already that id in the modrole...
    //             rmrole.splice(rmrole.indexOf(args[2]), 1); // Remove it from modrole
    //             db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
    //             message.channel.send('The role `' + args[2] + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
    //         }else{
    //             // Create collection of the role
    //             let rmcol;
    //             if(message.guild.roles.find(x => x.id == args[2])) rmcol = message.guild.roles.find(x => x.id == args[2])
    //             else if(message.guild.roles.find(x => x.name == args[2])) rmcol = message.guild.roles.find(x => x.name == args[2])
    //             // Check if there is a role. If not, throw error.
    //             if(!rmcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
    //             // Remove by name
    //             if(rmrole.includes(rmcol.id)) {
    //                 rmrole.splice(rmrole.indexOf(rmcol.id), 1); // Remove it from modrole
    //                 db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + rmcol.name + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
    //             } else {
    //                 rmrole.push(rmcol.id); // Add it in to modrole
    //                 db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + rmcol.name + '` now has Role Modify permission for this bot!'); // Say its been added
    //             }
    //         }
    //         break;

    //     case 'mb':
    //     case 'musicban': // Same structure as ModRole
    //         let fmbrole = await db.get(`mbanrole_${message.guild.id}`)
    //         let mbrole = fmbrole ? fmbrole : []
    //         combineArgs(2); // Combine everything after argument 2
    //         if(!args[2]) { // If there isn't an argument 2
    //             if(mbrole.length === 0) { // If there isn't anything in modrole, say so
    //                 message.channel.send('No roles exist with Music Ban in the bot!');
    //             }else{ // If there is stuff in modrole, say the roles
    //                 let mbanmessage = [];
    //                 for(i=0; i < mbrole.length; i++){
    //                     let mbcol = message.guild.roles.find(x => x.id == mbrole[i])
    //                     if(!mbcol) {mbanmessage.push(`**DELETED ROLE** (${mbrole[i]})`); continue; }
    //                     mbanmessage.push(`${mbcol.name} (${mbrole[i]})`)
    //                 }
    //                 message.channel.send('Current roles with musicban: ' + mbanmessage.join(', '));
    //             }
    //         }else if(mbrole.includes(args[2])){ // If there is already that id in the modrole...
    //             mbrole.splice(mbrole.indexOf(args[2]), 1); // Remove it from modrole
    //             db.set(`mbanrole_${message.guild.id}`, mbrole); // Set the new modrole into the database
    //             message.channel.send('The role `' + args[2] + '` has been removed from Music Ban for this bot!'); // Say its been removed
    //         }else{
    //             // Create collection of the role
    //             let mbcol;
    //             if(message.guild.roles.find(x => x.id == args[2])) mbcol = message.guild.roles.find(x => x.id == args[2])
    //             else if(message.guild.roles.find(x => x.name == args[2])) mbcol = message.guild.roles.find(x => x.name == args[2])
    //             // Check if there is a role. If not, throw error.
    //             if(!mbcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
    //             // Remove by name
    //             if(mbrole.includes(mbcol.id)) {
    //                 mbrole.splice(mbrole.indexOf(mbcol.id), 1); // Remove it from modrole
    //                 db.set(`mbanrole_${message.guild.id}`, mbrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + mbcol.name + '` has been removed from Music Ban for this bot!'); // Say its been removed
    //             } else {
    //                 mbrole.push(mbcol.id); // Add it in to modrole
    //                 db.set(`mbanrole_${message.guild.id}`, mbrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + mbcol.name + '` now has Music Ban for this bot!'); // Say its been added
    //             }
    //         }
    //         break;

    //     case 'dj':
    //     case 'dj-role': // Same structure as ModRole
    //         let fdjrole = await db.get(`djrole_${message.guild.id}`)
    //         let djrole = fdjrole ? fdjrole : []
    //         combineArgs(2); // Combine everything after argument 2
    //         if(!args[2]) { // If there isn't an argument 2
    //             if(djrole.length === 0) { // If there isn't anything in modrole, say so
    //                 message.channel.send('No roles exist with DJ permissions in the bot!');
    //             }else{ // If there is stuff in modrole, say the roles
    //                 let djmessage = [];
    //                 for(i=0; i < djrole.length; i++){
    //                     let djcol = message.guild.roles.find(x => x.id == djrole[i])
    //                     if(!djcol) {djmessage.push(`**DELETED ROLE** (${djrole[i]})`); continue; }
    //                     djmessage.push(`${djcol.name} (${djrole[i]})`)
    //                 }
    //                 message.channel.send('Current roles with DJ: ' + djmessage.join(', '));
    //             }
    //         }else if(djrole.includes(args[2])){ // If there is already that id in the modrole...
    //             djrole.splice(djrole.indexOf(args[2]), 1); // Remove it from modrole
    //             db.set(`djrole_${message.guild.id}`, djrole); // Set the new modrole into the database
    //             message.channel.send('The role `' + args[2] + '` has been removed from DJ permissions for this bot!'); // Say its been removed
    //         }else{
    //             // Create collection of the role
    //             let djcol;
    //             if(message.guild.roles.find(x => x.id == args[2])) djcol = message.guild.roles.find(x => x.id == args[2])
    //             else if(message.guild.roles.find(x => x.name == args[2])) djcol = message.guild.roles.find(x => x.name == args[2])
    //             // Check if there is a role. If not, throw error.
    //             if(!djcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
    //             // Remove by name
    //             if(djrole.includes(djcol.id)) {
    //                 djrole.splice(djrole.indexOf(djcol.id), 1); // Remove it from modrole
    //                 db.set(`djrole_${message.guild.id}`, djrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + djcol.name + '` has been removed from DJ permissions for this bot!'); // Say its been removed
    //             } else {
    //                 djrole.push(djcol.id); // Add it in to modrole
    //                 db.set(`djrole_${message.guild.id}`, djrole); // Set the new modrole into the database
    //                 message.channel.send('The role `' + djcol.name + '` now has DJ permissions for this bot!'); // Say its been added
    //             }
    //         }
    //         break;

    //     case 'lc':
    //     case 'log-channel': // If the user wants to edit the logchannel
    //         if(!args[2]) { // If they want to see which the logchannel is
    //             if(logChannel == 0){ // If logging channels is off
    //                 message.channel.send('Logging channel is off.') // Say
    //             }else{ // If it isnt off
    //                 message.channel.send('Current log channel set to <#' + logChannel + '>'); // Announce log channel
    //             }
    //         }else if(args[2] === 'off'){ // When they want to turn it off...
    //             message.channel.send(`Turned off logging channels`); // Announce
    //             db.set(`logChannel_${message.guild.id}`, 0); // Set to a channel.
    //         }else {
    //             let listcol;
    //             if(message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))
    //             else if(message.guild.channels.find(channel => channel.id == args[2])) listcol = message.guild.channels.find(channel => channel.id == args[2])
    //             else if(message.guild.channels.find(channel => channel.name == args[2])) listcol = message.guild.channels.find(channel => channel.name == args[2])

    //             if(!listcol) { // If there is a mentioned channel but it doesnt exist
    //                 errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
    //             }else{ // If a channel does exist
    //                 message.channel.send('New channel set to <#' + listcol.id + '>'); // Say new channel
    //                 let logChanID = listcol.id; // Set logchannelid
    //                 logChannel = bot.channels.get(logChanID); // set log channel
    //                 db.set(`logChannel_${message.guild.id}`, logChanID); // set logchannel in db to logchannelid
    //                 logChannel.send('Log channel set to here!'); // announce
    //             }
    //         }
    //         break;

    //     case 'qc':
    //     case 'quote-channel': // If the user wants to edit the quotechannel
    //         let fqc = await db.get(`quoteChannel_${message.guild.id}`);
    //         let qc;
    //         if (fqc == null || fqc == 0) qc = 0
    //         else qc = message.guild.channels.get(fqc);
    //         if(!args[2]) { // If they want to see which the quotechannel is
    //             if(qc == 0){ // If logging channels is off
    //                 message.channel.send('Quote channel is off.') // Say
    //             }else{ // If it isnt off
    //                 message.channel.send('Current quote channel set to ' + qc); // Announce log channel
    //             }
    //         }else if(args[2] === 'off'){ // When they want to turn it off...
    //             message.channel.send(`Turned off quote channel.`); // Announce
    //             db.set(`quoteChannel_${message.guild.id}`, 0); // Set to a channel.
    //         }else {
    //             let listcol;
    //             if(message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))
    //             else if(message.guild.channels.find(channel => channel.id == args[2])) listcol = message.guild.channels.find(channel => channel.id == args[2])
    //             else if(message.guild.channels.find(channel => channel.name == args[2])) listcol = message.guild.channels.find(channel => channel.name == args[2])

    //             if(!listcol) { // If there is a mentioned channel but it doesnt exist
    //                 errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
    //             }else{ // If a channel does exist
    //                 message.channel.send('New channel set to <#' + listcol.id + '>'); // Say new channel
    //                 let qcID = listcol.id; // Set logchannelid
    //                 qc = bot.channels.get(qcID); // set log channel
    //                 db.set(`quoteChannel_${message.guild.id}`, qcID); // set logchannel in db to logchannelid
    //                 qc.send('Quote channel set to here!'); // announce
    //             }
    //         }
    //         break;

    //     case 'bu':
    //     case 'bot-updates': // If the user wants to edit the quotechannel
    //         let fbuca = await db.get(`botupChannel`);

    //         let fbuc
    //         if(!fbuca.guild.includes(message.guild.id)) {
    //             fbuc = null
    //         } else {
    //             fbuc = fbuca.channel[fbuca.guild.indexOf(message.guild.id)]
    //         }
    //         let buc;
    //         if (fbuc == null) buc = 0
    //         else buc = message.guild.channels.get(fbuc);
    //         if(!args[2]) { // If they want to see which the quotechannel is
    //             if(buc == 0){ // If logging channels is off
    //                 message.channel.send('Bot Updates channel is off.') // Say
    //             }else{ // If it isnt off
    //                 message.channel.send('Current bot updates channel set to ' + buc); // Announce log channel
    //             }
    //         }else if(args[2] === 'off'){ // When they want to turn it off...
    //             message.channel.send(`Turned off bot updates channel.`); // Announce
    //             if (fbuc == null) return
    //             fbuca.guild.splice(fbuca.guild.indexOf(message.guild.id), 1)
    //             fbuca.channel.splice(fbuca.guild.indexOf(message.guild.id), 1)
    //             db.set(`botupChannel`, { guild: fbuca.guild, channel: fbuca.channel }); // Set to a channel.
    //         }else {
    //             let listcol;
    //             if(message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[2].slice(2, (args[2].length) - 1))
    //             else if(message.guild.channels.find(channel => channel.id == args[2])) listcol = message.guild.channels.find(channel => channel.id == args[2])
    //             else if(message.guild.channels.find(channel => channel.name == args[2])) listcol = message.guild.channels.find(channel => channel.name == args[2])

    //             if(!listcol) { // If there is a mentioned channel but it doesnt exist
    //                 errormsg.run(bot, message, args, 3, "Channel does not exist"); // Complain the channel doesnt exist
    //             }else{ // If a channel does exist
    //                 message.channel.send('New channel set to <#' + listcol.id + '>'); // Say new channel
    //                 let bucID = listcol.id; // Set logchannelid
    //                 buc = bot.channels.get(bucID); // set log channel
    //                 if (fbuc != null){
    //                     fbuca.guild.splice(fbuca.guild.indexOf(message.guild.id), 1)
    //                     fbuca.channel.splice(fbuca.guild.indexOf(message.guild.id), 1)
    //                 }
    //                 fbuca.guild.push(message.guild.id)
    //                 fbuca.channel.push(bucID)
    //                 db.set(`botupChannel`, { guild: fbuca.guild, channel: fbuca.channel }); // set logchannel in db to logchannelid
    //                 buc.send('Bot updates channel set to here!'); // announce
    //             }
    //         }
    //         break;

    //     // case 'p':
    //     //     let e = await db.get(`botupChannel`);
    //     //     console.log(e)
    //     //     break;

    //     // case 'e':
    //     //     db.set(`botupChannel`, { guild: [], channel: [] });
    //     //     break;

    //     default: // If no permission to modify, complain
    //         errormsg.run(bot, message, args, "a", `\`Unspecified permission to modify!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}`)
    //         break;
    // }
}

module.exports.config = {
    command: ["modify", "m"],
    permlvl: "Admin",
    help: ["Admin", "Modify a role or channels bot data.",
            "Admin", "", "List all modify's possible. Use reactions to edit a value.",
            "Admin", "[mod-role | admin-role | role-modify | musicban | dj-role] [roleRepresentable]", "Adds a role to that position. If it already has the permission, it will remove it.",
            "Admin", "[log-channel | quote-channel | bot-updates]", "Displays the current channel it is set to.",
            "Admin", "[log-channel | quote-channel | bot-updates] off", "Turns off the bot sending those types of messages to that channel.",
            "Admin", "[log-channel | quote-channel | bot-updates] [channelRepresentable]", "Sets the channel to send those types of messages to."],
    helpg: "[mod-role | admin-role | role-modify | musicban | dj-role | log-channel | quote-channel | bot-updates]"
}