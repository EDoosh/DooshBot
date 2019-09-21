const Discord = require('discord.js');
const db = require('quick.db');
const snekfetch = require('snekfetch');
const fs = require('fs');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(fs.readFileSync('tokennewsapi.txt').toString())

// CREDIT TO u/KingCrowley0
// https://www.reddit.com/r/Discord_Bots/comments/9khght/pulling_random_images_from_subreddits_js/

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime, usedcmd) => {
    let articles;
    let randomnumber;

    if(args[1]) {
        for(i = 1 + 1; i < args.length; i++) {
            args[1] += ' ' + args[i];
        }
        try {
            const d = new Date()
            curdate = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
            d.setMonth(d.getUTCDate() - 7)
            weekago = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
            newsapi.v2.everything({
                q: `${args[1]}`,
                from: weekago,
                to: curdate,
                language: 'en',
                sortBy: 'relevancy'
            }).then(response => {
                articles = response.articles
                randomnumber = Math.floor(Math.random() * 20) // Get random number
                const embed = new Discord.RichEmbed() // Create an embed with the retrieved info
                    .setColor(0x89f060)
                    .setTitle(articles[randomnumber].title)
                    .setDescription(`Written by ${articles[randomnumber].author}`)
                    .setThumbnail(articles[randomnumber].urlToImage)
                    .addField('About the article.', articles[randomnumber].setDescription)
                    .setURL(articles[randomnumber].url)
                    .setFooter(`Powered by News API and ${articles[randomnumber].source.name}`)
                message.channel.send(embed) // Send the embed.
            }).catch(() => {
                message.channel.send('An error occured! Maybe nothing matched your search terms?')
            })
        } catch (err) {
            return console.log(err);
        }
    } else {
        try {
            newsapi.v2.topHeadlines({
                language: 'en',
                country: 'us'
            }).then(response => {
                articles = response.articles
                randomnumber = Math.floor(Math.random() * 20) // Get random number
                const embed = new Discord.RichEmbed() // Create an embed with the retrieved info
                    .setColor(0x89f060)
                    .setTitle(articles[randomnumber].title)
                    .setDescription(`Written by ${articles[randomnumber].author}`)
                    .setThumbnail(articles[randomnumber].urlToImage)
                    .addField('About the article.', articles[randomnumber].description)
                    .setURL(articles[randomnumber].url)
                    .setFooter(`Powered by News API and ${articles[randomnumber].source.name}`)
                message.channel.send(embed) // Send the embed.
            });
        } catch (err) { // If there is an error, show it.
            return console.log(err);
        }
    }
}

module.exports.config = {
    command: "news"
}