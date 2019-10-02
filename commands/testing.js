const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    message.channel.send(logChannel)
    message.channel.send(msgUsername)
    message.channel.send(prefix)
}

module.exports.config = {
    command: ["testing"],
    permlvl: "All"
}