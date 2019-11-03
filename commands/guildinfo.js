const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!args[1]){ // If there is not a guild id, use the current
        guildid = message.guild.id
    } else { // If there is a guild ID, use that
        guildid = args[1]
    }

    let letters = ['f53131', 'f58331', 'f5e131', '89f531', '31f579', '31f5e1', '31aaf5', '4062f7', '6a42ed', 'ad52f7', 'e540f7', 'f531c4', 'f0325b'];
    let colour = "0x" + letters[Math.floor(Math.random() * letters.length)];

    guildcol = bot.guilds.find(guild => guild.id === guildid) // Set guildcollection to the collection gotten from the guilds ID
    if(guildcol === null) return message.channel.send('An error has occured! Maybe you typed the ID incorrectly, or maybe the bot simply isn\'t on that server?');

    let today = new Date()
    let guildcreate = new Date(guildcol.createdAt)
    let gctz = new Date(guildcreate).toGMTString()
    let diff = Math.floor((today.getTime() - guildcreate.getTime()) / (1000 * 3600 * 24));
    let veriflvl = ["None - Unrestricted.",
                    "Low - Must have a verified email on their Discord account.",
                    "Medium - Must have a verified email and also be registered on Discord for longer than 5 minutes.",
                    "(╯°□°）╯︵ ┻━┻ - Must have a verified email, registered on Discord longer than 5 minutes, and also be a member of this server for longer than 10 minutes.", 
                    "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻ - Must have a verified email, registered on Discord longer than 5 minutes, be a member of this server for longer than 10 minutes, and have a registered phone on their Discord account."]
    let explicitlvl = ["Don't scan any messages.",
                    "Scan messages from members without a role.",
                    "Scan messages sent by all members."]
    let afkChannelName = "There is no set AFK voice channel."
    if(guildcol.afkChannel) afkChannelName = `The AFK voice channel is set to ${guildcol.afkChannel.name}`
    let afkTO = "There is no AFK timeout."
    if(guildcol.afkTimeout != 18000 / 60) afkTO = `The AFK timeout is ${guildcol.afkTimeout * 60} minutes`
    let gcregion = `${guildcol.region}`
    let region = gcregion.replace(/^\w/, c => c.toUpperCase())
    let gcverif = `${guildcol.verified}`
    let verif = gcverif.replace(/^\w/, c => c.toUpperCase())

    let embed = new Discord.RichEmbed()
    embed.setTitle(`${guildcol.name}`)
    embed.setDescription(`Guild ID: ${guildcol.id}\n\u2800`)
    if(guildcol.iconURL) embed.setThumbnail(`${guildcol.iconURL}`)
    embed.addField(`Owner: ${guildcol.owner.user.tag}`, `ID: ${guildcol.ownerID}\nDisplay: ${guildcol.owner.displayName}\n\u2800`, true)
    embed.addField(`User count: ${guildcol.members.size}`, `Members: ${guildcol.members.filter(member => !member.user.bot).size}\nBots: ${guildcol.members.filter(member => member.user.bot).size}`, true)
    embed.addField(`Created time`, `${gctz}\nThis is ${diff} days ago!\n\u2800`, true)
    embed.addField(`AFK`, `${afkChannelName}\n${afkTO}`, true)
    embed.addField(`Total channels: ${guildcol.channels.size}`, `${guildcol.channels.filter(channel => channel.type == 'category').size} categories\n${guildcol.channels.filter(channel => channel.type == 'text').size} text channels\n${guildcol.channels.filter(channel => channel.type == 'voice').size} voice channels`, true)
    embed.addField(`Roles and emojis`, `Roles: ${guildcol.roles.size}\nEmojis: ${guildcol.emojis.size}\n\u2800\n\u2800`, true)
    embed.addField(`Region`, `${region}\n\u2800`, true)
    embed.addField(`Verified`, `${verif}`, true)
    embed.addField(`Verification level`, `${veriflvl[guildcol.verificationLevel]}`, true)
    embed.addField(`Explicit Content filter`, `${explicitlvl[guildcol.explicitContentFilter]}`, true)
    if (guildcol.splashURL) embed.setImage(guildcol.splashURL)
    embed.setColor(colour)
    embed.setFooter(`${NAME}\u2800⬥\u2800Version ${VERSION}\u2800⬥\u2800${prefix}gi (guildID)`)
    message.channel.send(embed)
}


// AFK Channel  .afkChannel
// AFK Timeout  .afkTimeout
//      Createdat    .createdAt   | .createdTimestamp
//      Emoji count  .emojis.size
//      Icon URL     .iconURL
//      id           .id
//      Membercount  .memberCount
//      Userscount   .members.size
//      name         .name
//      Owner name   .owner.username | .owner.discriminator
//      Owner ID     .ownerID
// Region       .region
//      Role count   .roles.size
//      Splash URL   .splashURL
// Verif lvl    .verificationLevel
// Verified     .verified

module.exports.config = {
    command: ["guildinfo", "gi"],
    permlvl: "All",
    help: ["Other", "Gets a little bit of information about the guild.",
            "All", "", "Gets information about the current guild.",
            "All", "[guildID]", "Gets information about the guild with that ID, provided the bot is in there."]
}