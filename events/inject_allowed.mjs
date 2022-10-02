const inventoryViewerPlugin = require('mineflayer-web-inventory')

module.exports = {
    name: 'inject_allowed',
    once: true,
    execute(bot, config) {
        print("|=> Injecting Plugins")
        //global.console.log = bot.dashboard.log
        //global.console.error = bot.dashboard.log
        // inventoryViewerPlugin(bot, { port: config.inventoryView })
    },
}