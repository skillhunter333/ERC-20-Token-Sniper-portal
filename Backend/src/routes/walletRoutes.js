const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

// Create a new wallet
router.post("/createWallet", walletController.createWallet);

// Get a user's wallets
router.get("/getUserWallets", walletController.getUserWallets);

// Route to start the bot
router.post("/startBot", walletController.startBot);

module.exports = router;
