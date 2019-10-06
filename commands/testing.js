const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    let mtosend = ''
    for(const word of args) {
        if (this.config.command.includes(word)) continue;
        switch(word) {
            case '${username}':
                mtosend += `${message.author.username} `
                break;
            case '${mention}':
                mtosend += `<@${message.author.id}> `
                break;
            case '${discrim}':
                mtosend += `${message.author.discriminator} `
                break;
            case '${tag}':
                mtosend += `${message.author.tag} `
                break;
            case '${id}':
                mtosend += `${message.author.id} `
                break;
            case '${servername}':
                mtosend += `${message.guild.name} `
                break;
            case '${prevwarns}':
                let warns = await db.get(`warns_${message.author.id}_${message.guild.id}.amount`)
                if (warns == null || isNaN(warns)) warns == '0'
                mtosend += `${warns} `
                break;
            default:
                mtosend += `${word} `
                break;
        }
    };
    message.channel.send(mtosend)
}

module.exports.config = {
    command: ["testing"],
    permlvl: "All"
}