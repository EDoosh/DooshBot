const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    let lvl;
    let a = 1
    let type = 'server';
    if(args[1] == 'g' || args[1] == 'global') {
        lvl = await db.get(`lvl`)
        a = 2
        type = 'global'
    } else lvl = await db.get(`lvl_${message.guild.id}`);
    let lvlenabledfetch = await db.get(`lvlon_${message.guild.id}`)
    let lvlon = (lvlenabledfetch == true) ? true : false

    if(args[a] == 'c' || args[a] == 'clear') a += 1

    let mentions = message.mentions.members.first(); // Get the mentioned person
    let user; // Set the usercollection to blank
    if(mentions) user = bot.users.find(userf => userf.id == mentions.id) // If there is a mentioned person, set usercollection to be the retrieved user collection
    else if(bot.users.find(userf => userf.id === args[a])) user = bot.users.find(userf => userf.id == args[a]) // Otherwise check if a userID was said, set usercollection to be the retrieved user collection
    else if(bot.users.find(userf => userf.username === args[a])) user = bot.users.find(userf => userf.username === args[a]) // Otherwise check if a raw username was said, set... you get the point
    else user = message.author // If no other checks were passed, set usercollection to the author's collection

    if(args[a] == 'top' || args[a] == 't') {
        // Get the page number
        let pageno = (args[a+1]) ? args[a+1] : 1
        // Check if it is larger than the number of pages available. If so, throw error.
        if (pageno > Math.ceil(lvl.score.length / 10) || pageno < 1) return errormsg.run(bot, message, args, 2, "Too high of a page number")

        // Get the scores and sort them
        let scores = lvl.score
        let lvlscore = lvl.score
        console.log(lvlscore)
        scores.sort(function(a, b){return b - a});
        // For all scores, find the index of the sorted score in lvl.score, then use that index to get the user and push that user's id into the users array
        let users = [];
        for(const s of scores){
            users.push(lvl.user[lvl.score.indexOf(s)])
            console.log(`s: ${s}  lvlscore: ${lvlscore}  Index: ${lvlscore.indexOf(s)}   ID: ${lvl.user[lvlscore.indexOf(s)]}`)
        }

        console.log(`Scores: ${scores}     Users: ${users}`)

        let out = `:trophy:  **${message.guild.name}'s leaderboard**\n`
        // For all the users, 
        for(i = pageno * 10 - 10; i < (pageno * 10) && i < scores.length; i++){
            out += `\n> **${i+1}** `
            if(i == 0) out += `:first_place:`
            else if(i == 1) out += `:second_place:`
            else if(i == 2) out += `:third_place:`
            else out += `      `
            let usersusername = await bot.users.find(userid => userid.id == users[i])
            if(!usersusername) usersusername = `Account deleted / left - ID (${users[i]})`
            else usersusername = usersusername.username
            out += `     ${usersusername}   ⬥   ${scores[i]}`
        }
        let rank = `\n\`Your Rank = ${users.indexOf(message.author.id) + 1}  ⬥  Your Score = ${scores[users.indexOf(message.author.id)]}\``
        let pageb = `Page ${pageno} of ${Math.ceil(scores.length / 10)}`
        let spaces = Math.ceil((rank.length - (pageb.length + 3)) / 2)
        let page = '\n`'
        for(i=0; i < spaces; i++){
            page += ` `
        }
        page += pageb
        for(i=0; i < spaces; i++){
            page += ` `
        }
        out += rank + page + '`'
        message.channel.send(out)
    } else if(args[a-1] == 'clear' || args[a-1] == 'c') {
        if(!hasAdmin && !useallcmds.includes(msgUserID) && msgUsername != serverOwner) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
        if(type == 'global') return message.channel.send(`No you *can't*  globally reset the leaderboard.`)
        if(!args[a]){
            db.set(`lvl_${message.guild.id}`, { user: [], score: [] })
            message.channel.send(`Successfully reset the server's scores!`)
        } else if(user.id != message.author.id) {
            let index = lvl.user.indexOf(user.id)
            if (index == -1) return errormsg.run(bot, message, args, 3, "Couldn't find that user in the scores")
            lvl.score[index] = 0
            db.set(`lvl_${message.guild.id}.score`, lvl.score)
            message.channel.send(`Successfully reset ${user.username}'s score.`)
        } else return errormsg.run(bot, message, args, 3, "Please enter a valid user (That isn't yourself)")
    } else {
        // Current level stuff
        let index = lvl.user.indexOf(user.id)
        if (index == -1) return message.channel.send(`This user hasn't got a score.`)
        let nowlvl = 0;
        for(i=1; i<=100; i++){
			if(lvl.score[index] > lvltotal[i-1] && lvl.score[index] <= lvltotal[i]) {nowlvl = i; break;}
        }

        // Cooldown stuff
        let timeouttime;
		if(nowlvl < 40) timeouttime = 5
		else if(nowlvl < 75) timeouttime = 3
		else if(nowlvl < 100) timeouttime = 1
        else if(nowlvl = 100) timeouttime = 0

        message.channel.send(`\`\`\`yaml\n${user.username}'s current ${type} level is ${nowlvl}, with a total message count of ${lvl.score[index]}\n\`\`\``)
        message.channel.send(`\`\`\`CSS\nTo get to level ${nowlvl+1}, ${user.username} needs ${lvltotal[nowlvl] - lvl.score[index]} more messages.\n\`\`\``)
        if(type == 'global') message.channel.send(`\`\`\`fix\nBecause of ${user.username}'s global level, their command cooldown is ${timeouttime} seconds.\n\`\`\``)
    }
}

module.exports.config = {
    command: ["lvl", "level"],
    permlvl: "All",
    help: ["Other", "Does stuff with the levels system.",
            "All", "(g) (mention | userID | username)", "Gets your own level and rank. If the 'g' modifier is added, it gets your global level and rank. If a user is specified, it gets their level and rank.",
            "All", "(g) top (page no.)", "Gets the top 10. If the 'g' modifier is added, it gets the global top 10.",
            "Admin", "clear (mention | userID | username)", "Clears the entire server's levels. If a user is specified, it only clears theirs."],
    helpg: ""
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