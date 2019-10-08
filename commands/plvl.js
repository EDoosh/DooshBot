const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    // If there isn't a config to edit, show error
    if(!args[1]) return errormsg.run(bot, message, args, 1, "Unspecified config");
    if(!args[2]){ // If the user wants the levels its currently set to
        switch(args[1]){ // Sets case search to first argument
            case 'kick': // If they want to get the kick level...
                let kicklevel = await db.get(`plvl_kick_${message.guild.id}`) // Get the kick level from the DB and set it to kicklevel
                message.channel.send(`The current kick level is set to \`${kicklevel}\``) // Announce
                break; // Exit the case.
            case 'ban':
                let banlevel = await db.get(`plvl_ban_${message.guild.id}`)
                message.channel.send(`The current ban level is set to \`${banlevel}\``)
                break;
            case 'notify':
                let warnlevel = await db.get(`plvl_warn_${message.guild.id}`)
                message.channel.send(`The current notify level is set to \`${warnlevel}\``)
                break;
            case 'serverlevels':
            case 'sl':
                let serverlevelson = await db.get(`lvlon_${message.guild.id}`)
                let slon = (serverlevelson) ? serverlevelson : false
                message.channel.send(`Server levelling and level messages are set to \`${slon}\``)
                break;
            case 'levelmessages':
            case 'lm':
                let minlvlf = await db.get(`lvlm_${message.guild.id}`)
                let minlvl = (minlvlf) ? minlvlf : 0
                message.channel.send(`The minimum required levels for a level-up message is \`${minlvl}\``)
                break;
        }
    } else { // If there is something to set the values to..
        switch(args[1]){ // Sets case search to first argument
            case 'kick': // If they want to set the kick level...
                db.set(`plvl_kick_${message.guild.id}`, args[2]); // Set the database to second argument
                message.channel.send(`Kick level set to \`${args[2]}\` warns.`); // Announce the change
                break; // Exit the case

            case 'ban':
                db.set(`plvl_ban_${message.guild.id}`, args[2]);
                message.channel.send(`Ban level set to \`${args[2]}\` warns.`);
                break;

            case 'notify':
                db.set(`plvl_warn_${message.guild.id}`, args[2]);
                message.channel.send(`Notify level set to \`${args[2]}\` warns.`);
                break;

            case 'serverlevels':
            case 'sl':
                let tf = (args[2] == 't' || args[2] == 'true') ? true : false
                db.set(`lvlon_${message.guild.id}`, tf);
                message.channel.send(`Server levelling and level messages are now set to \`${tf}\`.`);
                break;

            case 'levelmessages':
            case 'lm':
                db.set(`lvlm_${message.guild.id}`, args[2])
                message.channel.send(`Server levelling messages will now be sent at a minimum of ${args[2]} levels.`)
                break;
        }
    }
}

module.exports.config = {
    command: ["plvl", "permlvl", "permslvl", "permissionslvl", "plevel", "permlevel", "permslevel", "permissionslevel"],
    permlvl: "Admin",
    help: ["Admin", "Server configuration. Like modify but for things not related to roles and channels.",
            "Admin", "[kick | ban | notify]", "Get the amount of warns required to kick/ban the user, or notify in the logchannel.",
            "Admin", "[kick | ban | notify] [warn-count]", "Set the amount of warns required to kick/ban the user, or notify in the logchannel.",
            "Admin", "[kick | ban | notify] 0", "Disable the amount of warns required to kick/ban the user, or notify in the logchannel.",
            "Admin", "serverlevels [true | false]", "Enable server levels, level up messages, and level roles.",
            "Admin", "levelmessages [min-levels]", "Sets the minimum required levels for level messages to start sending."]
}