const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: String, // connected wallet public key
  wallets: [
    {
      encryptedPrivateKey: String, // Encrypted private key
      publicKey: String, // Public key
    },
  ],
});
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
