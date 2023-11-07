const BotService = require('../services/botService');
const WalletService = require('../services/walletService'); // Assuming you have this

const startBotEndpoint = async (req, res) => {
  try {
    const { userId, userAddress, amount, slippage, tokenToBuy } = req.body;

    // Validate input...

    const decryptedPrivateKey = await WalletService.getPrivateKeyForUser(userAddress);

    const success = BotService.startBot(userId, {
      userAddress,
      AMOUNT: amount, 
      SLIPPAGE: slippage,
      tokenToBuy,
      decryptedPrivateKey,
    });

    if (success) {
      res.json({ success: true, message: "Bot initiated" });
    } else {
      throw new Error('Bot failed to start');
    }
  } catch (error) {
    console.error("Error starting bot:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const stopBotEndpoint = async (req, res) => {
  try {
    const { userId } = req.body;

    // Authentication and authorization?

    const success = BotService.stopBot(userId);

    if (success) {
      res.json({ success: true, message: 'Bot stopped successfully.' });
    } else {
      throw new Error('Bot failed to stop');
    }
  } catch (error) {
    console.error("Error stopping bot:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { startBotEndpoint, stopBotEndpoint };
