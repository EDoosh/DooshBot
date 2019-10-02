const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, cmdhid, reasonforerror) => {
    if(!reasonforerror) return message.channel.send("Hmmm...")
    let cmdran = bot.commands.get(args[0].toLowerCase())
    if(!isNaN(cmdhid)) message.channel.send(`:exclamation: \`Error - ${reasonforerror}!\`\nCommand Usage: \`${prefix}${cmdran.config.command[0]} ${cmdran.config.help[cmdhid*3]}\``)
    else message.channel.send(`:exclamation: \`Error\` - ${reasonforerror}`)
}

module.exports.config = {
    command: ["errormessage-dontuse", "other"],
    permlvl: "EDoosh",
    help: ["EDoosh", "Sends an error message. Don't use this.",
            "EDoosh", "", "Sends an error message. Don't use this."]
}