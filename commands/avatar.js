const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed() // Make a new embed.
    let mentions = message.mentions.members.first(); // Get the mentioned person
    let usera = '' // Its a surprise tool that will help us later!
    if(mentions){ // If there is a mentioned person
        usera = bot.users.find(user => user.id == mentions.id) // Set usera to be the retrieved user collection
    }else if(bot.users.find(user => user.id === args[1])){ // Otherwise check if a userID was said
        usera = bot.users.find(user => user.id == args[1]) // Set usera to be the retrieved user collection
    }else if(bot.users.find(user => user.username === args[1])){ // Otherwise check if a raw username was said
        usera = bot.users.find(user => user.username === args[1]) // Set... you get the point
    }else{ // IF ALL ELSE FAILS
        usera = message.author // Set usera to the author's collection
    }
    embed.setTitle(`${usera.username}'s Avatar`) // Set title of embed
    embed.setDescription(usera.avatarURL) // Set description to be URL of their pfp
    embed.setImage(usera.avatarURL) // Set Image to be of their pfp. Requires a URL so thats why it works
    message.channel.send(embed) // Actually send the damn embed.
}

module.exports.config = {
    command: ["avatar", "av"],
    permlvl: "All",
    help: ["Fun", "Get the avatar of a user.",
            "All", "", "Get your own avatar.",
            "All", "[mention | userID | username]", "Get the avatar of that user."]
}