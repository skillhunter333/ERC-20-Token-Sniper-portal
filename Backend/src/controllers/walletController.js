const WalletService = require("../services/walletService");



// Create a new wallet
const createWallet = async (req, res) => {
  const { userId } = req.body;
  try {
    const newWallet = await WalletService.createWallet(userId);
    res.json(newWallet);
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Could not create wallet" });
  }
};

// Get a user's wallets
const getUserWallets = async (req, res) => {
  const { userId } = req.query;
  try {
    const userWallets = await WalletService.getUserWallets(userId);
    res.json(userWallets);
  } catch (error) {
    console.error("Error retrieving user wallets:", error);
    res.status(500).json({ error: "Could not retrieve wallets" });
  }
};
// Sort a user's wallets to set wallets[0]

const sortWallets = async (req, res) =>{
  const { userId, walletPublicKey } = req.body;
    try {
    const activeWallet = await WalletService.setSelectedWalletFirst(userId, walletPublicKey);
    res.json(activeWallet);
  } catch (error) {
    console.error("Error setting the selected wallet first:", error);
    res.status(500).json({ error: "Could not set wallets" });
  }


}



module.exports = { createWallet, getUserWallets, sortWallets };
