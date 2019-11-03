const Discord = require('discord.js');
const db = require('quick.db');
const simpYTAPI = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const fs = require('fs');

const apikey = fs.readFileSync('googleapi.txt').toString();
const youtube = new simpYTAPI(apikey);

module.exports.run = async (bot, message, args) => {
    // Big, biiiiig thank you to DevYukine for their open-source music bot. Without them, this wouldn't've been possible
    // https://github.com/DevYukine/Music-Bot/blob/master/MusicBot.js

    // Random colours
    let rndColor = ['', '', '', '89f531', '', '', '', '4062f7', '6a42ed', 'ad52f7', 'e540f7', 'f531c4', 'f0325b']
    // Custom text for pausing and playing
    let rndPauseFooter = ['Pause the funky music.', 'HEY! WHO TURNED OFF THE RADIO?', 'Aww, that was my favourite part!', 'Pause the music, boss is coming in!', 'COULD YOU TURN IT DOWN A LITTLE?']
    let rndPlayFooter = ['Play that funky music.', 'Let the party resume!', 'Why would you ever pause such marvelous music?', 'Mmmmmm, yes. Feed my earholes.', 'Music good, no music bad.']
    // Custom text for requesting
    let rndFooterText = ['This song again?', 'Oooh, I like this one!', 'Skip. All of them. Play mine. Now.', 'Isn\'t this, like, the 40th time today?', 'Huh, seems neat.']
    // Custom text for skipping/removing
    let rndComments = ['I thought it was pretty good...', 'Oh come on! That was my jam!', 'Thank god that\'s over with.', `Poor Billy, just wanted to listen to their favourite song with their favourite friends!`, 'La la laaahhh, lah la lo.. who skipped it?!']
    // Custom text for playing music
    let rndSongFooter = ['*Gasp* MY FAVOURITE!', 'This sounds alright!', 'I think I might have a new best song!', 'This beat is pretty freakin nice!', 'Finally, a good song.']
    // Custom text for -=p np
    let rndNPFooter = ['I heard this artist has some more pretty epic tracks!', 'When is it over...', 'The person who requested this song is epic!', 'I wanna listen in too!', 'I wish I could listen too, but I can not, for I am merely a robot providing music to your ears.']

    let commands = ['play', 'p', 'request', 'req', 'search',
                    'now', 'nowplaying', 'playing', 'np',
                    'pause', 'resume',
                    'stop', 'stopplaying', 'end',
                    'remove', 'r',
                    'volume', 'vol', 'v',
                    'skip', 's', 'next', 'n',
                    'list', 'l', 'queue',
                    'votemin', 'vm']

    let a = (commands.includes(args[0])) ? 0 : 1

    let fmusicqueue = await db.get(`musicqueue`);
    let index = -1;
    for(i=0; i < fmusicqueue.length; i++) {
        if(fmusicqueue[i].guildID == message.guild.id){
            index = i;
        };
    };
	if (index == -1) {
        index = fmusicqueue.length;
        let toPush = {
            guildID : message.guild.id,
            data : {
                volume : 15,
                voteMin : 0.4,
                skippers : [],
                queue : []
            }
        };
        fmusicqueue.push(toPush);
        await db.set(`musicqueue`, fmusicqueue);
    };
    let music = fmusicqueue[index];

    /*

    fmusicqueue.splice(index, 1, music)
    db.set(`musicqueue`, fmusicqueue)

    [
        guildID : '619704310615506955',
        data : {
            volume : 1,
            voice : '619704311080943616',
            skippers : 0,
            pause : false,
            text : '622931400039071754',
            queue : [
                [
                    url : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'    // Stop don't click that link oh shit he has airpods in he cant hear us
                    reqr : '267723762563022849'
                    title : 'Epic Minecraft Let's Play 27: BOOM...'
                    artist : 'XerCend'
                    length : 1205
                ],
            ]
        }
    ],

    */

    let mqt = bot.channels.find(channel => channel.id == music.data.text)
    let mqc = mqcl.voice[mqcl.ids.indexOf(message.guild.id)]

    //   DJ
	let fdj = await db.get(`djrole_${message.guild.id}`);
    let dj = (fdj == null) ? [] : fdj;
    //   Music ban
	let fmban = await db.get(`mbanrole_${message.guild.id}`);
	let mban = (fmban == null) ? [] : fmban;

    let vc = message.member.voiceChannel;

    switch(args[a]) {
        case 'play':
        case 'p':
        case 'request':
        case 'search':
        case 'req':
            if(message.member.roles.find(role => mban.includes(role.id)) && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send(`Your role has been banned from using music commands.`);
            if(!vc) return message.channel.send(`You aren't in a voice channel!`);
            // Get the URL, if it is one
            try {
                var video = await youtube.getVideo(args[a+1].replace(/<(.+)>/g, '$1'))
            } catch (error) {
                // If it isnt a url and rather a search string
                let b = (args[a+1] == 'q') ? 1 : 0
                // Combine args
                for(i = a+1+b + 1; i < args.length; i++) {
                    args[a+1+b] += ' ' + args[i];
                }
                try {
                    let listofvids = await youtube.searchVideos(args[a+1+b], 5);
                    let sindex = 0
                    reqmsgtosend = [`__**Song search**__\n`]
                    for(const lov of listofvids){
                        if (b == 0) {
                            var lovsongsearch = await youtube.getVideoByID(lov.id)
                            var lovlength = lengthOfSong(lovsongsearch.durationSeconds)
                        }
                        reqmsgtosend.push(`**${++sindex}  -**  \`${lov.title.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#39;/g,'\'')}\`\n               ${(b == 0) ? `\`${lovlength}\` ⬥ ` : ''}\`${lov.channel.title}\``)
                    }
                    reqmsgtosend.push(`\nEnter the ID of the song you wish to play, or 'Cancel' to quit the selection.`)
                    var listofsongsmsg = await message.channel.send(reqmsgtosend.join(`\n`))
                    try{
                        var response = await message.channel.awaitMessages(pmsg => ((pmsg.content > 0 && pmsg.content < 6) || pmsg.content.toLowerCase() == 'cancel'), {
                            maxMatches:1,
                            time: 20000,
                            errors: ['time']
                        })
                    } catch (err) {
                        console.error(err)
                        listofsongsmsg.delete();
                        return message.channel.send(`Invalid ID entered, cancelling selection.`)
                    }
                    if(response.first().content.toLowerCase() == 'cancel') {
                        listofsongsmsg.delete();
                        return message.channel.send(`Cancelled the selection.`)
                    }
                    var video = await youtube.getVideoByID(listofvids[parseInt(response.first().content) - 1].id)
                } catch (err) {
                    console.error(err)
                    message.channel.send(`Couldn't find any search result matches.`)
                }
            }

            let channelInfo = await youtube.getChannelByID(video.raw.snippet.channelId)
            listofsongsmsg.delete();

            if(video.id == 'dQw4w9WgXcQ') return message.channel.send(`Hey everyone, look at this funny guy who just tried to Rickroll everyone. Hahaha, I'm laughing so hard right now xddddddddd.`)

            let sinfo = {
                url : video.shortURL,
                reqr : message.author.id,
                title : video.title.replace(/&quot;/g,'"').replace(/&amp;/g,'&'),
                artist : video.channel.title,
                length : video.durationSeconds,
                artisticon : channelInfo.thumbnails.high.url,
                vidicon : video.maxRes.url
            }

            if(sinfo.length > 72000 && !(premiummembers.includes(message.author.id) || premiumservers.includes(message.guild.id))) return message.channel.send(`Sorry, only premium guilds & users can play songs over 2 hours long.`)

            music.data.queue.push(sinfo)
            music.data.text = message.channel.id

            fmusicqueue.splice(index, 1, music)
            await db.set(`musicqueue`, fmusicqueue)

            if(!music.data.queue[1]){
                try {
                    let connect = await vc.join();
                    let mqcindex = mqcl.ids.indexOf(message.guild.id)
                    if (mqcindex = -1) {
                        mqcindex = mqcl.ids.length
                        mqcl.ids.push(message.guild.id)
                        mqcl.voice.push(connect)
                    } else {
                        mqcl.voice[mqcindex] = connect
                    }
                    mqc = mqcl.voice[mqcindex]
                    mqt = message.channel
                    nextVideo()
                } catch (error) {
                    message.channel.send(`Couldn't join the voice channel!`)
                    console.log(error)
                }
            } else {
                let lengthos = lengthOfSong(sinfo.length)
                let rembed = new Discord.RichEmbed()
                    .setAuthor(sinfo.artist, sinfo.artisticon)
                    .setTitle(`Added to queue at position ${music.data.queue.length}\n**${sinfo.title}**`)
                    .setDescription(`Requested by \`${message.member.displayName}\` \`(${message.author.tag})\`\nLength: \`${lengthos}\`\nURL: ${sinfo.url}`)
                    .setThumbnail(sinfo.vidicon)
                    .setColor(0xf531c4)
                    .setFooter(rndFooterText[Math.floor(Math.random() * rndFooterText.length)])
                message.channel.send(rembed)
            }
            break;

        case 'now':
        case 'playing':
        case 'nowplaying':
        case 'np':
            if(!music.data.queue[0]) return message.channel.send(`There are currently no songs playing or in the queue.`);
            // Get the length, requester, and votes required to skip of current song
            let votes = votesCal(music.data.skippers.length);
            let length = lengthOfSong(music.data.queue[0].length)
            // let lengthr = lengthOfSong(mqc.dispatcher.time / 1000)
            // console.log(mqc.dispatcher)
            let requester = message.guild.members.find(member => member.id == music.data.queue[0].reqr)
            // Add the currently playing song to the queue message
            let npembed = new Discord.RichEmbed()
                .setAuthor(music.data.queue[0].artist, music.data.queue[0].artisticon)
                .setThumbnail(music.data.queue[0].vidicon)
                .setTitle(`Currently Playing\n**${music.data.queue[0].title}**`)
                .addField(`Length`, `\`${length}\``, true)
                .addField(`Requester`, requester.displayName, true)
                .addField(`URL`, music.data.queue[0].url, true)
                .addField(`Skips`, `${music.data.skippers.length} of required ${votes == 0 ? '1' : votes}`, true)
                .addField(`Current Channel`, `:loud_sound: ${mqc.channel.name}`,true)
                .addField(`Current Volume`, music.data.volume,true)
                .setColor(0x31aaf5)
                .setFooter(rndNPFooter[Math.floor(Math.random() * rndNPFooter.length)])
            message.channel.send(npembed)
            break;

        case 'pause':
        case 'resume':
            if(!vc) return message.channel.send(`You aren't in a voice channel!`);
            if(!message.member.roles.find(role => dj.includes(role.id)) && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send(`You don't have the DJ role! This command is only accessible to members with roles of that permission.`);
            let lengthprr = lengthOfSong(dispatcher.streamTime / 1000)
            let lengthpr = lengthOfSong(music.data.queue[0].length)
            if(!mqc.dispatcher.paused){
                mqc.dispatcher.pause();
                let pausembed = new Discord.RichEmbed()
                    .setTitle('The music has been paused.')
                    .setDescription(`\`${lengthprr} / ${lengthpr}\``)
                    .setColor(0xf53131)
                    .setFooter(rndPauseFooter[Math.floor(Math.random() * rndPauseFooter.length)])
                message.channel.send(pausembed)
            } else {
                mqc.dispatcher.resume();
                let playmbed = new Discord.RichEmbed()
                    .setTitle('The music has been resumed!')
                    .setDescription(`\`${lengthprr} / ${lengthpr}\``)
                    .setColor(0x31f579)
                    .setFooter(rndPlayFooter[Math.floor(Math.random() * rndPlayFooter.length)])
                message.channel.send(playmbed)
            }
            break;

        case 'stop':
        case 'stopplaying':
        case 'end':
            if(!message.member.roles.find(role => dj.includes(role.id)) && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send(`You don't have the DJ role! This command is only accessible to members with roles of that permission.`);
            if(!music.data.queue[0]) return message.channel.send(`There are currently no songs playing or in the queue.`);
            if(args[a+1] == 'all') {
                music.data.queue = []
                fmusicqueue.splice(index, 1, music)
                await db.set(`musicqueue`, fmusicqueue)
                mqc.dispatcher.end(`Stop command has been used!`)
                message.channel.send(`Stopped the music and cleared the queue.`)
            } else {
                music.data.queue.shift()
                fmusicqueue.splice(index, 1, music)
                await db.set(`musicqueue`, fmusicqueue)
                mqc.dispatcher.end(`Next command has been used!`)
                message.channel.send(`Ended the previous song!`)
            }
            break;

        case 'remove':
        case 'r':
            if(!message.member.roles.find(role => dj.includes(role.id)) && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send(`You don't have the DJ role! This command is only accessible to members with roles of that permission.`);
            if(!music.data.queue[1]) return message.channel.send(`There are currently no songs in the queue. To stop the current song, use ${prefix}stop.`);
            if(!args[a+1]) return message.channel.send(`Please specify an ID to remove from the queue.`);
            if(args[a+1] <= 0 || args[a+1] >= music.data.queue.length) return message.channel.send(`The current highest ID is \`${music.data.queue.length-1}\`\nIf you want to skip the current song, use \`${prefix}stop\`\n`);
            await skipSong('remove', parseInt(args[a+1]))
            break;

        case 'volume':
        case 'vol':
        case 'v':
            if(!vc) return message.channel.send(`You aren't in a voice channel!`)
            if(!music.data.queue[0]) return message.channel.send(`There are currently no songs playing or in the queue.`);
            if(!args[a+1]) return message.channel.send(`The current volume is \`${music.data.volume}\``);
            if(!message.member.roles.find(role => dj.includes(role.id)) && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send(`You don't have the DJ role! This command is only accessible to members with roles of that permission.`);            
            music.data.volume = parseInt(args[a+1]);
            mqc.dispatcher.setVolumeLogarithmic(parseInt(args[a+1])/100);
            message.channel.send(`Volume set to \`${args[a+1]}\``);
            fmusicqueue.splice(index, 1, music)
            db.set(`musicqueue`, fmusicqueue)
            break;

        case 'votemin':
        case 'vm':
            if(!vc) return message.channel.send(`You aren't in a voice channel!`)
            if(!args[a+1]) return message.channel.send(`The current vote skip minimum is \`${music.data.voteMin * 100}%\``);
            if(!hasAdmin && !useallcmds.includes(message.author.id)) return message.channel.send('`Error - Requires Admin permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify admin-role [role name]`');
            music.data.voteMin = parseInt(args[a+1]/100);
            message.channel.send(`Vote skip minimum set to \`${music.data.voteMin * 100}%\``);
            fmusicqueue.splice(index, 1, music)
            db.set(`musicqueue`, fmusicqueue)
            break;

        case 'skip':
        case 's':
        case 'next':
        case 'n':
            if(message.member.roles.find(role => mban.includes(role.id)) && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send(`Your role has been banned from using music commands.`);
            if(!vc) return message.channel.send(`You aren't in a voice channel!`);
            if(!music.data.queue[0]) return message.channel.send(`There are currently no songs playing or in the queue.`);
            if(music.data.skippers.includes(message.author.id)) {
                let skipdex = music.data.skippers.indexOf(message.author.id)
                music.data.skippers.splice(skipdex, 1);
                return message.channel.send(`Removed ${message.member.displayName}'s vote to skip the song!`)
            }
            music.data.skippers.push(message.author.id);
            fmusicqueue.splice(index, 1, music)
            db.set(`musicqueue`, fmusicqueue)
            if(music.data.skippers.length / (mqc.channel.members.size - 1) >= music.data.voteMin) {
                skipSong('skip', 0)
            } else {
                let votes = votesCal(music.data.skippers.length);
                message.channel.send(`${message.member.displayName} has voted to skip the song. ${votes < 0 ? '0' : votes} more votes are needed.`);
            }
            break;

        case 'list':
        case 'l':
        case 'queue':
            if(!music.data.queue[0]) return message.channel.send(`There are currently no songs playing or in the queue.`);
            // Get the page number to get results from
            let pageno = (args[a+1] && args[a+1] > 0 && args[a+1] < Math.ceil(music.data.queue.length/10)) ? args[a+1] : 1;

            // Set the beginning of the message
            let queuemessage = `__**${message.guild.name}'s Song Queue**__\n\n**Currently Playing**`;
            // Get the length, requester, and votes required to skip of current song
            let votesq = votesCal(music.data.skippers.length);
            let lengthq = lengthOfSong(music.data.queue[0].length)
            // let lengthqr = lengthOfSong(dispatcher.streamTime / 1000)
            let requesterq = message.guild.members.find(member => member.id == music.data.queue[0].reqr)
            // Add the currently playing song to the queue message
            queuemessage += `\n\`${music.data.queue[0].title}\` ⬥ \`${music.data.queue[0].artist}\`\n               Requested by \`${requesterq.displayName}\` ⬥ Length: ${lengthq}\` ⬥ URL: \`${music.data.queue[0].url}\`\n               Current skips: ${music.data.skippers.length} of needed ${votes == 0 ? '1' : votesq} ⬥ Current volume: ${music.data.volume}\n`
            
            for(i=pageno*10-9; i <= pageno*10 && i < music.data.queue.length; i++){
                let lengthl = lengthOfSong(music.data.queue[i].length)
                let requesterl = message.guild.members.find(member => member.id == music.data.queue[i].reqr)
                queuemessage += `\n\`${i}\`   \`${music.data.queue[i].title}\` ⬥ \`${music.data.queue[i].artist}\`\n               Requested by \`${requesterl.displayName}\` ⬥ Length: \`${lengthl}\` ⬥ URL: \`${music.data.queue[i].url}\``
            }
            message.channel.send(queuemessage)
            break;

        default:
            return errormsg.run(bot, message, args, "a", `\`Invalid arguments!\`\nCommand Usage: \`${prefix}${this.config.command[0]} ${this.config.helpg}\``);
    };

    function lengthOfSong(length){
        // Get length
        let hours = (Math.floor(length / 3600)).toString()
        length -= hours * 3600
        let minutes = (Math.floor(length / 60)).toString()
        let seconds = length - minutes * 60
        const dur = `${(hours != 0) ? `${hours}:` : ''}${minutes.charAt(1) ? minutes.charAt(0) : ((hours != 0) ? '0' : '')}${minutes.charAt(1) ? minutes.charAt(1) : minutes.charAt(0)}:${seconds < 10 ? `0${seconds}` : seconds ? seconds : '00'}`
        return dur;
    }

    function skipSong(skipremove, id){
        // Remove from queue
        let removed = music.data.queue.splice(id, 1);
        removed = removed[0]
        // Find the requester from removed.reqr
        let requester = message.guild.members.find(member => member.id == removed.reqr)
        // Get length
        let length = lengthOfSong(removed.length)
        let removedtype = (skipremove == 'remove') ? 'Removed from queue' : 'Skipped song'
        let col = (skipremove == 'remove') ? '0xf58331' : '0xf5e131'

        let rembed = new Discord.RichEmbed()
            .setAuthor(removed.artist, removed.artisticon)
            .setTitle(`${removedtype}\n**${removed.title}**`)
            .setFooter(rndComments[Math.floor(Math.random() * rndComments.length)])
            .setDescription(`Requested by \`${requester.displayName}\` \`(${requester.user.tag})\`\nLength: \`${length}\`\nURL: ${removed.url}`)
            .setThumbnail(removed.vidicon)
            .setColor(col)
        fmusicqueue.splice(index, 1, music)
        db.set(`musicqueue`, fmusicqueue)
        message.channel.send(rembed)
        return mqc.dispatcher.end(`Next command has been used!`);
    }

    function votesCal(votes){
        while(votes / (mqc.channel.members.size - 1) < music.data.voteMin) {
            votes++;
            if(votes >= 40) {
                message.channel.send(`An error occured while calculating votes left.`);
                break;
            }
        }
        return votes;
    }

    function nextVideo(){
        if(mqc.channel.members.size - 1 == 0) {
            mqc.dispatcher.leave();
            mqt.send('All users have left the voice channel, and I don\'t like being in here alone.');
            music.data.queue = []
            fmusicqueue.splice(index, 1, music)
            db.set(`musicqueue`, fmusicqueue)
            return;
        }
        let musicfetch = db.get(`musicqueue`)
        let music = musicfetch[index];
        let song = music.data.queue[0]
        music.data.skippers = []
        fmusicqueue.splice(index, 1, music)
        db.set(`musicqueue`, fmusicqueue)
        if(!song){
            mqc.channel.leave();
            mqt.send('Queue is empty, leaving voice channel.')
            return;
        }

        const dispatcher = mqc.playStream(ytdl(song.url, { format: 'audioonly' }))
            .on('end', reason => {
                if (reason !== 'Stream is not generating quickly enough.' && reason !== 'Stop command has been used!' && reason !== 'Next command has been used!') {
                    console.log(reason);
                    mqt.send(`Song ended. Reason: ${reason}`)
                };
                if(reason !== 'Stop command has been used!' && reason !== 'Next command has been used!') {
                    if(reason !== 'Stream is not generating quickly enough.') mqt.send(`An issue occured while trying to play **${song.title}**.\nPlease just re-request this song, it usually happens with songs the bot has never heard before.\nI'm looking into a fix, but if you know one that'd be sweet!`)
                    let musicfetch = db.get(`musicqueue`)
                    let music = musicfetch[index];
                    music.data.queue.shift();
                    fmusicqueue.splice(index, 1, music)
                    db.set(`musicqueue`, fmusicqueue)
                }
                nextVideo();
            });
        dispatcher.setVolumeLogarithmic(music.data.volume / 100);

        dispatcher.on('error', error => { console.log(error) });

        let length = lengthOfSong(song.length)
        let reqr = bot.guilds.find(guild => guild.id == music.guildID).members.find(member => member.id == song.reqr)
        let newSong = new Discord.RichEmbed()
            .setAuthor(song.artist, song.artisticon)
            .setTitle(`Now Playing\n**${song.title}**`)
            .setDescription(`Requested by \`${reqr.displayName}\` \`(${reqr.user.tag})\`\nLength: \`${length}\`\nURL: ${song.url}`)
            .setThumbnail(song.vidicon)
            .setColor(0x31f5e1)
            .setFooter(rndSongFooter[Math.floor(Math.random() * rndSongFooter.length)])
        mqt.send(newSong);
    }
};

module.exports.config = {
    command: ["music", "voice", "mus", "mu", "vc", "pl",
                'play', 'p', 'request', 'req', 'search',
                'now', 'nowplaying', 'playing', 'np',
                'pause', 'resume',
                'stop', 'stopplaying', 'end',
                'remove', 'r',
                'volume', 'vol', 'v',
                'skip', 's', 'next',
                'list', 'l', 'queue',
                'votemin', 'vm'
            ],
    permlvl: "All",
    help: ["Fun", "Music commands. Play, pause, stop, skip, remove, volume, list, now playing.\nFun fact: You don't even have to use 'music' in your command. You could directly type '-=play', for example!",
            "All", "play (q) [search term]", "Search for something to play from YouTube. If the 'q' modifier is added, it makes it faster but also doesn't return the length of the song.",
            "All", "play [youtube-link]", "Play a song from YouTube. Playlist links are not supported and likely never will be.",
            "All", "now", "Shows the currently playing song.",
            "DJ", "[pause | resume]", "Pauses or resumes the currently playing song.",
            "DJ", "stop (all)", "Stops the currently playing song. If all is used, it stops entirely.",
            "DJ", "remove [ID]", "Removes the song from the queue.",
            "DJ", "volume (0-200)", "Gets, or changes if specified, the volume of the bot. Recommended, and default, at 15. 200 will kill your ears.",
            "All", "skip", "Skips the currently playing song. If 40% or more decide to skip, it will be skipped.",
            "All", "list (pg#)", "List all the songs in the queue.",
            "Admin", "votemin (0-100)", "Sets the percentage of users required to skip a song. Defaults to 40%"],
    helpg: "[play | now | pause | resume | stop | remove | volume | skip | list]"
};


// message.member.roles.find(role => rmrole.includes(role.id));


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