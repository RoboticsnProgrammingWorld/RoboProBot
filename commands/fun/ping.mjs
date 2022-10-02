module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(bot, config, message) {
		bot.chat(`Pong.\nServer Ping: ${bot.player.ping}\nClient Ping: ${bot._client.latency}`);
	},
};