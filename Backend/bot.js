const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  process.env.BLOCKCHAIN_API
); // API provider URL

const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
const IUniswapV2Pair = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");

const uniFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const uniRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const uFactory = new ethers.Contract(
  uniFactoryAddress,
  IUniswapV2Factory.abi,
  provider
);
const uRouter = new ethers.Contract(
  uniRouterAddress,
  IUniswapV2Router02.abi,
  provider
);
const WETH = new ethers.Contract(
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  IERC20.abi,
  provider
);

let AMOUNT = "0.1"; // ETH
let SLIPPAGE = 0.2; // 20% Slippage
let TARGET_TOKEN_ADDRESS = "";
let GAS_PRICE_MULTIPLIER = 1.2; // Multiplier for adjusting the gas and gaslimit (1 for no change)

const main = async () => {
  let decryptedPrivateKey =
    "decrypt the pk from signed user address.wallets[select on UI which public key of array to use]";
  const sniper = new Wallet(decryptedPrivateKey);

  // Approve WETH at the beginning
  const amountIn = ethers.utils.parseEther(AMOUNT);
  await WETH.approve(uRouter.address, amountIn);

  // Create event listener to listen to PairCreated
  uFactory.on("PairCreated", async (token0, token1, pair, event) => {
    console.log(`New pair detected...\n`);
    console.log(`Token0: ${token0}`);
    console.log(`Token1: ${token1}`);
    console.log(`Pair Address: ${pair}\n`);

    let path = [];

    if (token0 === WETH.address) {
      path = [token0, token1];
    }

    if (token1 === WETH.address) {
      path = [token1, token0];
    }

    if (path.length === 0) {
      console.log(`Pair wasn't created with WETH...\n`);
      return;
    }

    const uPair = new ethers.Contract(pair, IUniswapV2Pair.abi, provider);
    const token = new ethers.Contract(path[1], IERC20.abi, provider); // Path[1] will always be the token we are buying.

    console.log(`Checking liquidity...\n`);

    //look at reserves, and price from the pair address to make sure there is liquidity, maybe will delete

    const reserves = await uPair.getReserves();

    if (reserves[0].isZero() && reserves[1].isZero()) {
      console.log(`Token has no liquidity...`);
      return;
    }

    console.log(`Swapping WETH...\n`);

    try {
      const amounts = await uRouter.getAmountsOut(amountIn, path);
      const amountOut = amounts[1].sub(amounts[1].mul(SLIPPAGE)).toString();
      const deadline = Date.now() + 10 * 60 * 1000; //10 mins

      const gas = await uRouter.estimateGas.swapExactTokensForTokens(
        amountIn,
        amountOut,
        path,
        sniper,
        deadline
      );
      const gasLimit = Math.floor(gas * GAS_PRICE_MULTIPLIER);
      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(GAS_PRICE_MULTIPLIER);

      const tx = await uRouter.swapExactTokensForTokens(
        amountIn,
        amountOut,
        path,
        sniper,
        deadline,
        {
          gasLimit,
          gasPrice: adjustedGasPrice,
        }
      );
      await tx.wait();

      console.log(`Swap Successful\n`);

      // Check user balance of token:
      const symbol = await token.symbol();
      const tokenBalance = await token.balanceOf(sniper);

      console.log(
        `Successfully swapped ${AMOUNT} WETH for ${ethers.utils.formatEther(
          tokenBalance
        )} ${symbol}\n`
      );
    } catch (error) {
      console.log(`Error Occurred while swapping...`);
      console.log(`You may need to adjust slippage, or amountIn.\n`);
      console.error(error);
    }

    console.log(`Listening for new pairs...\n`);
  });

  console.log(`Listening for new pairs...\n`);
};

main();
