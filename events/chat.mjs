const { Collection } = require('../plugins/collections')

module.exports = {
    name: 'chat',
    execute(bot, config, username, message, translate, jsonMsg, matches) {
        if (username === bot.username) return
        if (!String(message).startsWith(config.prefix)) {
        } else {
            const args = message.slice(config.prefix.length).trim().split(/ +/)
            const commandName = args.shift().toLowerCase()

            const command =
                bot.commands.get(commandName) ||
                bot.commands.find(
                    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
                )

            if (!command) {
                return
            }

            if (command.permissions) {
                if (
                    !command.permissions === 'creator' &&
                    !config.creator.includes(username)
                ) {
                    if (
                        !command.permissions === 'players' &&
                        !config.players.includes(username)
                    ) {
                        if (
                            !command.permissions === 'vip' &&
                            !config.vip.includes(username)
                        ) {
                            if (
                                !command.permissions === 'moderator' &&
                                !config.moderators.includes(username)
                            ) {
                                if (
                                    !command.permissions === 'admin' &&
                                    !config.admin.includes(username)
                                ) {
                                    return bot.chat(
                                        `You don\'t have permission to use ${command.name} command.`
                                    )
                                }
                            }
                        }
                    }
                }
            }

            if (command.args && !args.length) {
                let reply = `You didn't provide any arguments, ${username}!`

                if (command.usage) {
                    reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``
                }

                return bot.chat(reply)
            }

            bot.cooldowns = new Collection()
            const { cooldowns } = bot

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection())
            }

            const now = Date.now()
            const timestamps = cooldowns.get(command.name)
            const cooldownAmount = (command.cooldown || 3) * 1000

            if (timestamps.has(username)) {
                const expirationTime = timestamps.get(username) + cooldownAmount

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000
                    return bot.chat(
                        `please wait ${timeLeft.toFixed(
                            1
                        )} more second(s) before reusing the \`${
                            command.name
                        }\` command.`
                    )
                }
            }

            timestamps.set(username, now)
            setTimeout(() => timestamps.delete(username), cooldownAmount)

            try {
                command.execute(bot, config, message, args)
            } catch (error) {
                console.error(error)
                bot.chat(`Error: Unable to execute ${command.name} command.`)
            }
        }
    },
}