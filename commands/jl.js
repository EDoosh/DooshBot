const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(args[1] == 'b') type = 'bot'
    else if (args[1] == 'm') type = 'member'
    else if (args[1] == 'h' || args[1] == 'help') {
        let hemb = new Discord.RichEmbed()
            .setTitle(`Creating a join or leave message`)
            .setDescription(`Because it isn't entirely obvious how to.\n\u2800`)
            .addField(`How to create a join or leave message`, `\`${prefix}${this.config.command[0]} ${this.config.help[18]}\` will create a message. But what does everything do?`)
            .addField(`[b | m]`, `This determines whether or not the message will be for bots, or for regular members.`)
            .addField(`[j | l]`, `This is for if the account is joining or leaving the server.`)
            .addField(`[channel-name]`, `This is the channel the message will send into.`)
            .addField(`[0-9]`, `Messages with the 0 tag will always send.\nIf the message has a number between 1 - 9 then each time an account joins/leaves the server it will randomly decide, out of all the ones with that number in the specified channel, which 1 to send.`)
            .addField(`[message]`, `The message to send when an account joins/leaves the server.`)
            .setFooter(`Still have questions? Ask EDoosh#9599, or ask for help in the Discord server with '-=info'`)
            .setColor(0x46f277)
        let hemb3 = new Discord.RichEmbed()
            .setTitle(`Arguments for your messages`)
            .setDescription(`For when you want to use a variable.\n\u2800`)
            .addField(`**All of these require spaces before and after the argument!**`, `**If there isn't any, it won't work properly!**\n\u2800`)
            .addField('${username}', `The users username.\nE.g. 'Jeff' in 'Jeff#6969'`, true)
            .addField('${discrim}', `The users discriminator.\nE.g. '6969' in 'Jeff#6969'`, true)
            .addField('${id}', `The users User ID.`, true)
            .addField('${tag}', `The users tag.\nE.g. 'Jeff#6969'`, true)
            .addBlankField(true)
            .addField('${mention}', `Mentions the user.`, true)
            .addField('${servername}', `The name of the server.`, true)
            .addField('${prevwarns}', `The amount of warns the user currently has.`, true)
            .setFooter(`Still have questions? Ask EDoosh#9599, or ask for help in the Discord server with '-=info'`)
            .setColor(0x82f246)
        let hemb2 = new Discord.RichEmbed()
            .setTitle(`Listing and removing messages`)
            .setDescription(`How do I get rid of this thing?!\n\u2800`)
            .addField(`How to list all the messages`, `\`${prefix}${this.config.command[0]} ${this.config.help[12]}\` displays all join/leave messages for the server.`)
            .addField(`How to list all the messages for a channel`, `\`${prefix}${this.config.command[0]} ${this.config.help[15]}\` displays all join/leave messages for the channel.`)
            .addField(`How to remove a message`, `\`${prefix}${this.config.command[0]} ${this.config.help[21]}\` removes based on ID. What's an ID? The ID is the first number listed on each row when you list all the messages.`)
            .setFooter(`Still have questions? Ask EDoosh#9599, or ask for help in the Discord server with '-=info'`)
            .setColor(0x03fcf0)
        message.channel.send(hemb)
        message.channel.send(hemb3)
        message.channel.send(hemb2)
        return;
    }
    else return errormsg.run(bot, message, args, "a", `\`Unspecified user type!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)

    switch(args[2]) {
        case 'ar':
        case 'autorole':
            for(i = 3 + 1; i < args.length; i++) {
                args[3] += ' ' + args[i];
            }

            // ID, Name
            let arcol;
            if(message.guild.roles.find(x => x.id == args[3])) arcol = message.guild.roles.find(x => x.id == args[3])
            else if(message.guild.roles.find(x => x.name == args[3])) arcol = message.guild.roles.find(x => x.name == args[3])

            let far = await db.get(`ar_${message.guild.id}_${type}`);
            if (far != null) ar = far;
            else ar = [];
        
            if(!args[3]) {
                if(ar.length === 0) {
                    message.channel.send(`There are currently no ${type} auto-role roles!`);
                }else{
                    let automessage = [];

                    for(i=0; i < ar.length; i++){
                        let arcol2 = message.guild.roles.find(x => x.id == ar[i])
                        if(!arcol2) {automessage.push(`**DELETED ROLE** (${ar[i]})`); continue; }
                        automessage.push(`${arcol2.name} (${ar[i]})`)
                    }
                    message.channel.send(`Current ${type} autoroles are: ${automessage.join(', ')}`);
                }
            }else if(ar.includes(args[3])){
                ar.splice(ar.indexOf(args[3]), 1);
                db.set(`ar_${message.guild.id}_${type}`, ar);
                message.channel.send(`The role \`${args[3]}\` has been removed from ${type} auto-role for the server!`);
            }else{
                if(!arcol) return message.channel.send(`The role \`${args[3]}\` does not exist!`);
                if(ar.includes(arcol.id)) {
                    ar.splice(ar.indexOf(arcol.id), 1);
                    db.set(`ar_${message.guild.id}_${type}`, ar);
                    message.channel.send(`The role \`${arcol.name}\` has been removed from ${type} auto-role for the server!`);
                } else {
                    ar.push(arcol.id);
                    db.set(`ar_${message.guild.id}_${type}`, ar);
                    message.channel.send(`The role \`${arcol.name}\` is now part of ${type} auto-role for the server!`);
                }
            }

            // }else if(rmrole.includes(args[2])){ // If there is already that id in the modrole...
            //     rmrole.splice(rmrole.indexOf(args[2]), 1); // Remove it from modrole
            //     db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
            //     message.channel.send('The role `' + args[2] + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
            // }else{
            //     // Create collection of the role
            //     let rmcol;
            //     if(message.guild.roles.find(x => x.id == args[2])) rmcol = message.guild.roles.find(x => x.id == args[2])
            //     else if(message.guild.roles.find(x => x.name == args[2])) rmcol = message.guild.roles.find(x => x.name == args[2])
            //     // Check if there is a role. If not, throw error.
            //     if(!rmcol) return message.channel.send('The role `' + args[2] + '` does not exist!');
            //     // Remove by name
            //     if(rmrole.includes(rmcol.id)) {
            //         rmrole.splice(rmrole.indexOf(rmcol.id), 1); // Remove it from modrole
            //         db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
            //         message.channel.send('The role `' + rmcol.name + '` has been removed from Role Modify permissions for this bot!'); // Say its been removed
            //     } else {
            //         rmrole.push(rmcol.id); // Add it in to modrole
            //         db.set(`rmrole_${message.guild.id}`, rmrole); // Set the new modrole into the database
            //         message.channel.send('The role `' + rmcol.name + '` now has Role Modify permission for this bot!'); // Say its been added
            //     }
            break;

        case 'j':
        case 'join':
        case 'l':
        case 'leave':
            let joinleave = (args[2] == "j" || args[2] == "join") ? 'join' : 'leave'
            let jl = await db.get(`jl_${message.guild.id}_${type}_${joinleave}`)
            if(jl == null) {
                await db.set(`jl_${message.guild.id}_${type}_${joinleave}`, { all : [{ channelid: '', text: [], rnd: [], id: []}], next : 0 })
                jl = await db.get(`jl_${message.guild.id}_${type}_${joinleave}`)
            }


            if (!args[3]) { // If they want to list all
                message.channel.send(`The current server ${type} ${joinleave} messages are: \n\`[ID] [rnd value] [channel] [message]\``)
                for(i=0; i < jl.all.length; i++) { // For all the channels
                    for(j=0; j < jl.all[i].text.length; j++) { // For all the messages in those channels
                        message.channel.send(`\`${jl.all[i].id[j]}\`  \`${jl.all[i].rnd[j]}\`  <#${jl.all[i].channelid}>  \`'${jl.all[i].text[j]}'\``)
                    }
                }


            } else if (!args[4]) { // If they want to list channel or remove an ID
                if (isNaN(args[3])) { // If they want to list a channel
                    // Check the channel exists
                    // Mention, ID, name
                    let listcol;
                    if(message.guild.channels.find(channel => channel.id == args[3].slice(2, (args[3].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[3].slice(2, (args[3].length) - 1))
                    else if(message.guild.channels.find(channel => channel.id == args[3])) listcol = message.guild.channels.find(channel => channel.id == args[3])
                    else if(message.guild.channels.find(channel => channel.name == args[3])) listcol = message.guild.channels.find(channel => channel.name == args[3])

                    if(!listcol) return errormsg.run(bot, message, args, 5, "Invalid channel")
                    // Find the index of the channel in relation to .all
                    let allindex = -1;
                    for(i=0; i < jl.all.length; i++) { // For all the channels
                        if(jl.all[i].channelid == listcol.id) {
                            allindex = i;
                            break;
                        }
                    }
                    // If there isn't one, throw error
                    if (allindex == -1) return errormsg.run(bot, message, args, 5, `No ${type} ${joinleave} messages exist in this channel`)
                    // Send all the messages from that channel
                    message.channel.send(`The current ${args[3]} ${type} ${joinleave} messages are: \n\`[ID] [rnd value] [channel] [message]\``)
                    for(j=0; j < jl.all[i].text.length; j++) { // For all the messages in those channels
                        message.channel.send(`\`${jl.all[allindex].id[j]}\`  \`${jl.all[allindex].rnd[j]}\`  <#${jl.all[allindex].channelid}>  \`'${jl.all[allindex].text[j]}'\``)
                    }


                } else { // If they want to remove an ID
                    if(args[3] < 0 || args[3] >= jl.next) return errormsg.run(bot, message, args, 7, `That ID is too high or low.`)
                    // Find the index of the id in relation to .all
                    let allindex = -1;
                    chloop:
                    for(i=0; i < jl.all.length; i++) { // For all the channels
                        for(j=0; j < jl.all[i].id.length; j++){ // For all the ids
                            if(jl.all[i].id[j] == args[3]) { // Check if it matches args[3]
                                allindex = i;
                                idindex = j;
                                break chloop;
                            }
                        }
                    }
                    // If there isn't one, throw error
                    if (allindex == -1) return errormsg.run(bot, message, args, 7, `No ${type} ${joinleave} messages with that ID exist. Perhaps it has been deleted?`)
                    // Splice
                    jl.all[allindex].text.splice(idindex,1)
                    jl.all[allindex].id.splice(idindex,1)
                    jl.all[allindex].rnd.splice(idindex,1)
                    // Set into the DB
                    db.set(`jl_${message.guild.id}_${type}_${joinleave}.all[${allindex}]`, { channelid : jl.all[allindex].channelid, text : jl.all[allindex].text, rnd : jl.all[allindex].rnd, id : jl.all[allindex].id })
                    // Claim success
                    message.channel.send(`Successfully removed from the list.`)
                }


            } else if (args[5]) { // If they want a new message
                // Make sure the channel exists
                let listcol;
                if(message.guild.channels.find(channel => channel.id == args[3].slice(2, (args[3].length) - 1))) listcol = message.guild.channels.find(channel => channel.id == args[3].slice(2, (args[3].length) - 1))
                else if(message.guild.channels.find(channel => channel.id == args[3])) listcol = message.guild.channels.find(channel => channel.id == args[3])
                else if(message.guild.channels.find(channel => channel.name == args[3])) listcol = message.guild.channels.find(channel => channel.name == args[3])

                if(!listcol) return errormsg.run(bot, message, args, 6, "Invalid channel")
                channelida = listcol.id
                // Make sure arg 4 is a number
                if(isNaN(args[4]) || args[4] < 0 || args[4] > 9) return errormsg.run(bot, message, args, 6, "Invalid number at argument 3. Just use 0 if you're confused.")
                // Combine message.
                for(i = 5 + 1; i < args.length; i++) {
                    args[5] += ' ' + args[i];
                }
                // Find location of the channel, if there is one.
                let allindex = -1;
                for(i=0; i < jl.all.length; i++) { // For all the channels
                    if(channelida == jl.all[i].channelid) { allindex = i; break; }
                }
                // If there isn't one, throw error
                if (allindex == -1) {
                    allindex = jl.all.length
                    db.push(`jl_${message.guild.id}_${type}_${joinleave}.all`, {channelid: String(channelida), text: [], rnd: [], id: []})
                    jl = await db.get(`jl_${message.guild.id}_${type}_${joinleave}`)
                }
                // Push into DB
                jl.all[allindex].text.push(args[5])
                jl.all[allindex].rnd.push(args[4])
                jl.all[allindex].id.push(jl.next)
                db.set(`jl_${message.guild.id}_${type}_${joinleave}.all[${allindex}]`, { channelid : jl.all[allindex].channelid, text : jl.all[allindex].text, rnd : jl.all[allindex].rnd, id : jl.all[allindex].id })
                db.add(`jl_${message.guild.id}_${type}_${joinleave}.next`, 1)
                message.channel.send(`Successfully added as ID ${jl.next}`)

            } else return errormsg.run(bot, message, args, 6, "Unspecified arguments")
            break;

        default:
            errormsg.run(bot, message, args, "a", `\`Unspecified type!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)
            break;
    }
}

module.exports.config = {
    command: ["jl", "joinleave"],
    permlvl: "Admin",
    help: ["Admin", "Sets the join and leave messages and roles",
            "Admin", "h", "Shows the help screen for when your making a new join/leave message.",
            "Admin", "[b | m] ar", "Lists all the roles that are given to a bot or member on join.",
            "Admin", "[b | m] ar [role-name | role-id]", "Sets the autorole for when a bot or member joins. Similarly to modrole and adminrole, there can be more than one role.",
            "Admin", "[b | m] [j | l]", "Lists all the messages on the server that are sent when a bot or member joins/leaves.",
            "Admin", "[b | m] [j | l] [channelID | channelMention | channelName]", "Lists all the messages in the channel that are sent when a bot or member joins/leaves.",
            "Admin", "[b | m] [j | l] [channelID | channelMention | channelName] [0-9] [message]", "Creates a new message that will be sent to the channel when a bot or member joins/leaves the server.\nIf the number is 0, the message will always send. If it is from 1 to 9, it will randomize the message sent for each member.",
            "Admin", "[b | m] [j | l] [ID]", "Removes that join message from the server."],
    helpg: "[help | b | m] [ar | j | l]"
}

//  Get the database for the server & type
//  For all the entries...
//      Get the channel
//      Get the text
//      For all the words in the text
//          Run testing.js code
//      Send to channel
//  Repeat


//  Get the database for the server and type
//  For db.all as i {
//      Get the channel
//      For db.all[i].text as j {
//          (number rnd[j] resembles).push(j)
//      }
//      For 0.length as j {
//          run testing.js function code 
//      }
//      For 1 - 9 as j {
//          if(j.length == 0) return
//          random number from 0 to j.length - 1
//          run testing.js function code
//      }
//  }

// function testing.js code


// jl_${guildid}_${type}_${joinleave}, { all : [ { channelid : '', text : ['',''], rnd : [0,0], id : ['',''] }, {...} ], next : 0 }
//  db.all[i].text[j]

// 0 always sends, 1-9 have rnd




//    ERROR MESSAGE
// errormsg.run(bot, message, args, IDOfTheHelpCommand, "Errormsg")
// errormsg.run(bot, message, args, "a", `\`reason!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}\``)


//    LOG CHANNEL
// if(logChannel != 0) logChannel.send()


//    GET THE USER COLLECTION, USERNAME, AND ID
// let mentions = message.mentions.members.first(); // Get the mentioned person
// let usercollection; // Set the usercollection to blank
// if(mentions) usercollection = bot.users.find(user => user.id == mentions.id) // If there is a mentioned person, set usercollection to be the retrieved user collection
// else if(bot.users.find(user => user.id === args[1])) usercollection = bot.users.find(user => user.id == args[1]) // Otherwise check if a userID was said, set usercollection to be the retrieved user collection
// else if(bot.users.find(user => user.username === args[1])) usercollection = bot.users.find(user => user.username === args[1]) // Otherwise check if a raw username was said, set... you get the point
// else usercollection = message.author // If no other checks were passed, set usercollection to the author's collection
// mentionsid = usercollection.id
// mentionsun = usercollection.username


//    COMBINE ARGUMENTS
// for(i = combineTo + 1; i < args.length; i++) {
// 	args[combineTo] += ' ' + args[i];
// }


//    ERROR MESSAGES
// message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
// message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
// message.channel.send('`Error - Requires Role Change permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify role-modify [role name]`');
// message.channel.send('Error - Requires EDoosh or other approved members to run this command! Wait, how did you find out about it..?');
// message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');


//    CHECK FOR PERMS
// hasMod
// hasAdmin
// hasRoleMod
// useallcmds.includes(msgUserID)
// msgUserID == 267723762563022849