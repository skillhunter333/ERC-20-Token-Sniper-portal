const { io,  userSocketMap } = require("./io")
const ethers = require("ethers");
const provider = new ethers.providers.WebSocketProvider(
  "wss://eth-mainnet.g.alchemy.com/v2/Gpgs1urXNlIN7kvnRIQqtLIThn5kh-JK"
);

const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
const IUniswapV2Pair = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");
const { isAddress } = require("ethers/lib/utils");

const uniFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETHaddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";



/* let decryptedPrivateKey =
  "0x5aaf8787b75baddef92b2423d5b8a58c2e1d1077319caa2000f5c7f671603d3a"; //only for developement
let tokenToBuy = "0xCC02cbCDD92205d74Be5934493650Edc3aC9dfB2"; //only for developement */


async function startBot({ userAddress, AMOUNT, SLIPPAGE, tokenToBuy, decryptedPrivateKey }) {

  
  const wallet = new ethers.Wallet(decryptedPrivateKey, provider);
  const sniper = wallet.connect(provider);
  const sniperAdress = wallet.address;
  const userId = userAddress;
  const slippage = SLIPPAGE * 10; // to avoid type-conflicts when calculating with BigNumbers

  const socketId = userSocketMap.get(userId);
  const socket = io.sockets.sockets.get(socketId);
  
const emitToUser = (userId, message) => {

  if (socket) {
    try {
      socket.emit('bot-log', message);
    } catch (error) {
      console.error("Error sending message to user:", error);
    }
  } else {
    console.log(`No active socket connection for user: ${userId}`);
  }
};

  const uFactory = new ethers.Contract(
    uniFactoryAddress,
    IUniswapV2Factory.abi,
    sniper
  );
  const uRouter = new ethers.Contract(
    uniRouterAddress,
    IUniswapV2Router02.abi,
    sniper
  );
  const WETH = new ethers.Contract(WETHaddress, IERC20.abi, sniper);


  // getting balances for weth and eth of the wallet to snipe with
  const wethBalance = await WETH.balanceOf(wallet.address);
  const ethBalance = await provider.getBalance(wallet.address);
  let firstThree = wallet.address.slice(0, 3);
  let lastFour = wallet.address.slice(-4);
  let shortAddress = firstThree + "..." + lastFour;
  emitToUser(userId, {message: `|\n`});  
  emitToUser(userId, {message: `Wallet to snipe with: ${shortAddress} |||  Balances: ${ethers.utils.formatEther(wethBalance)} WETH  ||  ${ethers.utils.formatEther(ethBalance)} ETH  \n`});
  emitToUser(userId, {message: `\n Token to snipe: ${tokenToBuy}\n`});
  emitToUser(userId, {message: `|\n`});  


uFactory.on("PairCreated", async (token0, token1, pair, event) => {
  
  console.log(`New pair detected...\n`);
  emitToUser(userId, {message: "New pair detected...\n"});
  
  console.log(`Token0: ${token0}`);
  emitToUser(userId, { message: `Token0: ${token0}`});
  
  console.log(`Token1: ${token1}`);
  emitToUser(userId, { message: `Token1: ${token1}`});
  
  console.log(`Pair Address: ${pair}\n`);
  emitToUser(userId, { message: `Pair Address: ${pair}\n`});
  emitToUser(userId, { message: `|\n`});


  let path = [];

  if (token0 === WETHaddress) {
    path = [token0, token1];
  }

  if (token1 === WETHaddress) {
    path = [token1, token0];
  }

  if (path.length === 0) {
    console.log(`Pair wasn't created with WETH...\n`);
    emitToUser(userId, { message: "Pair wasn't created with WETH...\n"});
    return;
  }
  if (path[1] !== tokenToBuy) {
    return;
  }

  const uPair = new ethers.Contract(pair, IUniswapV2Pair.abi, sniper);
  const token = new ethers.Contract(path[1], IERC20.abi, sniper);

  console.log(`Checking liquidity...\n`);
  emitToUser(userId, { message: "Checking liquidity...\n"});

  const reserves = await uPair.getReserves();

  if (reserves[0] === 0 && reserves[1] === 0) {
    console.log(`Token has no liquidity...`);
    emitToUser(userId, { message: "Token has no liquidity..."});
    return;
  }

  console.log(`Swapping...\n`);
  emitToUser(userId, { message: "Swapping...\n"});

  try {
    const amountIn = ethers.utils.parseEther(AMOUNT);
    const amounts = await uRouter.getAmountsOut(amountIn, path);
    const amountOutMin = amounts[1].sub(amounts[1].div(slippage));
    const deadline = Date.now() + 10 * 60 * 1000;

    await WETH.approve(uniRouterAddress, amountIn);
    console.log("Approved WETH... Swapping... \n");
    emitToUser(userId, { message: "Approved WETH... Swapping... \n"});

    const estimatedGas = await uRouter.estimateGas.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      sniperAdress,
      deadline
    );

    const gasLimit = estimatedGas.add(estimatedGas.div(10));

    const tx = await uRouter.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      sniperAdress,
      deadline,
      { gasLimit }
    );

    const receipt = await tx.wait();

    const symbol = await token.symbol();
    const tokenBalance = await token.balanceOf(sniperAdress);
    console.log("Success!");
    emitToUser(userId, { message: "Success!"});
    
    console.log(`Swapped ${AMOUNT} WETH for ${ethers.utils.formatEther(tokenBalance)} ${symbol}\n`);
    emitToUser(userId, { message: `Swapped ${AMOUNT} WETH for ${ethers.utils.formatEther(tokenBalance)} ${symbol}\n`});
    
    console.log(`View on Etherscan: https://etherscan.io/tx/${receipt.transactionHash}\n`);
    emitToUser(userId, { message: `View on Etherscan: https://etherscan.io/tx/${receipt.transactionHash}\n`});
  } catch (error) {
    console.log(`Oh no! An error occured while swapping...`);
    emitToUser(userId, { message: "Oh no! An error occurred while swapping..."});
    console.error(error);
  }

  console.log(`Listening for new pairs created on Uniswap V2...\n`);
  emitToUser(userId, { message: "Listening for new pairs created on Uniswap V2...\n"});
});

console.log(`Listening for new pairs created on Uniswap V2...\n`);
emitToUser(userId,{ message: "Listening for new pairs created on Uniswap V2...\n"});
emitToUser(userId,{ message: "|\n"});
}

module.exports = startBot;
