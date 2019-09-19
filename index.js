// Get the plugins
const Discord = require('discord.js');
const bot = new Discord.Client();
const db = require('quick.db');
const send = require('quick.hook');
const fs = require('fs');

// Invite link:
// https://discordapp.com/oauth2/authorize?client_id=619532419061514240&scope=bot&permissions=8

// Startup variables
const token = fs.readFileSync('token.txt').toString(); // Make it so any of you reading on GitHub don't steal my bot >:(
const NAME = 'DooshBot'; // Set name in case I wan't to change it later
const VERSION = 'Alpha 0.6.0'; // Same with version. 

// Default settings. 
let prefix = "-=";
let adminrole = [];
let modrole = [];
let rmrole = [];
let logChannel = '';

// Load in commands from Discord Bot/Commands
bot.commands = new Discord.Collection()
fs.readdir('./commands/', (err, files) => {    // Set directory to look for stuff in to [localfolder]/commands
	if(err) console.error(err);    // If error, print

	var jsfiles = files.filter(f => f.split('.').pop() === 'js');    // Get all files in there, add to jsfiles array, then split & remove the .js at the end
	if(jsfiles.length <= 0) { return console.log('No commands found')}    // If there's no commands, say that
	else{console.log(jsfiles.length + ' commands found.')}    // Otherwise show how many there are

	jsfiles.forEach((f, i) => {    // For every file...
		var cmds = require(`./commands/${f}`);    // Set cmds to the directory of the file
		console.log(`Command ${f} loading...`);    // Say its loading it
		bot.commands.set(cmds.config.command, cmds);    // idk
	})
	console.log('Startup Complete')    // Say its complete
	
})

// WHEN THE BOT IS ONLINE
bot.on('ready', () =>{
	console.log('ONLINE');
	console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
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
		if (flc != null) logChannel = bot.channels.get(flc);
		else logChannel = 0;
		//   USEALLCMDS
		let useallcmdsgrab = await db.get(`useallcmds`);
		let useallcmds = ''
		if (useallcmdsgrab != null) useallcmds = useallcmdsgrab
		else useallcmds = [267723762563022849]
		db.set(`useallcmds`, useallcmds)

		// Set message variables.
		const guildmsg = message.guild;
		const msgUsername = message.author.username;
		const serverOwner = message.guild.owner.user.username;
		const hasAdmin = message.member.roles.find(role => adminrole.includes(role.name));
		const hasMod = message.member.roles.find(role => modrole.includes(role.name));
		const hasRoleMod = message.member.roles.find(role => rmrole.includes(role.name));
		const msgUserID = message.member.id;

		// Get Time
		let today = new Date();
		let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		let dateTime = date+' '+time;

		// Create arguments
		const args = message.content.substring(prefix.length).split(' ');    // Create arguments array by cutting off the prefix then seperating the arguments into indexes by spaces
		var cmd = bot.commands.get(args[0])    // Set cmd to the command to run it later if it exists in the Discord 'bot.commands' Collection we set earlier
		// Run the command with the prefix located in Discord Bot/commands if it exists.
		if(cmd) cmd.run(bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime);
	}
})

bot.login(token);

// message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
// message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
// message.channel.send('`Error - Requires Role Change permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify role-modify [role name]`');
// message.channel.send('Error - Requires EDoosh or other approved members to run this command! Wait, how did you find out about it..?');
// message.channel.send('Error - Requires EDoosh to run this command! Wait, how did you find out about it..?');

// for(i = combineTo + 1; i < args.length; i++) {
// 	args[combineTo] += ' ' + args[i];
// }

//   MISC
// Join message gives tips on how to set it up
// Everything accepts Mentions, IDs, Names, and Nothing (To get self)
// Fix deleteID

//   ME

//   TRUSTED
// -=quote globaladd [messageID] - Get the authors's nickname of the message, the date, the message ID, and the contents, then add it to a DB. Make amount increment too.
// -=quote globalremove [QuoteID] - Remove the quote by the quote's ID 

//   ADMIN
// -=ban @user (reason) - Ban user, show in logchannel, log date and reason, show how many warns they were at before kick
// -=unban @user (reason) - Unban
// -=modify quote-channel - Sends quotes to a channel.
// -=modify autorole - Autorole on join

//   MODS
// -=kick @user (reason) - Kick user, show in logchannel, log date and reason, show how many warns they were at before kick
// -=quote add [messageID] - Same as trusted, just for the server only
// -=quote remove [QuoteID] - Same as trusted, just for the server only

//   ROLE MODIFY
// -=er create [name] (hex) - Create role with that name. Get level their highest role is at, and put it one above. Make sure it doesn't conflict with other role names?
//							Check if they have one already. If so, tell them. If not, create.
//							Log creation date, name, and owner in logchannel. Log ID and owner in db.
//							If no hex is set, make it rnd? Otherwise, set to that
// -=er rename [name] - Check if they have a role. If true, rename their role. If false, tell them no.
// -=er colour [hex] - Check if they have a role. If true, recolour their role. If false, don't.
// -=er delete - Delete their role.

//   EVERYONE
// -=poll 'Option 1' 'Option 2' - Maximum 10, adds reactions, seperate options by apostrophe