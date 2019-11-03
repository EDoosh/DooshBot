const Discord = require('discord.js');
const db = require('quick.db');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
    let highestf = await fetch(`https://xkcd.com/info.0.json`)
    const highest = await highestf.json();
    let xkcdf;
    if(!args[1]) {
        xkcdf = await fetch(`https://xkcd.com/info.0.json`)
    } else if(isNaN(args[1])) {
        rnd = Math.floor(Math.random() * highest.num) + 1
        xkcdf = await fetch(`https://xkcd.com/${rnd}/info.0.json`)
    } else {
        if(args[1] > highest.num || args[1] <= 0) return message.channel.send(`This ID is too high! The current highest ID is ${highest.num}`)
        xkcdf = await fetch(`https://xkcd.com/${args[1]}/info.0.json`)
    }

    const xkcd = await xkcdf.json();
    let letters = ['f53131', 'f58331', 'f5e131', '89f531', '31f579', '31f5e1', '31aaf5', '4062f7', '6a42ed', 'ad52f7', 'e540f7', 'f531c4', 'f0325b'];
    let colour = "0x" + letters[Math.floor(Math.random() * letters.length)];

    let embed = new Discord.RichEmbed()
        .setTitle(`__**${xkcd.num} - ${xkcd.safe_title}**__`)
        .setDescription(xkcd.alt)
        .setImage(xkcd.img)
        .setFooter(`${xkcd.year}/${xkcd.month}/${xkcd.day}\u2800⬥\u2800https://xkcd.com/${xkcd.num}/`)
        .setColor(colour)
        .setURL(`https://xkcd.com/${xkcd.num}/`);
    message.channel.send(embed)
}

module.exports.config = {
    command: ["xkcd"],
    permlvl: "All",
    help: ["Fun", "Get an xkcd comic.",
            "All", "", "Get the most recent xkcd.",
            "All", "[number]", "Get that specific xkcd.",
            "All", "r", "Get a random xkcd."],
    helpg: ""
}




//    ERROR MESSAGE
// errormsg.run(bot, message, args, IDOfTheHelpCommand, "Errormsg")
// errormsg.run(bot, message, args, "a", `\`reason!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)


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