const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    let prev = db.get(`taked`)
    if (args[1] == 'g') return message.channel.send(`The current person with it is ${prev.named}!`)
    if (prev.named == `${message.author.username}#${message.author.discriminator}`) return message.channel.send(`You already have it.`)
    message.channel.send(`Took it from ${prev.named}!`)
    db.set(`taked.named`, `${message.author.username}#${message.author.discriminator}`)
    db.set(`taked.id`, `${message.author.id}`)

    let dmto = bot.users.get(prev.id)
    dmto.send(`It has been taken from you by ${message.author.username}#${message.author.discriminator}`).catch(() => console.log(''))
}

module.exports.config = {
    command: ["take"],
    permlvl: "All",
    help: ["Fun", "Take it. A tiny game of reverse tag.",
            "All", "", "Take it. When taken from you, the bot will notify.",
            "All", "g", "Get the current person with it."]
}