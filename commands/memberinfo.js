const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    for(i = 1 + 1; i < args.length; i++) {
    	args[1] += ' ' + args[i];
    }
    if(!args[1]){
        userfind = message.author.id
    } else {
        userfind = args[1]
    }

    let mentions = message.mentions.members.first(); // Get the mentioned person
    let member; // Set the usercollection to blank
    if(mentions) member = message.guild.members.find(user => user.id == mentions.id) // If there is a mentioned person, set usercollection to be the retrieved user collection
    else if(message.guild.members.find(user => user.id === userfind)) member = message.guild.members.find(user => user.id == userfind) // Otherwise check if a userID was said, set usercollection to be the retrieved user collection
    else if(message.guild.members.find(user => user.user.username === userfind)) member = message.guild.members.find(user => user.user.username === userfind) // Otherwise check if a raw username was said, set... you get the point
    else return message.channel.send(`Could not find that user! Are you sure they are in this server?`)

    // Time difference
    let today = new Date()
    let create = new Date(member.user.createdAt)
    let ctz = new Date(create).toGMTString()
    let creatediff = Math.floor((today.getTime() - create.getTime()) / (1000 * 3600 * 24));
    let join = new Date(member.joinedAt)
    let jtz = new Date(join).toGMTString()
    let joindiff = Math.floor((today.getTime() - join.getTime()) / (1000 * 3600 * 24));

    let letters = ['f53131', 'f58331', 'f5e131', '89f531', '31f579', '31f5e1', '31aaf5', '4062f7', '6a42ed', 'ad52f7', 'e540f7', 'f531c4', 'f0325b'];
    let colour = "0x" + letters[Math.floor(Math.random() * letters.length)];

    let botornot = (member.user.bot == 'true') ? "Bot" : "Member"

    let role = [];
    for(const r of member.roles){
        role.push(r[1].name)
    }

    let embed = new Discord.RichEmbed()
        .setTitle(`${member.user.tag} ⬥ ${member.displayName} ⬥ ${botornot}`)
        .setDescription(`User ID: \`${member.id}\`\nAvatar URL: \`${member.user.displayAvatarURL}\`\n\u2800`)
        .setThumbnail(member.user.displayAvatarURL)
        .addField(`Account created`, `${ctz}\nThis is ${creatediff} days ago!`, true)
        .addField(`Account joined`, `${jtz}\nThis is ${joindiff} days ago!`, true)
    if(member.colorRole) embed.addField(`User hex`, `\`${member.displayHexColor}\`\nThis colour is from \`${member.colorRole.name}\``, true)
    if(member.hoistRole && member.highestRole) embed.addField(`Role info`, `Hoist role: \`${member.hoistRole.name}\`\nHighest role: \`${member.highestRole.name}\``, true)
    embed.addField(`Roles`, `\`${role.join('`, `')}\`\u2800`)
        .setColor(colour)
        .setFooter(`${NAME}\u2800⬥\u2800Version ${VERSION}\u2800⬥\u2800${prefix}mi (mention | userID | username)`);
    message.channel.send(embed)
}

module.exports.config = {
    command: ["memberinfo", "mi"],
    permlvl: "All",
    help: ["Other", "Get information about yourself or another user.",
            "All", "[userRepresentable]", "Get information about yourself or a specified user."],
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