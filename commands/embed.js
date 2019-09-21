const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin, dateTime, usedcmd) => {
    // A - Author
    // T - Title
    // U - URL
    // D - Description
    // P - Thumbnail
    // F - Field
    // B - Blank Field
    // I - Image
    // L - Footer
    // E - Time
    // C - Colour

    // Check if issuer has mod permission
    if(!hasMod && !hasAdmin && !useallcmds.includes(msgUserID)) return message.channel.send('`Error - Requires Mod permission!`\nIf you think this is an issue, please contact the owner of your server.\nTell them to run `' + prefix + 'modify mod-role [role name]`');
    if(!args[1] || args[1] === 'help'){ // Check if there is any first argument or if first argument is help
        let dmto = '' // Set the place to DM to to blank
        if(!args[1]) dmto = bot.users.get(message.author.id) // If there is no first arg, set dmto to the user
        else dmto = message.channel // If there is a first arg, set dmto to the channel it was sent in.
        let embedhelp = new Discord.RichEmbed() // Create embed with below things.
            .setColor(0x32fc51)
            .setTitle(`${prefix}embed Command Help`)
            .setDescription('Because this command is kinda tricky')
            .addField('What are flags?', 'Flags are the little things like \'-A\' that indicate to the bot to create a new whatever with whatever comes afterwards.')
            .addField('How do I seperate values?', 'You can seperate values with a \'|\'. E.g. \'-=embed -A|EDoosh|(Image URL)\'')
            .addField('What are the brackets for?', 'The brackets are to signify what is a required and what is an optional value. [R] is required, [O] is optional.')
            .addBlankField()
            .addField('-A (Author)', '[R] Name - The name to set the Author of the embed as.\n[O] Icon URL - An image to put by the Author\s name.')
            .addField('-B (Blank Field)', 'Inserts empty field into the embed. No values required.', true)
            .addField('-C (Colour)', '[R] Colour - 6-long Hex Colour Code. This is the colour the sidebar has, e.g. this one has green.', true)
            .addField('-D (Description)', '[R] Description - The bit below the title.')
            .addField('-E (Timestamp)', 'Inserts timestamp next to footer or at the footer. No values required.', true)
            .addField('-F (Field)', '[R] Title - The title of the field.\n[R] Text - The contents of the field.', true)
            .addField('-I (Image)', '[R] URL - The URL for the picture.')
            .addField('-L (Footer)', '[R] Text - The text the footer contains.\n[O] Image - The URL to an image for the footer to have beside it.', true)
            .addField('-P (Thumbnail)', '[R] URL - A URL for an image that will be displayed in the top right of the embed.', true)
            .addField('-T (Title)', '[R] Title - The title of the embed.')
            .addField('-U (Title URL)', '[R] Title URL - A URL displayed in the title to direct you to when clicked on.', true)
            .setFooter('Any further questions? Ask EDoosh#9599!')
        dmto.send(embedhelp).then(() => { // Attempts to send to dmto.
            if(!args[1]) message.channel.send('The embed command help has been sent to your DMs.') // If no first argument, say its been sent to DMs
        }).catch(() => { // If there was an issue, e.g. the DMs were disabled, send message into command's channel
            message.channel.send(`There was an issue sending to your DMs. Maybe you have DM's disabled? Use '${prefix}embed help' to send in the channel.`)
        })
        return // Dont continue down the rest of the code. Exit the command.
    }
    const flags = message.content.substring(prefix.length).split('-'); // Set flags array to the message content but seperated by '-'s
    let embed = new Discord.RichEmbed() // New embed
    for(i=1; i < flags.length + 1; i++){ // For all the flags in the array
        let fa = flags[i - 1].substring(2).split('|') // Let the sub-flag variables exist
        switch(flags[i - 1].charAt(0)){ // Check for the first character of the flag in the below statements]
            // Most of the below follow the same structure, so I wont comment on them.
            case 'A': // If the first character of the flag is A
                if(!fa[0]) message.channel.send('Missing Author Name.') // If there isnt an Author Name, announce
                else{ // If there is...
                    if(fa[1]) embed.setAuthor(fa[0], fa[1]) // If there is a URL to a picture, put that in too!
                    else embed.setAuthor(fa[0]) // If there isn't a URL, just put the author name.
                }
                break; // Leave the case

            case 'B':
                embed.addBlankField()
                break;

            case 'C':
                if(!fa[0]) message.channel.send('Missing Colour.')
                else if(fa[0].length != 6) message.channel.send('Requires a hex colour!')
                else{
                    let colour = '0x' + fa[0]
                    embed.setColor(colour)
                }
                break;

            case 'D':
                if(!fa[0]) message.channel.send('Missing Description.')
                else embed.setDescription(fa[0])
                break;

            case 'E':
                embed.setTimestamp(Date.now())
                break;
            
            case 'F':
                if(!fa[1]) message.channel.send(`Missing Field Text at flag ${i}.`)
                else embed.addField(fa[0], fa[1])
                break;

            case 'I':
                if(!fa[0]) message.channel.send('Missing Image.')
                else embed.setImage(fa[0])
                break;

            case 'L':
                if(!fa[0]) message.channel.send('Missing Footer Text.')
                else if(fa[1]) embed.setFooter(fa[0], fa[1])
                else embed.setFooter(fa[0])
                break;

            case 'P':
                if(!fa[0]) message.channel.send('Missing Thumbnail.')
                else embed.setThumbnail(fa[0])
                break;

            case 'T':
                if(!fa[0]) message.channel.send('Missing Title.')
                else embed.setTitle(fa[0])
                break;

            case 'U':
                if(!fa[0]) message.channel.send('Missing URL.')
                else embed.setURL(fa[0])
                break;
        }
    }
    message.channel.send(embed) // Send the embed.
}

module.exports.config = {
    command: "embed"
}