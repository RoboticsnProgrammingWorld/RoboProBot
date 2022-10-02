const fs = require('fs')

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    aliases: ['reload'],
    usage: '(command name)',
    cooldown: 1,
    args: false,
    execute(bot, config, message, args) {
        if (args[0]) {
            const commandName = args[0].toLowerCase()
            const command =
                bot.commands.get(commandName) ||
                bot.commands.find(
                    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
                )

            if (!command) {
                return bot.chat(
                    `There is no command with name or alias \`${commandName}\`, ${message.author}!`
                )
            }

            const commandFolders = fs.readdirSync('./commands')
            const folderName = commandFolders.find((folder) =>
                fs
                    .readdirSync(`./commands/${folder}`)
                    .includes(`${command.name}.js`)
            )

            delete require.cache[
                require.resolve(`../${folderName}/${command.name}.js`)
            ]

            try {
                const newCommand = require(`../${folderName}/${command.name}.js`)
                bot.commands.set(newCommand.name, newCommand)
                bot.chat(`Command \`${newCommand.name}\` reloaded!`)
            } catch (error) {
                console.error(error)
                bot.chat(
                    `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
                )
            }
        } else {
            const commandFolders = fs.readdirSync('./commands')
            for (const folder of commandFolders) {
                const commandFiles = fs
                    .readdirSync(`./commands/${folder}`)
                    .filter((file) => file.endsWith('.js'))
                for (const file of commandFiles) {
                    delete require.cache[
                        require.resolve(`../${folder}/${file}`)
                    ]
                    const command = require(`../${folder}/${file}`)
                    bot.commands.set(command.name, command)
                }
            }
            bot.chat('All commands are reloaded.')
        }
    },
}