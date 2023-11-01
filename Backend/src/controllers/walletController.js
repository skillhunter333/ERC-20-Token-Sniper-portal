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

module.exports = { createWallet, getUserWallets };
