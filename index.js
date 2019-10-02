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
global.VERSION = 'Beta 2.0.0'; // Same with version. 

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
		global.hasAdmin = message.member.roles.find(role => adminrole.includes(role.name));
		global.hasMod = message.member.roles.find(role => modrole.includes(role.name));
		global.hasRoleMod = message.member.roles.find(role => rmrole.includes(role.name));
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
// Fix -=modify modrole and others to use role IDs & names
// When a user joins, check if theyve had any kicks, warns, or mutes in the server before
// When a user leaves, check if they had any warns or mutes present when they left
// Every minute, check through the timing of everything and if theyve expired
// Steal YAGPDBs idea of self assignable roles.

//   ME

//   TRUSTED

//   ADMIN
// -=jl ar - Autoroles on member join
// -=jl mj - Message on member join
// -=jl ml - Message on member leave
// -=modify jl-channel - Changes joinleave channel.

//   MODS

//   ALL
// -=xkcd (ID) - Gets an xkcd comic
// -=meme - Gets a random meme from a channel called meme in Dooshbot Discord
// -=br (Contents) - Reports a bug in the bot.


// Plans for the distant future
// - Expiring warns. Modify segment where admins can set how long the default is. You have access to days and months to make it last for.
// - Mute. Reason and length. Set auto mute warn lvl. Mute channels on creation, as well as on join to a guild. Allow admins to set default length, as well as length of mute for plvl mutes.
// - Sharding
// - Poll automatically announces winning after set period
// - Music features?