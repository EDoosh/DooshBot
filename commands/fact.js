const Discord = require('discord.js');
const db = require('quick.db');
const snekfetch = require('snekfetch');

// CREDIT TO u/KingCrowley0
// https://www.reddit.com/r/Discord_Bots/comments/9khght/pulling_random_images_from_subreddits_js/

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    try {
        let getfrom = 'https://uselessfacts.jsph.pl/random.json?language=en' // set getfrom to the url
        const { body } = await snekfetch // Retrieve the data
            .get(getfrom);
        const embed = new Discord.RichEmbed() // Create an embed with the retrieved info
        .setColor(0x34ebb7)
        .setTitle(body.text)
        .setFooter(`https://uselessfacts.jsph.pl//${body.id}`)
        message.channel.send(embed) // Send the embed.
    } catch (err) { // If there is an error, show it.
        console.log(err);
        return
    }
}

module.exports.config = {
    command: "fact"
}