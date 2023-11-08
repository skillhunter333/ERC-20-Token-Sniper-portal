const crypto = require("crypto");
const { Wallet, utils } = require("ethers");
const mongoose = require("mongoose");


const User = require("../models/userSchema");

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

// Create and save a new wallet for a user, creating the user if not found
const createWallet = async (userId) => {
  try {
    // Create a new Ethereum wallet
    const wallet = Wallet.createRandom();

    // Encrypt the private key
    const cipher = crypto.createCipher("aes-256-cbc", ENCRYPTION_SECRET);
    let encryptedPrivateKey = cipher.update(wallet.privateKey, "utf8", "hex");
    encryptedPrivateKey += cipher.final("hex");

    // Find the user by their address
    let user = await User.findOne({ address: userId });

    // If user doesn't exist, create a new user entry
    if (!user) {
      user = new User({
        address: userId,
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
const getUserWallets = async (userId) => {
  try {
    const user = await User.findOne({ address: userId });
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

// return the first private key of a userAddress (decrypted)

const decryptPrivateKey = (encryptedPrivateKey) => {
  const decipher = crypto.createDecipher("aes-256-cbc", ENCRYPTION_SECRET);
  let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const getPrivateKeyForUser = async (userId) => {
  const user = await User.findOne({ address: userId });
  if (!user) throw new Error("User not found");
  // Assuming the first wallet is the one to use
  const encryptedPrivateKey = user.wallets[0].encryptedPrivateKey;
  return decryptPrivateKey(encryptedPrivateKey);
};


// Function to set selected wallet to first position in db (wallets[0] will be used to snipe)
const setSelectedWalletFirst = async (userId, key) => {
  try {
    const user = await User.findOne({ address: userId });
    if (!user) throw new Error("User not found");

    const walletIndex = user.wallets.findIndex(wallet => wallet.publicKey === key);
    if (walletIndex === -1) throw new Error("Wallet not found");

    if (walletIndex === 0) return user.wallets[0].publicKey;  console.log(`the userwallet[0]: ${user.wallets[0].publicKey}`)

    const [selectedWallet] = user.wallets.splice(walletIndex, 1);
    user.wallets.unshift(selectedWallet);
    await user.save();
    console.log(`the userwallet[0]: ${user.wallets[0].publicKey}`)
    return user.wallets[0];
  } catch (error) {
    console.error("Error setting selected wallet:", error);
    throw error;
  }
};



module.exports = { createWallet, getUserWallets, getPrivateKeyForUser, setSelectedWalletFirst };
