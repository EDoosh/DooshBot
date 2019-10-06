// Get the plugins
const Discord = require('discord.js');
const bot = new Discord.Client();
const db = require('quick.db');
const fs = require('fs');

// Invite link:
// https://discordapp.com/oauth2/authorize?client_id=619532419061514240&scope=bot&permissions=8

// Startup variables
const token = fs.readFileSync('token.txt').toString(); // Make it so any of you reading on GitHub don't steal my bot >:(
global.NAME = 'DooshBot'; // Set name in case I want to change it later
global.VERSION = 'Beta 2.1.0'; // Same with version. 

// Default settings. 
global.prefix = "-=";
global.adminrole = [];
global.modrole = [];
global.rmrole = [];
global.useallcmds = [];
global.logChannel = '';
global.usedcmd = new Set();

global.useallcmds = [
	'267723762563022849', // Me
	'189125691504066561', // Finn
	'274972137092284416' // Kelley
] 

global.premiummembers = [
	'267723762563022849', // Me
	'189125691504066561', // Finn
	'274972137092284416' // Kelley
]
global.premiumservers = [
	'619704310615506955', // DooshBot (Mine)
	'469048258304671745' // Team Optimus (Mine)
]

//command system   THABK YOU SPUTNIX FOR THIS
bot.commands = new Discord.Collection()
global.commandList = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	console.log(`Command ${file} loading...`);
  	const commande = require(`./commands/${file}`);
  	// set a new item in the Collection
  	// with the key as the command name and the value as the exported module
  	for (const n of commande.config.command) {
    	bot.commands.set(n, commande);
  	}
	let names = commande.config.command
  	let string = `${names.join(', ')}`
  	global.commandList.push(string)
}
console.log(`Loaded ${commandFiles.length} commands and ${bot.commands.array().length} aliases!`)

// Error message
global.errormsg = bot.commands.get(`errormessage-dontuse`)


// Whenever the bot is added to a server
bot.on('guildCreate', async guild => {
	let channelID;
    let channels = guild.channels;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
	}

	//   Prefix
	let fprefixgc = await db.fetch(`prefix_${guild.id}`);
	if (fprefixgc === null) prefix = "-=";
	else prefix = fprefixgc;

    let channel = bot.channels.get(guild.systemChannelID || channelID);
	channel.send(`Thank you for inviting ${NAME} to the server!\nI would highly recommend looking through the setup guide to initialise your bot for the server. Use \`${prefix}help c s\` to get started!`);
})


// Send the join or leave message
async function sendjlmessage(member, messagewhole, channel){
	let mtosend = ''
	let message = messagewhole.split(' ')
    for(const word of message) {
        switch(word) {
            case '${username}':
                mtosend += `${member.user.username} `
                break;
            case '${mention}':
                mtosend += `<@${member.user.id}> `
                break;
            case '${discrim}':
                mtosend += `${member.user.discriminator} `
                break;
            case '${tag}':
                mtosend += `${member.user.tag} `
                break;
            case '${id}':
                mtosend += `${member.user.id} `
                break;
            case '${servername}':
                mtosend += `${member.guild.name} `
                break;
            case '${prevwarns}':
                let warns = await db.get(`warns_${member.user.id}_${member.guild.id}.amount`)
                if (warns == null || isNaN(warns)) warns == '0'
                mtosend += `${warns} `
                break;
            default:
                mtosend += `${word} `
                break;
        }
    };
    channel.send(mtosend)
}

// Join Leave message maker
async function jlmessage(member, type, joinleave){
	//  Get the database for the server and type
	let jl = await db.get(`jl_${member.guild.id}_${type}_${joinleave}`)
	//  For db.all as i {
	if (jl == null) return;
	for(const i of jl.all){
		if(i.channelid == '' || i.channelid == null) continue;
		let channel = bot.channels.get(i.channelid)
		let rndval = [[],[],[],[],[],[],[],[],[],[]]
		for(j=0; j < i.text.length; j++){
			rndval[i.rnd[j]].push(i.text[j])
		}
		for(j=0; j < rndval[0].length; j++){
			sendjlmessage(member, rndval[0][j], channel)
		}
		for(j=1; j <= 9; j++){
			if(rndval[j].length == 0) continue;
			let rndnum = Math.floor(Math.random() * (rndval[j].length))
			sendjlmessage(member, rndval[j][rndnum], channel)
		}
	}
	//      Get the channel
	//      For db.all[i].text as j {
	//          (number rnd[j] resembles).push(j)
	//      }
	//      For 0.length as j {
	//          run testing.js function code 
	//      }
	//      For 1 - 9 as j {
	//          if(j.length == 0) return
	//          random number from 0 to j.length - 1
	//          run testing.js function code
	//      }
	//  }

	// function testing.js code


	// jl_${guildid}_${type}_${joinleave}, { all : [ { channelid : '', text : ['',''], rnd : [0,0], id : ['',''] }, {...} ], next : 0 }
	//  db.all[i].text[j]
}


// Whenever a new person joins a server
bot.on('guildMemberAdd', async member => {
	// Autorole
	let guild = member.guild
	let type = (member.user.bot) ? 'bot' : "member"
	let ar = await db.get(`ar_${guild.id}_${type}`)
	if(ar != null) {
		for(const roleid of ar){
			member.addRole(roleid, `${type} auto-role.`).catch(async () => {
				//   LogChannel
				let flc = await db.get(`logChannel_${guild.id}`);
				if (flc != null && flc != 0) logChannel = bot.channels.get(flc);
				else logChannel = 0;

				if(logChannel != 0) logChannel.send(`An issue occured while trying to perform autorole. Perhaps the bot does not have enough permissions, or the role has been deleted (${roleid})`);
			})
		}
	}
	// Message maker
	let joinleave = 'join';
	jlmessage(member, type, joinleave)
})


// Whenever a person leaves a server
bot.on('guildMemberRemove', async member => {
	let joinleave = 'leave';
	let type = (member.user.bot) ? 'bot' : "member"
	jlmessage(member, type, joinleave)
})


// WHEN THE BOT IS ONLINE
bot.on('ready', () =>{
	console.log('ONLINE');

	let botontime = new Date();
	let bothours = botontime.getHours()
	let ampm = "am"
	if(bothours > 12) bothours -= 12 ; ampm = "pm";

	let botont = `${botontime.getDate()}-${(botontime.getMonth()+1)}-${botontime.getFullYear()} ${bothours}:${botontime.getMinutes()}:${botontime.getSeconds()}${ampm}`

	console.log(`${botont}   -   Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
});



// WHEN A MESSAGE IS SENT IN A GUILD
bot.on('message', async message => {
	if(message.channel.name != undefined) {
		//   Prefix
		let fprefix = await db.fetch(`prefix_${message.guild.id}`);
		if (fprefix === null) prefix = "-=";
		else prefix = fprefix;

		if(message.content === 'getdbprefix') return message.channel.send(`The current DooshBot prefix is \`${prefix}\``); // If the user wants the prefix, give it to them dammit!		
		if(!message.content.startsWith(prefix) || message.author.bot == true) return;    // If message didn't start with the prefix or was sent by a bot, dont run next code
		if (!premiumservers.includes(message.guild.id) && !premiummembers.includes(message.author.id)) { // If they aren't in a premium guild or arent a premium member
			if (usedcmd.has(message.author.id)) return message.reply('please wait before using a command again!') // Check if they have used a command recently, return error if they have
			usedcmd.add(message.author.id); // If they havent used one recently, add them to recent list
			setTimeout(() => {usedcmd.delete(message.author.id)}, 5000); // After 5 seconds remove them.
		}

		// GET THE SETTINGS FROM THE DATABASE ABOUT THE SERVER
		//   Adminrole
		let fadmrole = await db.get(`adminrole_${message.guild.id}`);
		if (fadmrole != null) adminrole = fadmrole;
		else adminrole = [];
		//   Modrole
		let fmodrole = await db.get(`modrole_${message.guild.id}`);
		if (fmodrole != null) modrole = fmodrole;
		else modrole = [];

		//   RMRole
		let frmrole = await db.get(`rmrole_${message.guild.id}`);
		if (frmrole != null) rmrole = frmrole;
		else rmrole = [];
		//   LogChannel
		let flc = await db.get(`logChannel_${message.guild.id}`);
		if (flc != null && flc != 0) logChannel = bot.channels.get(flc);
		else logChannel = 0;

		// Set message variables.
		global.guildmsg = message.guild;
		global.msgUsername = message.author.username;
		global.serverOwner = message.guild.owner.user.username;
		global.hasAdmin = message.member.roles.find(role => adminrole.includes(role.id));
		global.hasMod = message.member.roles.find(role => modrole.includes(role.id));
		global.hasRoleMod = message.member.roles.find(role => rmrole.includes(role.id));
		global.msgUserID = message.member.id;

		// Get Time
		let today = new Date();
		let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		global.dateTime = date+' '+time;

		// Create arguments
		const args = message.content.substring(prefix.length).split(' ');    // Create arguments array by cutting off the prefix then seperating the arguments into indexes by spaces
		var cmd = bot.commands.get(args[0].toLowerCase())    // Set cmd to the command to run it later
		if(!cmd) return // If it isnt a command, just return
		if(cmd.config.permlvl == "RoleChange" && !hasRoleMod && !hasAdmin && !useallcmds.includes(msgUserID) && msgUsername != serverOwner) return message.channel.send('`Error - Requires Role Change permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify role-modify [role name]`');
		if(cmd.config.permlvl == "Mod" && !hasMod && !hasAdmin && !useallcmds.includes(msgUserID) && msgUsername != serverOwner) return message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
		if(cmd.config.permlvl == "Admin" && !hasAdmin && !useallcmds.includes(msgUserID) && msgUsername != serverOwner) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
		if(cmd.config.permlvl == "Trusted" && !useallcmds.includes(msgUserID)) return message.channel.send('Error - Requires EDoosh or other approved members to run this command! Wait, how did you find out about it..?');
		if(cmd.config.permlvl == "EDoosh" && msgUserID != 267723762563022849) return message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');
		// Run the command
		cmd.run(bot, message, args);
	}
})

bot.login(token);




//   MISC
// Every minute, check through the timing of everything and if theyve expired
// Steal YAGPDBs idea of self assignable roles.
// Level system

//   ME

//   TRUSTED

//   ADMIN
// Add mute option to jl message
// -=plvl mute (warn count) - Mutes members automatically for the default amount of time
// -=plvl default mute (minutes) - Default time to mute for if time is ommitted in -=mute
// -=plvl default warn (days) - Default time to warn for if time is ommitted in -=warn
// -=plvl muteon (t/f) - Enables mute. Creates muted role. Goes through all channels and makes mute unable to speak. If a channel is created and it is on, add mute role to it.
// -=plvl serverlevels (t/f) - Enables server leveling
// -=lvl clear (user)

//   MODS
// -=mute (mins) (s) (reason) - Mute someone for a reason. s makes it not DM them to tell them they are muted. Only works if muteon is true.
// -=warn (days) (s) (reason) - Add days to warn
// -=embed edit (...)

//   ALL
// -=memberinfo - Get information about someone.
// -=xkcd (ID) - Gets an xkcd comic
// -=meme - Gets a random meme from a channel called meme in Dooshbot Discord
// -=br (Contents) - Reports a bug in the bot.
// -=poll (hours)
// -=lvl - Gets users level and rank
// -=lvl top (page#) - Gets top 10
// -=lvl g - Gets users global level and rank
// -=lvl g top (page#) - Gets global top 10, updates every hour


// Plans for the distant future
// - Sharding
// - Music features?