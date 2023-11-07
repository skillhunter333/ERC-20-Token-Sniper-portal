const BotService = require("../services/botService");
const startBot = require("../../bot");

const startBotEndpoint = async (req, res) => {
  try {
    const { userAddress, amount, slippage, tokenToBuy } = req.body;

    // Validate input...
    ///////
    //////

    const decryptedPrivateKey = await WalletService.getPrivateKeyForUser(
      userAddress
    );
    
      startBot(
        { userAddress,
        AMOUNT: amount, 
        SLIPPAGE: slippage,
        tokenToBuy,
        decryptedPrivateKey,
        }
      );

    res.json({ message: "Bot Initiated" });
  } catch (error) {
    console.error("Error starting bot:", error);
    res.status(500).json({ error: "Could not start bot" });
  }
};

const stopBotEndpoint = async (req, res) => {
  const { userId } = req.body;
  
  // Authentication and authorization?
  
  const success = BotService.stopBot(userId);

  if (success) {
    res.json({ success: true, message: 'Bot stopped successfully.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to stop the bot.' });
  }
};

module.exports = { startBotEndpoint, stopBotEndpoint }