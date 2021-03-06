const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    const flags = message.content.substring(prefix.length).split('|')
    if(flags.length < 4 || flags.length > 12) return errormsg.run(bot, message, args, 1, "Requires minimum of 2 and maximum of 10 options")
    let numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero']
    var reaction_numbers = ["\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3","\u0030\u20E3"]
    let contents = ''
    for(i=1; i < flags.length - 1; i++){
        if(flags[i].substr(flags[i].length - 1) === ' ') flags[i] = flags[i].slice(0, -1)
    }
    for(i=1; i < flags.length - 1; i++){
        contents += `\n:${numbers[i-1]}: *- ${flags[i + 1]}*`
    }
    message.channel.send(`**${flags[1]}**${contents}`).then(() => {
        message.channel.fetchMessages({ limit: 1 }).then(async messages => {
            let lastMessage = messages.first();
            for(i=1; i < flags.length - 1; i++){
                await lastMessage.react(`${reaction_numbers[i - 1]}`)
            }
        })
    }).catch(() => {
        message.channel.send('An error occured. Maybe reactions are disabled for the bot?')
    })
}

module.exports.config = {
    command: ["poll"],
    permlvl: "All",
    help: ["Fun", "Create a poll.",
            "All", "|[Poll Title] |[Option 1] |[Option 2]...", "Creates a poll with up to 10 options, seperated by a vertical bar (|)"]
}