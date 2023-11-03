const WalletService = require("../services/walletService");

// Create a new wallet
const createWallet = async (req, res) => {
  const { userAddress } = req.body;
  try {
    const newWallet = await WalletService.createWallet(userAddress);
    res.json(newWallet);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Could not create wallet" });
  }
};

// Get a user's wallets
const getUserWallets = async (req, res) => {
  const { userAddress } = req.query;
  try {
    const userWallets = await WalletService.getUserWallets(userAddress);
    res.json(userWallets);
  } catch (error) {
    console.error("Error retrieving user wallets:", error);
    res.status(500).json({ error: "Could not retrieve wallets" });
  }
};
//////////

const startBot = require("../../bot");
const WalletService = require("../services/walletService");

const startBotEndpoint = async (req, res) => {
  try {
    const { userAddress, amount, slippage, tokenToBuy } = req.body;

    // Validate input...

    const decryptedPrivateKey = await WalletService.getPrivateKeyForUser(
      userAddress
    );

    // Start the bot with the user's parameters
    await startBot({
      amount,
      slippage,
      tokenToBuy,
      privateKey: decryptedPrivateKey,
    });

    res.json({ message: "Bot started successfully" });
  } catch (error) {
    console.error("Error starting bot:", error);
    res.status(500).json({ error: "Could not start bot" });
  }
};

module.exports = { createWallet, getUserWallets, startBot: startBotEndpoint };
