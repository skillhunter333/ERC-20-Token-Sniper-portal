const Bot = require('../../bot');

class BotService {
  static botInstances = new Map();

  static startBot({userId,
          amount,
          slippage,
          tokenToBuy,
          fixedGasPrice,
          fixedGasLimit,
          multiplierValue,
          customMethod,
          bribeValue,
          maxTx,
        decryptedPrivateKey }) {
    if (this.botInstances.has(userId)) {
      console.log(`Attempt to start bot for user ${userId} which is already running.`);
      throw new Error('Bot is already running for this user.');
      
    }
    try {
     const bot = new Bot();
      bot.startBot({userId,
          amount,
          slippage,
          tokenToBuy,
          fixedGasPrice,
          fixedGasLimit,
          multiplierValue,
          customMethod,
          bribeValue,
          maxTx,
        decryptedPrivateKey });
      this.botInstances.set(userId, bot);
      console.log(`Bot started for user ${userId}.`);
    } catch (error) {
      console.error(`Failed to start bot for user ${userId}: ${error}`);
      // If there was an error starting the bot,not to leaving an entry in the map
      this.botInstances.delete(userId);
      throw error;
    }
    return true;
  }


static async stopBot(userId) {
  if (!this.botInstances.has(userId)) {
    console.log(`Attempt to stop bot for user ${userId} which is not running.`);
    return false;
  }
  try {
    const bot = this.botInstances.get(userId);
    await bot.stopBot(); // Await the stopBot completion
    this.botInstances.delete(userId);
    console.log(`Bot stopped for user ${userId}.`);
  } catch (error) {
    console.error(`Failed to stop bot for user ${userId}: ${error}`);
    throw error;
  }
  console.log(`Current bot instances after stop: ${Array.from(this.botInstances.keys())}`);
  return true;
}

  // Additional method to forcefully clear a bot instance (use with caution)
  static clearBotInstance(userId) {
    if (this.botInstances.has(userId)) {
      console.log(`Forcefully clearing bot instance for user ${userId}.`);
      this.botInstances.delete(userId);
      return true;
    }
    return false;
  }

}

module.exports = BotService;
