require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const walletRoutes = require("./src/routes/walletRoutes");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/wallets", walletRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
