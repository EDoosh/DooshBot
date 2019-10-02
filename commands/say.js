const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!args[1]) return message.channel.send('Well give me something to say man!') // If there is nothing to say or no guild ID, return error

    if(bot.channels.find(channel => channel.id === args[1])){ // If there is a channel ID in first arg...
        if(!args[2]) return message.channel.send('Well give me something to say man!')
        for(i = 2 + 1; i < args.length; i++) { // Combine everything after the channel ID
            args[2] += ' ' + args[i];
        }
        const channeltosendto = bot.channels.find(channel => channel.id === args[1]) // Set the channel to send to
        channeltosendto.send(args[2]).then(() => {
        }).catch(() => {
            message.channel.send('I dont have access to send messages there.')
        }) // Send the message
    } else { // If there isnt a channel ID in the first arg...
        for(i = 1 + 1; i < args.length; i++) { // Combine everything
            args[1] += ' ' + args[i];
        }
        message.channel.send(args[1]) // Send the message
    }
    console.log(`${message.author.username} (${message.author.id}) ran '${message.content}'`)
}

module.exports.config = {
    command: ["say"],
    permlvl: "Trusted",
    help: ["Trusted", "Make the bot send a message.",
            "Trusted", "[message]", "Make the bot send a message to the current channel.",
            "Trusted", "[channelID] [message]", "Make the bot send a message to the channel ID."]
}