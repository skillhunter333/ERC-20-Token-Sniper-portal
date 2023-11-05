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
// Sort a user's wallets to set wallets[0]

const sortWallets = async (req, res) =>{
  const { userAddress, selectedWalletPublicKey } = req.body;
    try {
    const activeWallet = await WalletService.setSelectedWalletFirst(userAddress, selectedWalletPublicKey);
    res.json(activeWallet);
  } catch (error) {
    console.error("Error setting the selected wallet first:", error);
    res.status(500).json({ error: "Could not set wallets" });
  }


}

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

module.exports = { createWallet, getUserWallets, startBotEndpoint, sortWallets };
