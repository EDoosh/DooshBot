const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    let embed = new Discord.RichEmbed()
    let mentions = message.mentions.members.first();
    let usera = ''
    if(mentions){
        usera = bot.users.find(user => user.id == mentions.id)
    }else if(bot.users.find(user => user.id === args[1])){
        usera = bot.users.find(user => user.id == args[1])
    }else if(bot.users.find(user => user.username === args[1])){
        usera = bot.users.find(user => user.username === args[1])
    }else{
        usera = message.author
    }
    embed.setTitle(`${usera.username}'s Avatar`)
    embed.setImage(usera.avatarURL)
    embed.setDescription(usera.avatarURL)
    message.channel.send(embed)
}

module.exports.config = {
    command: "avatar"
}