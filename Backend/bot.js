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

/* const decryptedPrivateKey = "0x5aaf8787b75baddef92b2423d5b8a58c2e1d1077319caa2000f5c7f671603d3a"; //only for developement 
const tokenToBuy = "0xCC02cbCDD92205d74Be5934493650Edc3aC9dfB2";   //only for developement */

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

const AMOUNT = "0.2"; // ETH
const SLIPPAGE = 0.2;
const slippage = SLIPPAGE * 10; // 20% Slippage

async function startBot({ amount, slippage, tokenToBuy, decryptedPrivateKey }) {
  const wallet = new ethers.Wallet(decryptedPrivateKey, provider);
  const sniper = wallet.connect(provider);
  const sniperAdress = wallet.address;

  uFactory.on("PairCreated", async (token0, token1, pair, event) => {
    console.log(`New pair detected...\n`);
    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);
    console.log(`Pair Address: ${pair}\n`);

    let path = [];

    if (token0 === WETHaddress) {
      path = [token0, token1];
    }

    if (token1 === WETHaddress) {
      path = [token1, token0];
    }

    if (path.length === 0) {
      console.log(`Pair wasn't created with WETH...\n`);
      return;
    }
    if (path[1] !== tokenToBuy) {
      return;
    }

    const uPair = new ethers.Contract(pair, IUniswapV2Pair.abi, sniper);
    const token = new ethers.Contract(path[1], IERC20.abi, sniper); // Path[1] is the token to buy

    console.log(`Checking liquidity...\n`);

    //look at reserves, and price from the pair address to make sure there is liquidity, maybe will delete this as pair creation is the liquitiy provision event

    const reserves = await uPair.getReserves();

    if (reserves[0] === 0 && reserves[1] === 0) {
      console.log(`Token has no liquidity...`);
      return;
    }

    console.log(`Swapping...\n`);

    try {
      const amountIn = ethers.utils.parseEther(AMOUNT);
      const amounts = await uRouter.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[1].sub(amounts[1].div(slippage)); //div20 for 20% slippage
      const deadline = Date.now() + 10 * 60 * 1000; //10 mins

      await WETH.approve(uniRouterAddress, amountIn);
      console.log("Approved WETH... Swapping... \n");

      const estimatedGas = await uRouter.estimateGas.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        sniperAdress,
        deadline
      );

      // Add a buffer to the estimated gas
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
      console.log(
        `Swapped ${AMOUNT} WETH for ${ethers.utils.formatEther(
          tokenBalance
        )} ${symbol}\n`
      );
      console.log(
        `View on Etherscan: https://etherscan.io/tx/${receipt.transactionHash}\n`
      );
    } catch (error) {
      console.log(`Oh no! An error occured while swapping...`);
      console.error(error);
    }

    console.log(`Listening for new pairs created on Uniswap V2...\n`);
  });

  console.log(`Listening for new pairs created on Uniswap V2...\n`);
}

main();

module.exports = startBot;
