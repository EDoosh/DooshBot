const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args) => {
    let dmto = bot.users.get(msgUserID) // Set the bot to DM to the command issuer
    let a = 1;
    if(args[1] === 'c') { // If the first argument is c, set it to send in the channel instead
        dmto = message.channel;
        a = 2;
    }

    let category =  ["Bot",    "Fun",    "Role Modify", "Mod",    "Admin",  "Trusted","EDoosh", "Other"]
    let catcolour = ["eee655", "58ee55", "8f5eeb",      "ee55e1", "ee5555", "000000", "ffffff", "55eeee"]
    let catdesc =   ["Information about the bot.", "Some fun little commands to spice up the server.", "Commands to use to modify your custom role.", "Commands for moderators only.",
                    "Commands for admins only.", "Special features only trusted members may use.", "hey me.", "Some other things that everyone can use but don't fit into any other category."]

    let ignoremissinghelp = ["pong", "testing"]
    let footer = `${NAME}'s Command Help\u2800⬥\u2800Version ${VERSION}\u2800⬥\u2800${prefix}help c [command name]` 

    if(args[a] == 's') {
        dmto.send(`**__The following is essential in setting up a server with ${NAME}.__**` +
                    `\n**${prefix}h c** - *This sends the help screen to the current channel. It's good to familiarise yourself with some of these commands, and with the functionality this bot has to offer.*` +
                    `\n**${prefix}m ar [role-name]** - *Adds roles to the admin permission for the bot. This allows anyone with one of those roles to run anything from the 'Mod' and 'Admin' sections of the help screen.*` + 
                    `\n**${prefix}m mr [role-name]** - *Adds roles to the mod permission for the bot. This allows anyone with one of those roles to run anything from the 'Mod' section of the help screen*` +
                    `\n\`If you accidentally add a role which you didn't want to add, you can simply run the command again to remove it.\``)
        dmto.send(`**__The following is optional, but quite recommended when setting up a server with ${NAME}.__**` + 
                    `\n**${prefix}m lc [channel-mention]** - *Sets the log channel to that location. If you want to log commands that your staff use, this is where they will go.*` +
                    `\n**${prefix}m bu [channel-mention]** - *Sets the update channel, for whenever the bot is updated. I'd recommend having this so you can know the latest features in the bot.*` +
                    `\n**${prefix}plvl [kick | ban] [warn amount]** - *Sets the amount of warns required before a user is kicked or banned from the server automatically. Leaving this, or setting it to 0, disables this.*` +
                    `\n**${prefix}plvl notify [warn amount]** - *Sets the amount of warns required to send a message in the logchannel stating that they have reached x amount of warns.*`)
        dmto.send(`**__The following is optional, and mostly just for fun.__**` +
                    `\n**${prefix}m qc [channel-mention]** - *Sets the channel that quotes will be sent in. Quotes are just messages that mods may find funny or informational, so they quote it and it'll be sent to that channel.*` +
                    `\n**${prefix}prefix [new-prefix]** - *I'd recommend only doing this if you need to set a new prefix due to clashing with other bots.*` +
                    `\n**${prefix}m rm [role-name]** - *Adds roles to the role-modify permission for the bot. Role Modify is a feature which allows members to create and edit their own roles with the bot.*` +
                    `\n\`If you have any more questions, or just know how to phrase what I say better, DM EDoosh#9599, or join the invite link with ${prefix}info\``)

                //    ESSENTIAL
                // Admin
                // Mod
                //    OPTIONAL BUT RECOMMENDED
                // Log-channel & update channel
                // PLvls
                //    OPTIONAL
                // quotechannel
                // prefix
                // role-modify

    } else if(category.includes(args[a])) {  // BY CATEGORY
        let specpos = category.indexOf(args[a])
        let speccatembed = new Discord.RichEmbed().setColor(`0x${catcolour[specpos]}`).setAuthor(`${category[specpos]}   |   ${catdesc[specpos]}`, `http://singlecolorimage.com/get/${catcolour[specpos]}/128x128`).setFooter(footer)
        
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            const commande = require(`./${file}`);
            if(!commande.config.help) {
                if(!ignoremissinghelp.includes(commande.config.command[0])) console.log(`A file was missing a help section (${file}).`)
                continue;
            }

            if(commande.config.help[0] == args[a]) speccatembed.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`, false);
        }
        await dmto.send(speccatembed).catch((err) => { // If sending the message wasnt successful, announce.
            errormsg.run(bot, message, args, "a", `\`Failed while sending the message. Maybe DMs are disabled?\`\nTry \`${prefix}${this.config.command[0]} ${this.config.help[5*3]}\``)
        })
    } else if(args[a]) {  // If the user wants command help
        if(args[a] == 'n' && msgUserID != 267723762563022849 || args[a] == 'nsfw' && msgUserID != 267723762563022849) return
        let helpcmd = bot.commands.get(args[a].toLowerCase()) // Get the command they want help for
        if(!helpcmd) return message.channel.send(`The command \`${prefix}${args[a]}\` does not exist!`) // If it doesnt exist, say so

        let hcmd = helpcmd.config.help
        let pos = category.indexOf(`${hcmd[0]}`)

        let hcmdembed = new Discord.RichEmbed()
        hcmdembed.setAuthor(`${category[pos]}   |   ${prefix}${helpcmd.config.command[0]}`, `http://singlecolorimage.com/get/${catcolour[pos]}/128x128`)
        hcmdembed.setDescription(`Description: ${hcmd[1]}\nAliases: ${helpcmd.config.command.join(', ')}\n\u2800`)
        hcmdembed.setColor(`0x${catcolour[pos]}`)
        hcmdembed.setFooter(footer)
        for(i=2; i < helpcmd.config.help.length; i+=3) { // For the length of the commands help, run this
            hcmdembed.addField(`${hcmd[i]}  |  ${prefix}${helpcmd.config.command[0]} ${hcmd[i+1]}`, `${hcmd[i+2]}`)
        }
        dmto.send(hcmdembed).catch(() => { // If sending the message wasnt successful, announce.
            errormsg.run(bot, message, args, " ", `Failed while sending the message. Maybe DMs are disabled?\`\nTry \`${prefix}${this.config.command[0]} ${this.config.help[5*3]}\``)
        })
    } else {
        let helpabout = new Discord.RichEmbed().setColor(`0x${catcolour[0]}`).setAuthor(`${category[0]}   |   ${catdesc[0]}`, `http://singlecolorimage.com/get/${catcolour[0]}/128x128`).setFooter(footer);
        let helpfun = new Discord.RichEmbed().setColor(`0x${catcolour[1]}`).setAuthor(`${category[1]}   |   ${catdesc[1]}`, `http://singlecolorimage.com/get/${catcolour[1]}/128x128`).setFooter(footer);
        let helprm = new Discord.RichEmbed().setColor(`0x${catcolour[2]}`).setAuthor(`${category[2]}   |   ${catdesc[2]}`, `http://singlecolorimage.com/get/${catcolour[2]}/128x128`).setFooter(footer);
        let helpmod = new Discord.RichEmbed().setColor(`0x${catcolour[3]}`).setAuthor(`${category[3]}   |   ${catdesc[3]}`, `http://singlecolorimage.com/get/${catcolour[3]}/128x128`).setFooter(footer);
        let helpadmin = new Discord.RichEmbed().setColor(`0x${catcolour[4]}`).setAuthor(`${category[4]}   |   ${catdesc[4]}`, `http://singlecolorimage.com/get/${catcolour[4]}/128x128`).setFooter(footer);
        let helpcmds = new Discord.RichEmbed().setColor(`0x${catcolour[5]}`).setAuthor(`${category[5]}   |   ${catdesc[5]}`, `http://singlecolorimage.com/get/${catcolour[5]}/128x128`).setFooter(footer);
        let helped = new Discord.RichEmbed().setColor(`0x${catcolour[6]}`).setAuthor(`${category[6]}   |   ${catdesc[6]}`, `http://singlecolorimage.com/get/${catcolour[6]}/128x128`).setFooter(footer);
        let helpother = new Discord.RichEmbed().setColor(`0x${catcolour[7]}`).setAuthor(`${category[7]}   |   ${catdesc[7]}`, `http://singlecolorimage.com/get/${catcolour[7]}/128x128`).setFooter(footer);

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            const commande = require(`./${file}`);
            if(!commande.config.help) {
                if(!ignoremissinghelp.includes(commande.config.command[0])) console.log(`A file was missing a help section (${file}).`)
                continue;
            }

            if(commande.config.help[0] == "Bot") helpabout.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "Fun") helpfun.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "Role Modify") helprm.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "Mod") helpmod.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "Admin") helpadmin.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "Trusted") helpcmds.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "EDoosh") helped.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
            if(commande.config.help[0] == "Other") helpother.addField(`${prefix}${commande.config.command[0]}`, `${commande.config.help[1]}`);
        }

        await dmto.send(helpabout).then(async () => { // It will attempt to send to the user/channel
            await dmto.send(helpfun); // If successful, send the rest
            if(hasRoleMod || hasAdmin || useallcmds.includes(msgUserID)) await dmto.send(helprm); // Check if they have admin or rolemod
            if(hasMod || hasAdmin || useallcmds.includes(msgUserID)) await dmto.send(helpmod); // Check if they have admin or mod
            if(hasAdmin || useallcmds.includes(msgUserID)) await dmto.send(helpadmin); // Check if they have admin
            if(useallcmds.includes(msgUserID)) await dmto.send(helpcmds); // Check if they have useallcmds
            if(msgUserID == 267723762563022849) await dmto.send(helped); // Check if they have useallcmds
            await dmto.send(helpother);
            // If they haven't got admin say commands were ommitted.
            if(!hasAdmin && !useallcmds.includes(msgUserID)) await dmto.send(`Some commands have been ommitted, as you do not have access to the commands in the server you used '${prefix}help' in.`)
        }).catch((err) => { // If sending the message wasnt successful, announce.
            errormsg.run(bot, message, args, "a", `\`Failed while sending the message. Maybe DMs are disabled?\`\nTry \`${prefix}${this.config.command[0]} ${this.config.help[5*3]}\``)
        })
    }
}

// USED COLOURS
// BLACK
// WHITE
// LBLUE
// RED
// MAGENTA
// GREEN
// YELLOW

module.exports.config = {
    command: ["help", "h"],
    permlvl: "All",
    help: ["Bot", "Display all the commands for the bot.",
            "All", "", "DM to the user this help screen.",
            "All", "s", "Get help with setting up the bot on your server for the first time.",
            "All", "[command name]", "Display all the sub-commands of a command, and how to use them!",
            "All", "[category name]", "Display all the commands in a category, instead of showing the full list.",
            "All", "c", "Send the help screen to the current channel. Can be put in front of any of these commands."]
}