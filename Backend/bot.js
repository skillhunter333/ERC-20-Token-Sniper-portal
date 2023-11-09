const dotenv = require("dotenv").config();
const { io,  userSocketMap } = require("./io")
const ethers = require("ethers");
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
const IUniswapV2Pair = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");

class Bot {
  constructor() {
        this.isRunning = false;
        this.uniFactoryAddress = process.env.UNI_FACTORY;
        this.uniRouterAddress = process.env.UNI_ROUTER;
        this.WETHaddress = process.env.WETH;
        this.provider = new ethers.providers.WebSocketProvider(process.env.BLOCKCHAIN_PROVIDER_API);
  }
    emitToUser(message) {
    if (this.socket) {
      try {
        this.socket.emit('bot-log', message);
      } catch (error) {
        console.error("Error sending message to user:", error);
      }
    } else {
      console.log(`No active socket connection for user: ${this.userId}`);
    }
  }
   
    async startBot({ userId, AMOUNT, slippage, tokenToBuy, decryptedPrivateKey }) {
    this.isRunning = true;
    
    this.AMOUNT = AMOUNT;
    this.slippage = slippage;
    this.tokenToBuy = tokenToBuy;
    this.decryptedPrivateKey = decryptedPrivateKey;
  
    this.wallet = new ethers.Wallet(this.decryptedPrivateKey, this.provider);
    this.sniper = this.wallet.connect(this.provider);
    this.sniperAdress = this.wallet.address;
    this.userId = userId

    this.socketId = userSocketMap.get(this.userId);
    this.socket = io.sockets.sockets.get(this.socketId);
  
  this.uFactory = new ethers.Contract(
    this.uniFactoryAddress,
    IUniswapV2Factory.abi,
    this.sniper
  );
  this.uRouter = new ethers.Contract(
    this.uniRouterAddress,
    IUniswapV2Router02.abi,
    this.sniper
  );
  this.WETH = new ethers.Contract(this.WETHaddress, IERC20.abi, this.sniper);


  // getting balances for weth and eth of the wallet to snipe with
  this.wethBalance = await this.WETH.balanceOf(this.wallet.address);
  this.ethBalance = await this.provider.getBalance(this.wallet.address);
  this.firstThree = this.wallet.address.slice(0, 3);
  this.lastFour = this.wallet.address.slice(-4);
  this.shortAddress = this.firstThree + "..." + this.lastFour;
  this.emitToUser( {message: `|\n`});  
  this.emitToUser( {message: `Wallet to snipe with: ${this.shortAddress} |||  Balances: ${ethers.utils.formatEther(this.wethBalance)} WETH  ||  ${ethers.utils.formatEther(this.ethBalance)} ETH  \n`});
  this.emitToUser( {message: `\n Token to snipe: ${this.tokenToBuy}\n`});
  this.emitToUser( {message: `Amount: ${this.AMOUNT} WETH\n`});
  this.emitToUser( {message: `|\n`});  



this.pairCreatedListener = async (token0, token1, pair) => {
  
  console.log(`New pair detected...\n`);
  this.emitToUser({message: "New pair detected...\n"});
  
  console.log(`Token0: ${token0}`);
  this.emitToUser( { message: `Token0: ${token0}`});
  
  console.log(`Token1: ${token1}`);
  this.emitToUser( { message: `Token1: ${token1}`});
  
  console.log(`Pair Address: ${pair}\n`);
  this.emitToUser( { message: `Pair Address: ${pair}\n`});
  this.emitToUser( { message: `|\n`});


  this.path = [];

  if (token0 === this.WETHaddress) {
    this.path = [token0, token1];
  }

  if (token1 === this.WETHaddress) {
    this.path = [token1, token0];
  }

  if (this.path.length === 0) {
    console.log(`That pair wasn't created with WETH...\n`);
    return;
  }
  if (this.path[1] !== this.tokenToBuy) {
    return;
  }

  this.uPair = new ethers.Contract(pair, IUniswapV2Pair.abi, this.sniper);
  this.token = new ethers.Contract(this.path[1], IERC20.abi, this.sniper);

  console.log(`Checking liquidity...\n`);
  this.emitToUser( { message: "Checking liquidity...\n"});

  this.reserves = await this.uPair.getReserves();

  if (this.reserves[0] === 0 && this.reserves[1] === 0) {
    console.log(`Token has no liquidity...`);
    this.emitToUser({ message: "Token has no liquidity..."});
    return;
  }

  console.log(`Swapping...\n`);
  this.emitToUser( { message: "Swapping...\n"});

  try {
    this.amountIn = ethers.utils.parseEther(this.AMOUNT);
    this.amounts = await this.uRouter.getAmountsOut(this.amountIn, this.path);
    this.amountOutMin = this.amounts[1].sub(this.amounts[1].div(this.slippage));
    this.deadline = Date.now() + 10 * 60 * 1000;

    await this.WETH.approve(this.uniRouterAddress, this.amountIn);
    console.log("Approved WETH... Swapping... \n");
    this.emitToUser({ message: "Approved WETH... Swapping... \n"});

    this.estimatedGas = await this.uRouter.estimateGas.swapExactTokensForTokens(
      this.amountIn,
      this.amountOutMin,
      this.path,
      this.sniperAdress,
      this.deadline
    );

    this.gasLimit = this.estimatedGas.add(this.estimatedGas.div(10));

    this.tx = await this.uRouter.swapExactTokensForTokens(
      this.amountIn,
      this.amountOutMin,
      this.path,
      this.sniperAdress,
      this.deadline,
      { gasLimit: this.gasLimit }
    );

     this.receipt = await this.tx.wait();

    this.symbol = await this.token.symbol();
    this.tokenBalance = await this.token.balanceOf(this.sniperAdress);
    console.log("Success!");
    this.emitToUser({ message: "Success!"});
    
    console.log(`Swapped ${this.AMOUNT} WETH for ${ethers.utils.formatEther(this.tokenBalance)} ${this.symbol}\n`);
    this.emitToUser( { message: `Swapped ${this.AMOUNT} WETH for ${ethers.utils.formatEther(this.tokenBalance)} ${this.symbol}\n`});
    
    console.log(`View on Etherscan: https://etherscan.io/tx/${this.receipt.transactionHash}\n`);
    this.emitToUser( { message: `View on Etherscan: https://etherscan.io/tx/${this.receipt.transactionHash}\n`});
  } catch (error) {
    console.log(`Oh no! An error occured while swapping...`);
    this.emitToUser({ message: "Oh no! An error occurred while swapping..."});
    console.error(error);
  }

  console.log(`Listening for new pairs created on Uniswap V2...\n`);
  this.emitToUser( { message: "Listening for new pairs created on Uniswap V2...\n"});
};

this.uFactory.on("PairCreated", this.pairCreatedListener);

console.log(`Listening for new pairs created on Uniswap V2...\n`);
this.emitToUser({ message: "Listening for new pairs created on Uniswap V2...\n"});
this.emitToUser({ message: "|\n"});
}




stopBot() {
  return new Promise((resolve, reject) => {
     if (!this.isRunning) return;

  if (this.pairCreatedListener) {
    this.uFactory.removeListener("PairCreated", this.pairCreatedListener);
    this.pairCreatedListener = null; 
    this.emitToUser({ message: " Stopped Bot..\n"});
  }

    this.isRunning = false;
    resolve();
  });
};
};
const botInstance = new Bot();
module.exports = Bot ;
