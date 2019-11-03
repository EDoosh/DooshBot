const Discord = require('discord.js');
const db = require('quick.db');

//   TRUSTED
// -=quote globaladd [messageID] - Get the authors's nickname of the message, the date, the message ID, and the contents, then add it to a DB. Make amount increment too.
// -=quote globalremove [QuoteID] - Remove the quote by the quote's ID 

//   ADMIN
// -=modify quote-channel - Sends quotes to a channel.

//   MODS
// -=quote add [messageID] - Same as trusted, just for the server only
// -=quote remove [QuoteID] - Same as trusted, just for the server only

module.exports.run = async (bot, message, args) => {
    // Make sure there is 'add' or 'remove'
    if(!args[1]) return errormsg.run(bot, message, args, "a", `\`Unspecified argument!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}`)
    // Get the quote channels
    let fqc = await db.get(`quoteChannel_${message.guild.id}`);
    if (fqc == null) db.set(`q_${message.guild.id}`, { msg: ['0'], c: ['0'], ids: ['0'], next: 0, cid: ['0'] })
    let gqc = bot.channels.get('625074829959233559')

    // Get all the server quotes
    let serverquotes = db.get(`q_${message.guild.id}`)
    let globalquotes = db.get(`qg`)

    switch (args[1]) {
        case 'a':
        case 'add':
            // Get the quote channel
            let qc;
            if (fqc == null || fqc == 0) return message.channel.send(`\`Error - No quote channel!\`\nUse \`${prefix}modify quote-channel [channel]\` to set a new quote channel.`)
            qc = message.guild.channels.get(fqc);
            // Make sure there is a message ID
            if(!args[2]) return errormsg.run(bot, message, args, 1, "Missing argument")
            // And make sure its *actually* a message ID
            let sentmsg = await message.channel.fetchMessage(args[2]).catch(() => {
                return errormsg.run(bot, message, args, 1, "Bad message ID")
            })
            // Check if it was made by themselves
            if(message.author == sentmsg.author) return errormsg.run(bot, message, args, 1, "I don't think you should do that!")

            // Check if a quote exists with that ID
            if(serverquotes.ids.includes(args[2])) return errormsg.run(bot, message, args, 1, "A quote already exists with that message ID")
            let embed = new Discord.RichEmbed()
                .setAuthor(`${sentmsg.author.username}`, sentmsg.author.avatarURL)
                .setTitle(`${sentmsg.author.username} sent in #${message.channel.name} -`)
                .setURL(sentmsg.url)
                .setDescription(`${sentmsg.content}`)
                .setTimestamp(Date.now())
                .setFooter(`ID ${serverquotes.next + 1} | Quoted by ${message.author.username}`);
            // If there is an image, add it in
            if (sentmsg.attachments.size >= 1) embed.setImage(sentmsg.attachments.array()[0].url)
            // Send the embed, then
            qc.send(embed).then(() => {
                // Get the most recent message in the quote channel
                qc.fetchMessages({ limit: 1 }).then(messages => {
                    // Get the first message of that
                    let lastMessage = messages.first();
                    let nextquotec = serverquotes.next + 1
                    // Set the first message into the db
                    db.push(`q_${message.guild.id}.msg`, lastMessage.id)
                    db.push(`q_${message.guild.id}.c`, nextquotec.toString())
                    db.push(`q_${message.guild.id}.ids`, args[2])
                    db.push(`q_${message.guild.id}.cid`, message.channel.id)
                    db.add(`q_${message.guild.id}.next`, 1)
                    message.channel.send(`Quote successfully added as quote ID ${serverquotes.next + 1}`)
                })
            })

            break;

        case 'r':
        case 'remove':
            // Get the quote channel
            let qcr;
            if (fqc == null || fqc == 0) return message.channel.send(`\`Error - No quote channel!\`\nUse \`${prefix}modify quote-channel [channel]\` to set a new quote channel.`)
            qcr = message.guild.channels.get(`${fqc}`);
            let toDeleter = serverquotes.c.indexOf(args[2]);
            // Make sure there is a message ID
            if(!args[2]) return errormsg.run(bot, message, args, 2, "Missing argument")
            // And make sure its *actually* a message ID
            if(!serverquotes.c.includes(args[2]) || serverquotes.c[args[2]] == '0'){
                return errormsg.run(bot, message, args, 2, "Bad quote ID")
            }
            let msgtodelete = await qcr.fetchMessage(`${serverquotes.msg[toDeleter]}`).then(msgtodelete => {
                msgtodelete.delete()
            }).catch(() => {
                return message.channel.send('An issue occured while trying to remove the ID.')
            });

            serverquotes.msg.splice(toDeleter, 1)
            serverquotes.c.splice(toDeleter, 1)
            serverquotes.ids.splice(toDeleter, 1)
            serverquotes.cid.splice(toDeleter, 1)
            db.set(`q_${message.guild.id}.msg`, serverquotes.msg)
            db.set(`q_${message.guild.id}.c`, serverquotes.c)
            db.set(`q_${message.guild.id}.ids`, serverquotes.ids)
            db.set(`q_${message.guild.id}.cid`, serverquotes.cid)
            message.channel.send(`Quote ${args[2]} was deleted!`)
            break;

        case 'ga':
        case 'globaladd':
            if(!useallcmds.includes(msgUserID)) return message.channel.send('Error - Requires EDoosh or other approved members to run this command! Wait, how did you find out about it..?');
            // Make sure there is a message ID
            if(!args[2]) return errormsg.run(bot, message, args, 3, "Missing argument")
            // And make sure its *actually* a message ID
            let sentmsgg = await message.channel.fetchMessage(args[2]).catch(() => {
                return errormsg.run(bot, message, args, 3, "Bad message ID")
            })
            // Check if it was made by themselves
            if(message.author == sentmsgg.author) return errormsg.run(bot, message, args, 3, "I don't think you should do that")

            // Check if a quote exists with that ID
            if(globalquotes.ids.includes(args[2])) return errormsg.run(bot, message, args, 3, "A global quote already exists with that ID")
            let gembed = new Discord.RichEmbed()
                .setAuthor(`${sentmsgg.author.username}`, sentmsgg.author.avatarURL)
                .setTitle(`${sentmsgg.author.username} sent in #${message.channel.name} -`)
                .setURL(sentmsgg.url)
                .setDescription(`${sentmsgg.content}`)
                .setTimestamp(Date.now())
                .setFooter(`ID ${globalquotes.next + 1} | Quoted by ${message.author.username}`);
            // If there is an image, add it in
            if (sentmsgg.attachments.size >= 1) gembed.setImage(sentmsgg.attachments.array()[0].url)
            // Send the embed, then
            gqc.send(gembed).then(() => {
                // Get the most recent message in the quote channel
                gqc.fetchMessages({ limit: 1 }).then(messagesg => {
                    // Get the first message of that
                    let lastMessageg = messagesg.first();
                    let nextquotecg = globalquotes.next + 1
                    // Set the first message into the db
                    db.push(`qg.msg`, lastMessageg.id)
                    db.push(`qg.c`, nextquotecg.toString())
                    db.push(`qg.ids`, args[2])
                    db.push(`qg.cid`, message.channel.id)
                    db.add(`qg.next`, 1)
                    message.channel.send(`Global quote successfully added as global quote ID ${globalquotes.next + 1}`)
                })
            })

            break;

        case 'gr':
        case 'globalremove':
            if(!useallcmds.includes(msgUserID)) return message.channel.send('Error - Requires EDoosh or other approved members to run this command! Wait, how did you find out about it..?');
            let toDelete = globalquotes.c.indexOf(args[2]);
            // Make sure there is a message ID
            if(!args[2]) return errormsg.run(bot, message, args, 4, "Missing argument")
            // And make sure its *actually* a message ID
            if(!globalquotes.c.includes(args[2]) || globalquotes.c[args[2]] == '0'){
                return errormsg.run(bot, message, args, 4, "Bad quote ID")
            }
            let msgtodeleteg = await gqc.fetchMessage(`${globalquotes.msg[toDelete]}`).then(msgtodeleteg => {
                msgtodeleteg.delete()
            }).catch(() => {
                return message.channel.send('An issue occured while trying to remove the ID.')
            });

            globalquotes.msg.splice(toDelete, 1)
            globalquotes.c.splice(toDelete, 1)
            globalquotes.ids.splice(toDelete, 1)
            globalquotes.cid.splice(toDelete, 1)
            db.set(`qg.msg`, globalquotes.msg)
            db.set(`qg.c`, globalquotes.c)
            db.set(`qg.ids`, globalquotes.ids)
            db.set(`qg.cid`, globalquotes.cid)
            message.channel.send(`Global quote ${args[2]} was deleted!`)
            break;
    }
}

module.exports.config = {
    command: ["quote"],
    permlvl: "Mod",
    help: ["Mod", "Create or delete a quote.",
            "Mod", "add [messageID]", "Create a quote from a Message ID.",
            "Mod", "remove [quoteID]", "Remove a quote by Quote ID."],
    helpg: "[add | remove]"
}