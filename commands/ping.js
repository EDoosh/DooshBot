module.exports.run = async (bot, message, args, prefix, VERSION, NAME, adminrole, modrole, rmrole, logChannel, guildmsg, serverOwner, msgUsername, msgUserID, useallcmds, hasRoleMod, hasMod, hasAdmin) => {
    // Send message
    message.channel.send("Pong!")
}

module.exports.config = {
    command: "ping"
}