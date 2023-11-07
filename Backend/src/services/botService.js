const Bot = require('../bot');

class BotService {
  static botInstances = new Map();

  static startBot(userId, botConfig) {
    if (this.botInstances.has(userId)) {
      throw new Error('Bot is already running for this user.');
    }
    const bot = new Bot();
    bot.startBot(botConfig);
    this.botInstances.set(userId, bot);
    return true;
  }

  static stopBot(userId) {
    const bot = this.botInstances.get(userId);
    if (!bot) {
      throw new Error('No bot running for this user.');
    }
    bot.stopBot();
    this.botInstances.delete(userId);
    return true;
  }

}

module.exports = BotService;
