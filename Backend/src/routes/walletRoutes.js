const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

// Create a new wallet
router.post("/createWallet", walletController.createWallet);

// Get a user's wallets
router.get("/getUserWallets", walletController.getUserWallets);

module.exports = router;
