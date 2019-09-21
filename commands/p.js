const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime, usedcmd) => {
    if(msgUserID != 267723762563022849) return message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');
    if(!args[1]) return message.channel.send('Requires (s) or (m) dipshit.')
    if(!args[2]) return message.channel.send('Requires (l) or (id) dipshit.')
    // PREMIUM!!!
	const premiummembersid = await db.get(`premiummembers.id`);
	const premiummembersun = await db.get(`premiummembers.un`);
	const premiumserversid = await db.get(`premiumservers.id`);
	const premiumserversownerid = await db.get(`premiumservers.ownerid`);
    switch (args[1]) {
        case 'm':
        case 'member':
            if (args[2] == 'l') {
                let contents = ''
                for(i=0; i < premiummembersun.length; i++){
                    contents += `ID : ${premiummembersid[i]}   |   Patreon : ${premiummembersun[i]}\n`
                }
                message.channel.send(contents)
            } else {
                if(premiummembersid.includes(args[2])) {
                    function findID(curCheck) {
                        return curCheck === args[2]
                    }
                    premiummembersid.splice(premiummembersid.findIndex(findID), 1); // Find the location of the person and remove them
                    premiummembersun.splice(premiummembersid.findIndex(findID) - 1, 1); // Find the location of the person and remove them
                    db.set(`premiummembers`, { id: premiummembersid, un: premiummembersun }); // Set it into the database
                    message.channel.send(`The ID ${args[2]} has been removed from Premium Members for this bot!`); // Announce
                } else{
                    for(i = 3 + 1; i < args.length; i++) {
                        args[3] += ' ' + args[i];
                    }
                    premiummembersid.push(args[2]); // Add it to the end
                    premiummembersun.push(args[3]); // Add it to the end
                    db.set(`premiummembers`, { id: premiummembersid, un: premiummembersun }); // Set it into the database
                    message.channel.send(`The ID ${args[2]} has been added to Premium Members for this bot!`); // Announce
                }
            }
            break;

        case 's':
        case 'server':
            if (args[2] == 'l') {
                let contents2 = ''
                for(i=0; i < premiumserversid.length; i++){
                    contents2 += `ID : ${premiumserversid[i]}   |   Owner ID : ${premiumserversownerid[i]}\n`
                }
                message.channel.send(contents2)
            } else {
                if(premiumserversid.includes(args[2])) {
                    function findID(curCheck) {
                        return curCheck === args[2]
                    }
                    premiumserversid.splice(premiumserversid.findIndex(findID), 1); // Find the location of the person and remove them
                    premiumserversownerid.splice(premiumserversid.findIndex(findID), 1); // Find the location of the person and remove them
                    db.set(`premiummembers`, { id: premiumserversid, un: premiumserversownerid }); // Set it into the database
                    message.channel.send(`The ID ${args[2]} has been removed from Premium Servers for this bot!`); // Announce
                } else{
                    for(i = 3 + 1; i < args.length; i++) {
                        args[3] += ' ' + args[i];
                    }
                    premiumserversid.push(args[2]); // Add it to the end
                    premiumserversownerid.push(args[3]); // Add it to the end
                    db.set(`premiummembers`, { id: premiumserversid, ownerid: premiumserversownerid }); // Set it into the database
                    message.channel.send(`The ID ${args[2]} has been added to Premium Servers for this bot!`); // Announce
                }
            }
            break;
    }
}

module.exports.config = {
    command: "p"
}