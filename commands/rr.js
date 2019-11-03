const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    // Reaction Roles is mostly credit to https://github.com/Sam-DevZ/Discord-RoleReact/blob/master/role.js
    if(args[1] == 'l') {
        let rrl = await db.get(`rr_${message.guild.id}`)
        let slmsg = [`**${message.guild.name}'s Reaction Role messages.**\n`]
        for(i=0; i < rrl.length; i++){
            let rrg = rrl[i]
            let rrgchan = await message.guild.channels.find(x => x.id == rrg.channelID)
            try {
                let rrgmsg = await rrgchan.fetchMessage(rrg.messageID)
                slmsg.push(`**${i+1}** - **${rrg.reactions.length} Reaction Roles** in ${rrgchan} by *${rrgmsg.author.tag}*\n\`${rrgmsg.url}\``)
            } catch {
                slmsg.push(`**${i+1}** - :grey_exclamation: Deleted Message\n\`ID - ${rrg.messageID}\``)
            }
        }
        return message.channel.send(slmsg.join('\n'))
    }

    if(!args[1]) return errormsg.run(bot, message, args, "a", `\`Missing messageID!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)
    if(!args[2]) return errormsg.run(bot, message, args, "a", `\`Missing argument!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)
    try {
        var rrmsg = await message.channel.fetchMessage(args[1])
    } catch {
        return errormsg.run(bot, message, args, "a", `\`Invalid messageID! Make sure you use it in the same channel.\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)
    };
    let rrf = await db.get(`rr_${message.guild.id}`)
    let rr = rrf ? rrf : (rrmsg ? [{ messageID : rrmsg.id, channelID : rrmsg.channel.id, reactions : [] }] : []);

    let aindex = -1;
    for(i=0; i < rr.length; i++) {
        if(rr[i].messageID == rrmsg.id) {
            aindex = i
            break;
        }
    }

    switch(args[2]) {
        case 'add':
        case 'new':
        case 'a':
            for(i = 4 + 1; i < args.length; i++) {
            	args[4] += ' ' + args[i];
            }
            let emoji;
            if(message.guild.emojis.find(e => e.id == args[3])) emoji = message.guild.emojis.find(e => e.id == args[3])
            else if(message.guild.emojis.find(e => e == args[3])) emoji = message.guild.emojis.find(e => e == args[3])
            else if(message.guild.emojis.find(e => e.name == args[3])) emoji = message.guild.emojis.find(e => e.name == args[3])
            else emoji = args[3]

            let role;
            if(message.guild.roles.find(r => r.id == args[4])) role = message.guild.roles.find(r => r.id == args[4])
            else if(message.guild.roles.find(r => r.name == args[4])) role = message.guild.roles.find(r => r.name == args[4])
            else return errormsg.run(bot, message, args, 1, "Invalid role")
            if(message.member.highestRole.comparePositionTo(role) <= 0) return errormsg.run(bot, message, args, 1, "Can't use a role higher than or equal to your current highest role")

            if(aindex == -1){
                aindex = rr.length;
                let toPush = {
                    'messageID' : rrmsg.id,
                    'channelID' : rrmsg.channel.id,
                    'reactions' : []
                }
                rr[aindex] = toPush
            }

            let rolemoji = {
                'emoji' : (emoji.id ? emoji.id : emoji),
                'role' : role.id
            }
            rr[aindex].reactions.push(rolemoji)

            if(emoji != args[3]) await rrmsg.react(emoji.id)
            else await rrmsg.react(emoji).catch(() => {
                return errormsg.run(bot, message, args, 1, "Invalid emoji")
            })
            db.set(`rr_${message.guild.id}`, rr)
            message.channel.send(`Added ${emoji} to ${rrmsg.member.displayName}'s message, assigned to role ${role.name}`)
            break;

        case 'delete':
        case 'del':
        case 'd':
            if(!args[3]) return errormsg.run(bot, message, args, 2, "Unspecified ID");
            if(parseInt(args[3]) > rr[aindex].reactions.length || parseInt(args[3]) < 1) return errormsg.run(bot, message, args, 2, "Specified ID too high");
            let removed = rr[aindex].reactions.splice(parseInt(args[3]) - 1, 1)
            removed = removed[0]
            db.set(`rr_${message.guild.id}`, rr)
            let emojivis = await message.guild.emojis.find(e => e.id == removed.emoji)
            let rolemention = await message.guild.roles.find(r => r.id == removed.role)
            message.channel.send(`Removed ${emojivis ? emojivis : removed.emoji} from ${rrmsg.member.displayName}'s message, which was assigned to role ${rolemention ? rolemention : `Deleted Role (${removed.role})`}`)
            break;

        case 'list':
        case 'all':
        case 'l':
            if(aindex === -1 || rr[aindex].reactions.length === 0) return message.channel.send(`There are no Role Reactions for this message!`);
            let lmsg = [`**${rrmsg.member.displayName}'s message's Role Reactions.**\n\`${rrmsg.url}\`\n`]
            for(i=1; i <= rr[aindex].reactions.length; i++) {
                let emojivis = await message.guild.emojis.find(e => e.id == rr[aindex].reactions[i-1].emoji)
                let rolemention = await message.guild.roles.find(r => r.id == rr[aindex].reactions[i-1].role)
                lmsg.push(`**${i}** - ${emojivis ? emojivis : rr[aindex].reactions[i-1].emoji} - *${rolemention ? rolemention : `Deleted Role (${rr[aindex].reactions[i-1].role})`}*`)
            }
            message.channel.send(lmsg.join('\n'))
            break;

        case 'clear':
        case 'clr':
        case 'c':
            if(aindex === -1 || rr[aindex].reactions.length === 0) return message.channel.send(`There are no Role Reactions for this message!`);
            for(i=0; i < rr.length; i++) {
                if(rr[i].messageID == args[1]) {
                    var idToRemove = i;
                    break;
                }
            }
            if(idToRemove === null) return errormsg.run(bot, message, args, 4, "That MessageID does not have any reaction roles");
            let cleared = rr.splice(idToRemove - 1, 1)
            cleared = cleared[0]
            db.set(`rr_${message.guild.id}`, rr)
            message.channel.send(`Cleared all ${cleared.reactions.length} reaction roles from ${rrmsg.member.displayName}'s message.`)
            break;


        default:
            return errormsg.run(bot, message, args, "a", `\`Invalid arguments!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``);
    }
}

module.exports.config = {
    command: ["rr", "reactionrole"],
    permlvl: "Admin",
    help: ["Admin", "Create a reaction role message on a message.",
            "Admin", "[messageID] a [reaction] [role-name]", "Create a reaction role on a message.",
            "Admin", "[messageID] d [ID]", "Delete a reaction role off a message by its RR ID.",
            "Admin", "[messageID] l", "List all the reaction roles on a message with their RR IDs.",
            "Admin", "[messageID] c", "Clear all the reaction roles off a message.",
            "Admin", "l", "List all reaction role messages."],
    helpg: "[messageID] [a | d | l | c]"
}




//    ERROR MESSAGE
// errormsg.run(bot, message, args, IDOfTheHelpCommand, "Errormsg")
// errormsg.run(bot, message, args, "a", `\`reason!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``)


//    LOG CHANNEL
// if(logChannel != 0) logChannel.send()


//    GET THE USER COLLECTION, USERNAME, AND ID
// let mentions = message.mentions.members.first(); // Get the mentioned person
// let usercollection; // Set the usercollection to blank
// if(mentions) usercollection = bot.users.find(user => user.id == mentions.id) // If there is a mentioned person, set usercollection to be the retrieved user collection
// else if(bot.users.find(user => user.id === args[1])) usercollection = bot.users.find(user => user.id == args[1]) // Otherwise check if a userID was said, set usercollection to be the retrieved user collection
// else if(bot.users.find(user => user.username === args[1])) usercollection = bot.users.find(user => user.username === args[1]) // Otherwise check if a raw username was said, set... you get the point
// else usercollection = message.author // If no other checks were passed, set usercollection to the author's collection
// mentionsid = usercollection.id
// mentionsun = usercollection.username


//    COMBINE ARGUMENTS
// for(i = combineTo + 1; i < args.length; i++) {
// 	args[combineTo] += ' ' + args[i];
// }


//    ERROR MESSAGES
// message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
// message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
// message.channel.send('`Error - Requires Role Change permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify role-modify [role name]`');
// message.channel.send('Error - Requires EDoosh or other approved members to run this command! Wait, how did you find out about it..?');
// message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');


//    CHECK FOR PERMS
// hasMod
// hasAdmin
// hasRoleMod
// useallcmds.includes(msgUserID)
// msgUserID == 267723762563022849