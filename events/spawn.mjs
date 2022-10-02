const prismarineViewer = require('prismarine-viewer').mineflayer

welcomeMsg = [
    'Hi! Guys',
    'Hello! Everyone',
    "Hi! What's up Guys",
    "Hello! Everyone What's going on",
    'Hey! Hi! Guys',
    "Hi! Guys It's me RoboProBot",
]

module.exports = {
    name: 'spawn',
    execute(bot, config) {
        //console.log("|=> !Successfully Spawn")
		//bot.dashboard.log("|=> !Successfully Spawn")
        bot.chat(welcomeMsg[Math.floor(Math.random() * welcomeMsg.length)])
        // prismarineViewer(bot, { port: config.chunkViewer })
        bot.armorManager.equipAll()
    },
}