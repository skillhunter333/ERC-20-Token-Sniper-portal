const WalletService = require("../services/walletService");
const startBot = require("../../bot");

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

const startBotEndpoint = async (req, res) => {
  try {
    const { userAddress, amount, slippage, tokenToBuy } = req.body;

    // Validate input...

    const decryptedPrivateKey = await WalletService.getPrivateKeyForUser(
      userAddress
    );
    const socketId = req.body.socketId; // You get this from the client
    const socket = io.sockets.sockets.get(socketId);

    if (socket)
      startBot(
        {
          amount,
          slippage,
          tokenToBuy,
          privateKey: decryptedPrivateKey,
        },
        socket
      );

    res.json({ message: "Bot started successfully" });
  } catch (error) {
    console.error("Error starting bot:", error);
    res.status(500).json({ error: "Could not start bot" });
  }
};

module.exports = { createWallet, getUserWallets, startBot: startBotEndpoint };
