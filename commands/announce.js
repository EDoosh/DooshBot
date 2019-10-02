const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!args[1]) return errormsg.run(bot, message, args, 1, "Missing argument")
    for(i = 1 + 1; i < args.length; i++) {
        args[1] += ' ' + args[i];
    }

    // For every channel in th bot updates thingie
    // Get the channel
    // Send the message
    // Catch if it didnt send
    let allchannels = await db.get(`botupChannel.channel`)
    for(const channelid of allchannels) {
        let sendto = await bot.channels.find(channel => channel.id === channelid)
        sendto.send(args[1]).catch((err) => {
            console.log(`Failed to send announcement message to channel ${channelid}.`)
            console.log(err)
        })
    }
}

module.exports.config = {
    command: ["announce"],
    permlvl: "EDoosh",
    help: ["EDoosh", "Announce something.",
            "EDoosh", "[announcement text]", "Announce something to everyone"]
}




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