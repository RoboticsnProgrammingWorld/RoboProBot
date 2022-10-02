// RoboProBot

// Initalization
print('Initialising...')

// Importing... Dependencies
print('Importing Dependencies')
const fs = require('fs')
const config = require('./config.json')
const mineflayer = require('mineflayer')
const { Collection } = require('./plugins/collections')

// Creating... Bot
print('Creating Bot')
const bot = mineflayer.createBot({
    host: config.host,
    port: parseInt(config.port),
    username: config.username,
    password: config.password,
    version: config.version,
})

// Variables

// Print Function
function print(text) { console.log("|=> " + text) }

// Loading... Plugins
print('Loading Plugins')
//bot.loadPlugin(require('mineflayer-dashboard'))
bot.loadPlugin(require('mineflayer-pathfinder').pathfinder)
bot.loadPlugin(require('mineflayer-pvp').plugin)
bot.loadPlugin(require('mineflayer-armor-manager'))
bot.loadPlugin(require('mineflayer-auto-eat'))

// Events Handler
const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(bot, config, ...args))
    } else {
        bot.on(event.name, (...args) => event.execute(bot, config, ...args))
    }
}

// Commands Handler
bot.commands = new Collection()

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		bot.commands.set(command.name, command);
	}
}
