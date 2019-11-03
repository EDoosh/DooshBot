const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    // Get the server's information and turn it into a json
    let serverlevels = await db.get(`lvlon_${message.guild.id}`)
    let globalmessages = await db.get(`glvling_${message.guild.id}`)
    let levelmessages = await db.get(`lvlm_${message.guild.id}`)
    let cfgoptions = {
        "array": [ {
            "title" : "Kick",
            "desc" : "The amount of warns required to automatically kick someone.",
            "value" : `${await db.get(`plvl_kick_${message.guild.id}`)} warns`,
            "dbpre" : 'plvl_kick',
            "type" : "num"
        }, {
            "title" : "Ban",
            "desc" : "The amount of warns required to automatically ban someone.",
            "value" : `${await db.get(`plvl_ban_${message.guild.id}`)} warns`,
            "dbpre" : 'plvl_ban',
            "type" : "num"
        }, {
            "title" : "Notify",
            "desc" : "The amount of warns required to automatically send a message in the Log Channel notifying staff of their warn amount.",
            "value" : `${await db.get(`plvl_warn_${message.guild.id}`)} warns`,
            "dbpre" : 'plvl_warn',
            "type" : "num"
        }, {
            "title" : "Server levels",
            "desc" : "Whether server levelling should be enabled.",
            "value" : serverlevels ? serverlevels : false,
            "dbpre" : 'lvlon',
            "type" : "bool"
        }, {
            "title" : "Global messages",
            "desc" : "Whether the bot should send messages when a user globally levels up. Doesn't send if 'Server levels' is disabled.",
            "value" : globalmessages ? globalmessages : false,
            "dbpre" : 'glvling',
            "type" : "bool"
        }, {
            "title" : "Level messages",
            "desc" : "At what minimum level the bot should send level up messages. Doesn't send if 'Server levels' (Or 'Global messages' if it's a global level up) is disabled.",
            "value" : levelmessages ? `${levelmessages} levels` : `0 levels`,
            "dbpre" : 'lvlm',
            "type" : "num"
        } ]
    };
    // Set all the emojis that it can be reacted with
    var reactions = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3"/*,"\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"*/]
    // Create a new embed with these properties
    let embedAll = new Discord.RichEmbed().setTitle(`Server Configuration`).setDescription(`React with a number to change a value.\nReact with a 0 to cancel the selection.`).setColor(0x2599f7)
    // For the length of the json we created earlier, add a new field with the sub-command's information
    for(i=0; i < cfgoptions.array.length; i++) {
        let item = cfgoptions.array[i]
        embedAll.addField(`${reactions[i+1]} ⠀⠀${item.title}`, `${item.desc}\n*Currently set to \`${item.value}\`*`);
    }

    // Send the message and let embedmsg be the message
    let embedmsg = await message.channel.send(embedAll);
    // Create a filter for the following that returns true only if it reactor is the person who ran -=c, and that it is an allowed reaction.
    const filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
    }
    // Create a reaction collector that gets all reactions that are reacted on the previous message for 10 seconds, as long as it complies with the filter.
    var reactcollector = embedmsg.createReactionCollector(filter, { max: 1, time: 20000, errors: ['time'] })
    // When the message is reacted on...
    reactcollector.on('collect', async resp => {
        // Set reaction to the name of the reaction
        const reaction = resp.emoji.name
        // Create variables for below
        let id;
        // Set switch to the name of the reaction
        switch(reaction) {
            case '0⃣': // If they wish to cancel, then cancel.
                return message.channel.send('Cancelled Server Config selection.')
            case '1⃣': // If they want one of the options, set the ID of the subcommand to its location in the reactions array - 1
            case '2⃣':
            case '3⃣':
            case '4⃣':
            case '5⃣':
            case '6⃣':
                id = reactions.indexOf(reaction) - 1;
                break;
            case 'default': // If none of the above, then idk wtf happened.
                return message.channel.send('An issue occured while trying to register what the fuck you just did.');
        }
        // Delete the old embed message
        embedmsg.delete();
        // Create a new one with the subcommands name, desc, cur value, and what it wants.
        let embedval = new Discord.RichEmbed()
            .setTitle(cfgoptions.array[id].title)
            .setDescription(`${cfgoptions.array[id].desc}\n*Currently set to \`${cfgoptions.array[id].value}\`*\n**Please type ${cfgoptions.array[id].type == 'num' ? 'a number' : 'true or false'} to set a new value.**`)
            .setColor(0x10e851)
        // Then send it
        let valmsg = await message.channel.send(embedval)
        // New filter for below. If it wants a number, make sure it is a number. If it wants a T/F, make sure it is a T/F. Also make sure it is sent by the original person.
        let filterVal = (pmsg) => {
            if(pmsg.author.id !== message.author.id) {
                return false;
            }
            if(cfgoptions.array[id].type == 'num') {
                return !isNaN(pmsg.content);
            } else {
                return (pmsg.content.toLowerCase() == 'true' || pmsg.content.toLowerCase() == 't' || pmsg.content.toLowerCase() == 'false' || pmsg.content.toLowerCase() == 'f');
            }
        }
        // Await a message which complies with the above and is sent within 20 seconds. If there isn't one, show error.
        try {
            var newval = await message.channel.awaitMessages(filterVal, {
                maxMatches:1,
                time: 20000,
                errors: ['time']
            })
        } catch (err) {
            valmsg.delete();
            return message.channel.send(`Server Config value set timed out. Cancelled new value set.`)
        }
        valmsg.delete();
        try { newval.first().delete(); } catch { console.log('') };
        let msgval = cfgoptions.array[id].type == 'bool' ? ((newval.first().content.toLowerCase() == 'true' || newval.first().content.toLowerCase() == 't') ? true : false) : parseInt(newval.first().content)
        db.set(`${cfgoptions.array[id].dbpre}_${message.guild.id}`, msgval);
        message.channel.send(`Set the value of ${cfgoptions.array[id].title} to ${msgval}`);
    })
    // If the message was never reacted on when the time runs out...
    reactcollector.on('end', collected => {
        if(collected.size != 0) return;
        // Delete the message and say so
        embedmsg.delete();
        message.channel.send(`Server Config selection timed out. Cancelled selection.`)
    })

    // React on the server config message. Do this here so that, if a user reacts while the bot is still reacting, it still runs the reactcollector
    for(i=0; i <= cfgoptions.array.length; i++) {
        try {
            await embedmsg.react(reactions[i])
        } catch {
            break;
        }
    }
}

module.exports.config = {
    command: ["config", "c", "cfg", "serverconfig", "sc"],
    permlvl: "Admin",
    help: ["Admin", "Server configuration.",
            "Admin", "[kick | ban | notify]", "Get the amount of warns required to kick/ban/notify a user.",
            "Admin", "[kick | ban | notify] [warn-count]", "Set the amount of warns required to kick/ban/notify.",
            "Admin", "[kick | ban | notify] 0", "Disables kicking/banning/notifying.",
            "Admin", "serverlevels [true | false]", "Enables/disables server levelling, level-up messages, and level roles.",
            "Admin", "levelmessages [min-levels]", "Sets the minimum required levels for level-up messages to send.",
            "Admin", "globalmessages [true | false]", "Enables/disables level-up messages for when a user globally levels up.If enabled, it still won't send if serverlevels or levelmessages requirements aren't met."]
}