const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    let quotes;
    let a;
    if (args[1] == 'g') { // If the user wants global...
        quotes = db.get(`qg`) // Set quotes to the global quotes db
        a = 2
    } else { // If the user wants server...
        quotes = db.get(`q_${message.guild.id}`) // Set quotes to the server quotes db
        a = 1
    }
    if (quotes.c.length == 1) return message.channel.send('There are no quotes in here...')

    let quoteid;
    if (!isNaN(args[a])) { // If the user requests a quote ID
        // If it doesnt include the ID in the DB, show error
        if (!quotes.c.includes(args[a]) || args[a] == '0') return message.channel.send(`\`Error!\` This ID does not exist! The highest ID is ${quotes.next}, although some may be missing or removed.`)
        quoteid = quotes.c.indexOf(args[a]);
    } else { // Else if the user wants random
        quoteid = Math.floor(Math.random() * quotes.c.length - 1) + 1
    }

    // Get the channel the message was sent in
    let qchan = await bot.channels.get(quotes.cid[quoteid])

    let quotemsg = await qchan.fetchMessage(quotes.ids[quoteid]).then(() => {
        let embed = new Discord.RichEmbed()
            .setAuthor(`${quotemsg.author.username}`, quotemsg.author.avatarURL)
            .setTitle(`${quotemsg.author.username} sent in #${qchan.name} -`)
            .setURL(quotemsg.url)
            .setDescription(`${quotemsg.content}`)
            .setTimestamp(Date.now())
            .setFooter(`ID ${quotes.c[quoteid]}`);
        // If there is an image, add it in
        if (quotemsg.attachments.size >= 1) embed.setImage(quotemsg.attachments.array()[0].url)
        // Send the embed
        message.channel.send(embed)
    }).catch(() => {
        return message.channel.send(`\`An error occured while trying to retrieve the message.\`\nThe author's original message was most likely deleted.`)
    })
}

module.exports.config = {
    command: ["q", "gq", "gquote", "getquote"],
    permlvl: "All",
    help: ["Fun", "Get a quote.",
            "All", "", "Get a random server quote.",
            "All", "[quoteID]", "Get that server quote ID.",
            "All", "g", "Get a random global quote.",
            "All", "g [globalQuoteID]", "Get that global quote ID."]
}