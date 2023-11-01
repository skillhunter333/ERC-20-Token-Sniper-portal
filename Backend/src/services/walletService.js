const crypto = require("crypto");
const { Wallet, utils } = require("ethers");

const User = require("../models/userSchema");

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

// Create and save a new wallet for a user, creating the user if not found
const createWallet = async (userAddress) => {
  try {
    // Create a new Ethereum wallet
    const wallet = Wallet.createRandom();

    // Encrypt the private key
    const cipher = crypto.createCipher("aes-256-cbc", ENCRYPTION_SECRET);
    let encryptedPrivateKey = cipher.update(wallet.privateKey, "utf8", "hex");
    encryptedPrivateKey += cipher.final("hex");

    // Find the user by their address
    let user = await User.findOne({ address: userAddress });

    // If user doesn't exist, create a new user entry
    if (!user) {
      user = new User({
        address: userAddress,
        wallets: [],
      });
    }

    // Add the new wallet to the user
    user.wallets.push({
      encryptedPrivateKey,
      publicKey: wallet.address,
    });

    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw new Error("Could not create wallet");
  }
};

// Retrieve user's wallets
const getUserWallets = async (userAddress) => {
  try {
    const user = await User.findOne({ address: userAddress });
    if (user) {
      return user.wallets;
    } else {
      // Handle the case where the user doesn't exist
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error retrieving user wallets:", error);
    throw new Error("Could not retrieve wallets");
  }
};

module.exports = { createWallet, getUserWallets };