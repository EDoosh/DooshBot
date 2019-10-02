const Discord = require('discord.js');
const db = require('quick.db');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
    let day;
    if(args[1] && args[1] == 'r') {
        day = Math.floor(Math.random() * 366) // Get random number
    } else if(args[1] && !isNaN(args[1]) && args[1] <= 366 & args[1] >= 1) {
        day = args[1]
    } else {
        // Thanks Alex Turpin and Koen Peters! https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        day = Math.floor(diff / oneDay) - 1;
    }

    bt = fs.readFileSync('bibletoken.txt').toString();
    fetch(`https://developers.youversionapi.com/1.0/verse_of_the_day/${day}?version_id=1`, {
        headers: {
            'X-YouVersion-Developer-Token': bt,
            'Accept-Language': 'en',
            Accept: 'application/json',
        }
    })
    .then((result) => result.json())
    .then((json) => {
        const embed = new Discord.RichEmbed() // Create an embed with the retrieved info
            .setColor(0x34eb4f)
            .setTitle(`Day ${json.day} - ${json.verse.human_reference}`)
            .setDescription(json.verse.text)
            .setImage(`https:${json.image.url}`)
            .setFooter(`${json.verse.url} | ${json.image.attribution}`)
        message.channel.send(embed) // Send the embed.
    })
}

module.exports.config = {
    command: ["bible"],
    permlvl: "All",
    help: ["Fun", "Gets a bible quote image.",
            "All", "", "Get the bible quote image of the day.",
            "All", "r", "Gets a random bible quote image.",
            "All", "[1-366]", "Gets a bible quote image from that number."]
}