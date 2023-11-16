const BotService = require('../services/botService');
const WalletService = require('../services/walletService'); // Assuming you have this

const startBotEndpoint = async (req, res) => {
  try {
    const {userId,
          amount,
          slippage,
          tokenToBuy,
          fixedGasPrice,
          fixedGasLimit,
          multiplierValue,
          customMethod,
          bribeValue,
          maxTx, } = req.body;

    // Validate input...

    const decryptedPrivateKey = await WalletService.getPrivateKeyForUser(userId);
    
    const success = BotService.startBot({userId,
          amount,
          slippage,
          tokenToBuy,
          fixedGasPrice,
          fixedGasLimit,
          multiplierValue,
          customMethod,
          bribeValue,
          maxTx,
          decryptedPrivateKey,});

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
    // Authentication and authorization??
    const result = BotService.stopBot(req.body.userId);
    if (!result) {
      res.status(400).send('No bot running for this user.');
      return;
    }
  
    if (true) {
      res.json({ success: true, message: 'Bot stopped successfully.' });
    } 
  } catch (error) {
    console.error("Error stopping bot:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { startBotEndpoint, stopBotEndpoint };
