const Discord = require('discord.js');
const db = require('quick.db');
const snekfetch = require('snekfetch');

// CREDIT TO u/KingCrowley0
// https://www.reddit.com/r/Discord_Bots/comments/9khght/pulling_random_images_from_subreddits_js/

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime) => {
    if(!args[1]) return message.channel.send('`Error - Unspecified subreddit to get posts from!`\nCommand usage: `' + prefix + 'reddit [subreddit]`')
    try {
        let getfrom = 'https://www.reddit.com/r/' + args[1] + '.json?sort=top&t=week'
        const { body } = await snekfetch
            .get(getfrom)
            .query({ limit: 800 });
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return message.channel.send('It seems we are out of posts!, Try again later.');
        const randomnumber = Math.floor(Math.random() * allowed.length)
        const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTitle(allowed[randomnumber].data.title)
        .setDescription("Posted by: " + allowed[randomnumber].data.author)
        .setImage(allowed[randomnumber].data.url)
        .addField("Other info:", "UpVotes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
        .setFooter("Post from r/" + args[1])
        message.channel.send(embed)
    } catch (err) {
        return console.log(err);
    }
}

module.exports.config = {
    command: "reddit"
}