const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(args[1]) { // If there is a second argument
        let mentionedmember; // Set variables
        let tellmenum;
        let memberid;
        if(message.mentions.members.first()) { // If there is a mentioned member
            if(args[2]) { // If there is a second argument
                mentionedmember = bot.users.find(user => user.id == message.mentions.members.first().id).username; // Get the username of the mentioned member
                memberid = message.mentions.members.first().id // Get the ID of the mentioned member
                args[1] = args[2] // Combine everything after the mention to evaluate it
                for(i = 2 + 1; i < args.length; i++) {
                    args[1] += ' ' + args[i];
                }
            } else { // If there is nothing to evaluate, say so.
                return errormsg.run(bot, message, args, 1, "Unspecified thing to evaluate")
            }
        } else if (bot.users.find(user => user.username === args[1])) { // If a user is mentioned by name...
            // Make sure there is something to evaluate
            if(!args[2]) return errormsg.run(bot, message, args, 1, "Unspecified thing to evaluate")
            mentionedmember = args[1] // Set mentioned member to be the username
            memberid = bot.users.find(user => user.username === args[1]).id // MemberID is the users ID
            args[1] = args[2] // Combine everything after the mention to evaluate it.
            for(i = 2 + 1; i < args.length; i++) {
                args[1] += ' ' + args[i];
            }
        } else if (bot.users.find(user => user.id === args[1])) { // If there is a user mentioned by ID...
            // Make sure there is something to evaluate
            if(!args[2]) return errormsg.run(bot, message, args, 1, "Unspecified thing to evaluate")
            mentionedmember = bot.users.find(user => user.id == args[1]).username; // Set mentioned member to username by finding by ID
            memberid = args[1] // MemberID is the users ID
            args[1] = args[2] // Combine everything after the mention to evaluate it.
            for(i = 2 + 1; i < args.length; i++) {
                args[1] += ' ' + args[i];
            }
        } else { // If there is not a mentioned member
            mentionedmember = message.author.username // Get the username of the message author
            memberid = message.author.id // Get the authors ID
            for(i = 1 + 1; i < args.length; i++) { // Combine everything after the mention to evaluate it
                args[1] += ' ' + args[i];
            }
        }

        let ftellme = await db.fetch(`tm_${args[1]}_${memberid}`); // Get the number it previously evaluated at from the database
        if (ftellme === null) { // If it wasn't previously evaluated, it returns null
            tellmenum = parseInt(Math.random() * 11) // Gets a random number between 1 and 10 to be shown to the member later
            db.set(`tm_${args[1]}_${memberid}`, tellmenum) // Adds to the database so it can be retrieved next time
        } else { // If it was previously evaluated
            tellmenum = ftellme; // Sets the number that will be told to the member to the one gotten from the database
        }
        message.channel.send(`**${mentionedmember}** scored a **${tellmenum}/10** for **${args[1]}**!`) // Show the member
    } else { // If there isn't an argument 1, show error
    errormsg.run(bot, message, args, 2, "Unspecified thing to evaluate");
    }
}

module.exports.config = {
    command: ["tellme", "tm"],
    permlvl: "All",
    help: ["Fun", "Tells you something about someone on a scale of 0-10.",
            "All", "[thing]", "Tells you something about yourself on a scale of 0-10!",
            "All", "[userRepresentable] [thing]", "Tells you something about another user on a scale of 0-10!"]
}