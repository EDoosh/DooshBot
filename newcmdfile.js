const fs = require('fs')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
listofcats = ["Bot", "Fun", "Role Modify", "Mod", "Admin", "Other"]
let out = 'cmds = `[['
cmdlist = [[],[],[],[],[],[]];
for (const file of commandFiles) {
    if(file == "example.js" || file == "pong.js") continue;
    const commande = require(`./commands/${file}`);
    let cmd = commande.config
    let cmdmore = [];
    if(cmd.help[0] == "Trusted" || cmd.help[0] == "EDoosh") continue;
    if(file == "music.js") {
        musicCommands(cmdlist);
        continue;
    }
    for(i=1; i < Math.ceil(cmd.help.length / 3); i++) {
        cmdmore.push(`{
                "perms" : "${cmd.help[i * 3 - 1]}",
                "usage" : "${cmd.help[i * 3]}",
                "description" : "${cmd.help[i * 3 + 1]}"
            }`)
    }
    cmdlist[listofcats.indexOf(cmd.help[0])].push(`{
        "name" : ["${cmd.command.join('", "')}"],
        "desc" : "${cmd.help[1]}",
        "more" : [${cmdmore}]
        }`);
}
cmdlist[5].push(`{"name": ["getdbprefix"],"desc": "Sends the current DooshBot prefix. Does not require the prefix in front.","more" : [{"perms" : "All","usage" : "","description" : "Sends the current DooshBot prefix. Does not require the prefix in front."}]}`)
out += cmdlist.join('],[') + ']]`'
fs.writeFile("cmds.js", out, (err) => {
    if(err) console.log(err);
    console.log("Made new cmds.js file")
})

function musicCommands(cmdlist) {
    cmdlist[2].push(`{
                "name": ["play", "p", "request", "req", "search"],
                "desc": "Play a song from YouTube.",
                "more" : [
                    {
                        "perms" : "All except MusicBan",
                        "usage" : "[youtube-link]",
                        "description" : "Play a song by link from YouTube. Playlists are not supported and likely never will be."
                    }, {
                        "perms" : "All except MusicBan",
                        "usage" : "(q) [search term]",
                        "description" : "Search for videos by search term, and returns list of 10 results. If 'q' is added, it loads quicker but won't show lengths."
                    }
                ]
            }`)
        cmdlist[2].push(`{
            "name": ["now", "np", "playing", "nowplaying"],
            "desc": "Shows information about the currently playing song.",
            "more" : [
                {
                    "perms" : "All",
                    "usage" : "",
                    "description" : "Shows information about the currently playing song."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["pause", "resume"],
            "desc": "Pauses / resumes the current music",
            "more" : [
                {
                    "perms" : "DJ",
                    "usage" : "",
                    "description" : "Pauses / resumes the current music."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["stop", "stopplaying", "end"],
            "desc": "Stop playing a song.",
            "more" : [
                {
                    "perms" : "DJ",
                    "usage" : "",
                    "description" : "Stops currently playing song."
                }, {
                    "perms" : "DJ",
                    "usage" : "all",
                    "description" : "Stops all songs from playing, clears queue, and leaves voice channel."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["remove", "r"],
            "desc": "Removes a song from the queue line-up.",
            "more" : [
                {
                    "perms" : "DJ",
                    "usage" : "[queueID]",
                    "description" : "Removes a song from the queue line-up."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["volume", "vol", "v"],
            "desc": "Gets / changes the volume.",
            "more" : [
                {
                    "perms" : "All",
                    "usage" : "",
                    "description" : "Gets the current volume of the bot."
                }, {
                    "perms" : "DJ",
                    "usage" : "[0-200]",
                    "description" : "Changes the volume of the bot. Default & recommended at around 15."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["skip", "s", "next", "n"],
            "desc": "Skips the current song.",
            "more" : [
                {
                    "perms" : "All except MusicBan",
                    "usage" : "",
                    "description" : "Skip the currently playing song. Once VoteMin % is reached, the song skips. Run this command again to cancel your skip vote."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["list", "l", "queue"],
            "desc": "List all the songs in the queue.",
            "more" : [
                {
                    "perms" : "All",
                    "usage" : "(pg#)",
                    "description" : "List all the songs in the queue."
                }
            ]
        }`)
        cmdlist[2].push(`{
            "name": ["votemin", "vm"],
            "desc": "Sets the percentage of users required to skip a song.",
            "more" : [
                {
                    "perms" : "All",
                    "usage" : "",
                    "description" : "Gets the current VoteMin % of the bot."
                }, {
                    "perms" : "Admin",
                    "usage" : "[0-100]",
                    "description" : "Set the percentage of users require to skip a song. Default & recommended at 40."
                }
            ]
        }`)
}