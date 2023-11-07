const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const botController = require("../controllers/botController");



// Create a new wallet
router.post("/createWallet", walletController.createWallet);

// Get a user's wallets
router.get("/getUserWallets", walletController.getUserWallets);

// Sort the wallets array, so selected wallet is at wallets[0] which will be sniped from
router.post("/update-wallets", walletController.sortWallets);


//// Bot routes


// Route to start the bot
router.post("/startBot", botController.startBotEndpoint);

// Route to stop the bot
router.post("/stopBot", botController.stopBotEndpoint);



module.exports = router;
