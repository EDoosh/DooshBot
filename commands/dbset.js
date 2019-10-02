const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    // // If they want to know the databases available by typing key at the end, show it to them
    // if(args[1] === "key") return message.channel.send(`rmrole: rmrole\\_guildid\nmodrole: modrole\\_guildid\nadminrole: adminrole\\_guildid\n` + 
    //                                                     `logChannel: logChannel\\_guildid\nprefix: prefix\\_guildid\n` + 
    //                                                     `Warns: warns\\_warnedid\\_guildid \n AVAILABLE WARN OBJECTS: .amount .reasons .time .warner .warnerusername\n` + 
    //                                                     `TellMe: tm\\_tellme\\_ userid`)
    if(!args[2]) return message.channel.send(`${prefix}dbset (value) (db)`) // If there isn't a database to go to, throw an error
    for(i = 2 + 1; i < args.length; i++) { // Combine everything past argument 2 into arg 2
    	args[2] += ' ' + args[i];
    }
    db.set(args[2], args[1]) // Set it into the database
    message.channel.send('Done!') // Announce
    console.log(`${message.author.username} (${message.author.id}) ran '${message.content}'`)
}

module.exports.config = {
    command: ["dbset", "dbs"],
    permlvl: "Trusted",
    help: ["Trusted", "Set something in the database.",
            "Trusted", "[value] [database]", "Set a value in a database."]
}