const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async (bot, message, args) => {
    if(!args[1]) return errormsg.run(bot, message, args, "a", `\`Unspecified value!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}\``);
    if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.channel.send('I do not have permissions to edit roles!');
    let getrole = await db.get(`custrole_${message.author.id}_${message.guild.id}`);
    switch(args[1]){
        case 'create':
            if (getrole != null && getrole != 0) return message.channel.send(`Error! You already have a role!`) 

            if(!args[3]) return errormsg.run(bot, message, args, 1, "Unspecified value!");
            for(i = 3 + 1; i < args.length; i++) {
                args[3] += ' ' + args[i];
            }
            let rolepos = message.member.highestRole.calculatedPosition
            message.guild.createRole({
                name: args[3],
                color: `0x${args[2]}`,
                position: rolepos + 1
            }).then(role => {
                db.set(`custrole_${message.author.id}_${message.guild.id}`, role.id)
                message.channel.send(`Successfully created a role for ${message.author.username} with the name \`${args[3]}\` and colour \`${args[2]}\``)
                message.member.addRole(role.id)
            }).catch((err) => {
                message.channel.send('An error occured while trying to make the role! Are you sure the bot is high enough on the role list to place it above?')
                console.log(err)
            })
            break;

        case 'delete':
            if (getrole == null || getrole == 0) return message.channel.send(`You don't have a role!`);
            let rolecol = message.guild.roles.find(role => role.id === getrole)
            let rolename = rolecol.name
            rolecol.delete().then(() => {
                message.channel.send(`${message.author.username}'s role named \`${rolename}\` was deleted.`)
                db.set(`custrole_${message.author.id}_${message.guild.id}`, 0)
            }).catch((err) => {
                message.channel.send(`An error occured while trying to delete ${message.author.username}'s role.`)
                console.log(err)
            })
            break;

        case 'colour':
        case 'color':
            if (getrole == null || getrole == 0) return message.channel.send(`You don't have a role!`);
            let rolecoll = message.guild.roles.find(role => role.id === getrole)
            if (!args[2]) return errormsg.run(bot, message, args, 2, "Unspecified value")
            rolecoll.edit({ color: `0x${args[2]}` }).then(() => {
                message.channel.send(`Colour successfully changed to \`${args[2]}\``)
            }).catch((err) => {
                message.channel.send(`An error occured while trying to edit colour of ${message.author.username}'s role.`)
                console.log(err)
            })
            break;

        case 'name':
            if (getrole == null || getrole == 0) return message.channel.send(`You don't have a role!`);
            let rolecolle = message.guild.roles.find(role => role.id === getrole)
            if (!args[2]) return errormsg.run(bot, message, args, 3, "Unspecified value")
            for(i = 2 + 1; i < args.length; i++) {
                args[2] += ' ' + args[i];
            }
            rolecolle.edit({ name: `${args[2]}` }).then(() => {
                message.channel.send(`Name successfully changed to \`${args[2]}\``)
            }).catch((err) => {
                message.channel.send(`An error occured while trying to edit name of ${message.author.username}'s role.`)
                console.log(err)
            })
            break;

        case 't':
            if (getrole == null || getrole == 0) return message.channel.send(`You don't have a role!`);
            let rolecollec = message.guild.roles.find(role => role.id === getrole)
            if(message.member.roles.find(role => role == rolecollec)) { // If the user doesnt have the role on them
                message.member.removeRole(rolecollec.id).then(() => {
                    message.channel.send(`${message.author.username}'s role named \`${rolecollec.name}\` was removed from them.`)
                }).catch((err) => {
                    message.channel.send(`An error occured while trying to remove ${message.author.username}'s role from them.`)
                    console.log(err)
                })
            } else { // If the user has the role on them
                message.member.addRole(rolecollec.id).then(() => {
                    message.channel.send(`${message.author.username}'s role named \`${rolecollec.name}\` was added to them.`)
                }).catch((err) => {
                    message.channel.send(`An error occured while trying to add ${message.author.username}'s role to them.`)
                    console.log(err)
                })
            }
            break;

        default:
            errormsg.run(bot, message, args, "a", `\`Unspecified value!\`\nCommand Usage: \`${prefix}${this.config.command[0]}${this.config.helpg}\``);
            break;
    }
}

module.exports.config = {
    command: ["er", "editrole", "e-r", "edit-role"],
    permlvl: "RoleChange",
    help: ["Role Modify", "Create, edit, and delete your own custom role.",
            "RoleModify", "create [hex-colour] [name]", "Creates a custom role with that colour and name, then gives it to you. Doesn't work if you already have one.",
            "RoleModify", "[colour|color] [hex-colour]", "Edits your custom role to have that new colour.",
            "RoleModify", "name [name]", "Edits your custom role to have that new name.",
            "RoleModify", "t", "Toggles between you having your role and not having your role.",
            "RoleModify", "delete", "Deletes your custom role."],
    helpg: "er [create | delete | colour | name | t]"
}