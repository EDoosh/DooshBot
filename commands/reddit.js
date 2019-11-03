const Discord = require('discord.js');
const db = require('quick.db');
const snekfetch = require('snekfetch');

// CREDIT TO u/KingCrowley0
// https://www.reddit.com/r/Discord_Bots/comments/9khght/pulling_random_images_from_subreddits_js/

module.exports.run = async (bot, message, args) => {
    // If lacks subreddit argument, show error
    if(!args[1]) return errormsg.run(bot, message, args, 1, "Unspecified subreddit")
    let queries = 500 // Set default query count to 500
    if(args[2] <= 500) {
        queries = args[2] // If there is anything below that, set it
    }
    try {
        let getfrom = 'https://www.reddit.com/r/' + args[1] + '.json?sort=top&t=week' // set getfrom to the url
        const { body } = await snekfetch // Retrieve the data from reddit 
            .get(getfrom)
            .query({ limit: queries }); // Gets top posts of the week
        const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18); // If the channel doesn't allow 18+ content, delete it from the array 
        if (!allowed.length) return message.channel.send('It seems we are out of posts! Try again later.'); // If there are no more posts left, announce
        const randomnumber = Math.floor(Math.random() * allowed.length) // Get random number
        const embed = new Discord.RichEmbed() // Create an embed with the retrieved info
        .setColor(0x00A2E8)
        .setTitle(allowed[randomnumber].data.title)
        .setDescription("Posted by: " + allowed[randomnumber].data.author)
        .addField("Other info:", `Upvotes: ${allowed[randomnumber].data.ups} / Comments: ${allowed[randomnumber].data.num_comments}`)
        .setURL(`https://reddit.com${allowed[randomnumber].data.permalink}`)
        .setFooter(`Post from r/${args[1]}`)
        // If there is an image, attach it
        if(allowed[randomnumber].data.url.charAt(8) === 'i' || allowed[randomnumber].data.url.charAt(8) === 'p') embed.setImage(allowed[randomnumber].data.url)
        message.channel.send(embed) // Send the embed.
    } catch (err) { // If there is an error, show it.
        console.log(err);
        message.channel.send('Custom query limits may mean that it bugs out. If you aren\'t recieving a message, it may be because the query limit is too high.')
        return
    }
}

module.exports.config = {
    command: ["reddit"],
    permlvl: "All",
    help: ["Fun", "Get a post from reddit.",
            "All", "[subreddit] (query-limit)", "Get a random post from a specified subreddit. Ignore query-limit if you don't know what it does."]
}