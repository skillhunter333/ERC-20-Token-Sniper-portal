import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Console from "../components/Console";
import ASCIIart from "../utils/ASCII";
import { io } from "socket.io-client";
import { BiCopyAlt } from "react-icons/bi";
import {
  BsPlusCircleDotted,
  BsFillTrash3Fill,
  BsFillSignStopFill,
} from "react-icons/bs";
import { toast } from "react-toastify";
import etherscan from "../assets/etherscan.svg";
import { ethers } from "ethers";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";

const WETHaddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const userId = "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A";
const provider = new ethers.providers.JsonRpcProvider(
  `${import.meta.env.VITE_ALCHEMY_API_URL}`
);

const WETH = new ethers.Contract(WETHaddress, ERC20.abi, provider);

const Sniper = () => {
  const socket = useRef(null);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [tokenToBuy, setTokenToBuy] = useState("");
  const [wallets, setWallets] = useState([]);
  const [walletsIncludingBalances, setWalletsIncludingBalances] = useState([]);

  const [selectedWalletPublicKey, setSelectedWalletPublicKey] = useState("");
  const [logs, setLogs] = useState([]);

  /////////////Functions

  const handleStartBot = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/startBot`,
        {
          userId,
          amount,
          slippage,
          tokenToBuy,
        },
        { headers: { "Cache-Control": "no-cache" } }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error starting bot:", error);
    }
  };

  const handleStopBot = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stopBot`,
        { userId }
      );
      console.log(response.data); // handle
      toast.success("Bot stopped successfully!");
    } catch (error) {
      toast.error(
        `Error stopping bot: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleFetchWallets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getUserWallets`,
        {
          params: { userId },
        }
      );

      setWallets(response.data);
    } catch (error) {
      toast.error(
        `Error fetching wallets: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // get balances
  async function getBalances(address) {
    // Getting balances for weth and eth of the wallet
    const wethBalance = await WETH.balanceOf(address);
    const ethBalance = await provider.getBalance(address);

    return {
      wethBalance: ethers.utils.formatEther(wethBalance),
      ethBalance: ethers.utils.formatEther(ethBalance),
    };
  }

  async function fetchAndSetBalances(wallets) {
    const walletsUpdatedWithBalances = await Promise.all(
      wallets.map(async (wallet) => {
        const balances = await getBalances(wallet.publicKey);
        return {
          ...wallet,
          wethBalance: balances.wethBalance,
          ethBalance: balances.ethBalance,
        };
      })
    );

    setWalletsIncludingBalances(walletsUpdatedWithBalances);
  }

  const handleCreateWallet = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-wallet`,
        {
          userId,
        }
      );
      setWallets([...wallets, response.data]);
      handleFetchWallets();
      toast.success("Wallet created successfully!");
    } catch (error) {
      toast.error(
        `Error creating wallet: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleSetActiveWallet = async (key) => {
    try {
      setSelectedWalletPublicKey(key);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/set-active-wallet`,
        {
          userId,
          walletPublicKey,
        }
      );
      toast.success("Active wallet set successfully!");
    } catch (error) {
      toast.error(
        `Error setting active wallet: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteWallet = async (walletpublicKey) => {
    try {
      //delete the wallet by its id // maybe push in deleted wallets array?
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/${walletId}`
      );
      // Filter out the deleted wallet from the local state
      setWallets(wallets.filter((wallet) => wallet.id !== walletId));
      toast.success("Wallet deleted successfully!");
      handleFetchWallets();
    } catch (error) {
      toast.error(
        `Error deleting wallet: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // copy wallet address
  const copyToClipboard = (publicKey) => {
    navigator.clipboard.writeText(publicKey);
    toast("Copied wallet address to clipboard!");
  };

  ///////////////
  useEffect(() => {
    handleFetchWallets();
    // When the component unmounts, disconnect the socket
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (wallets.length > 0) {
      fetchAndSetBalances(wallets);
    }
  }, [wallets]);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(`${import.meta.env.VITE_WEBSOCKET_URL}`, {
        transports: ["websocket"],
      });
    }

    const registerUser = () => {
      socket.current.emit("register-user", userId);
    };

    const handleBotLog = (data) => {
      setLogs((prevLogs) => [...prevLogs, data.message]);
    };

    socket.current.on("connect", registerUser);
    socket.current.on("bot-log", handleBotLog);

    // If the user ID changes, we need to re-register the user
    registerUser();

    return () => {
      if (socket.current) {
        socket.current.off("bot-log", handleBotLog);
      }
    };
  }, [userId]);

  // Render Wallets
  const renderWallets = () =>
    walletsIncludingBalances.map((wallet, index) => (
      <li
        key={wallet.publicKey}
        className={`flex justify-items-start border-b-2 text-white text-bold border-white p-2 
                    ${
                      selectedWalletPublicKey === wallet.publicKey
                        ? "bg-sky-700"
                        : ""
                    }`}
        onClick={() => {
          handleSetActiveWallet(key);
        }}
      >
        <span>
          Address:{" "}
          {wallet.publicKey.slice(0, 4) + "..." + wallet.publicKey.slice(-6)}
        </span>

        <button
          onClick={() => copyToClipboard(wallet.publicKey)}
          className="mx-4 mb-4"
        >
          <BiCopyAlt />
        </button>
        <a href={`https://etherscan.io/address/${wallet.publicKey}`}>
          <img src={etherscan} alt="etherscan" className="h-4 mt-2" />
        </a>
        <span className="p-2 bg-slate-800 ml-4 mb-4 rounded-l-lg text-xs text-white">
          {wallet.wethBalance ? wallet.wethBalance : "0.000"} WETH |
        </span>
        <span className="p-2 bg-slate-800 mb-4 rounded-r-lg text-xs text-white">
          {wallet.ethBalance ? wallet.ethBalance : "nA"} ETH
        </span>
        <button
          className="ml-8 mt-2"
          onClick={() => handleDeleteWallet(wallet.publicKey)}
        >
          <BsFillTrash3Fill />
        </button>
      </li>
    ));

  //Main /////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="p-8 pt-10 m-32 border-black border-4 rounded-lg shadow-md shadow-white bg-slate-700">
        <div className="flex">
          <div className="w-1/3">
            <h1 className="text-xl font-bold mb-4">Uniswap V2 Sniper bot</h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStartBot();
              }}
              className="flex flex-col space-y-4"
            >
              <div id="amount" className="flex flex-row items-start">
                <input
                  id="amountInput"
                  type="text"
                  placeholder="eg. 0.3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input w-32 text-end text-slate-200 pr-4 border-purple-950 border-2 bg-slate-950 rounded-bl-xl"
                  pattern="^\d+(\.\d+)?$"
                  required
                />

                <span className="font-bold  text-slate-400 text-center pl-2 ">
                  WETH
                </span>
                <button className=" w-1/3 mx-1 text-center ml-2 h-8  px-1 pb-1 bg-green-800 font-semibold border-purple-950 text-slate-500 border-2 rounded-bl-lg">
                  10 %
                </button>
                <button className="border-2 h-8 w-1/2 text-slate-500 bg-green-900 border-purple-950 font-semibold px-1 pb-1 ">
                  50 %
                </button>
                <button className="border-2 h-8 mx-1 w-full text-slate-500 border-purple-950  bg-green-950 font-semibold  px-1 pb-1 rounded-tr-lg">
                  100 %
                </button>
              </div>

              <div className="flex space-x-2">
                <div className="flex flex-col">
                  <input
                    id="slippageInput"
                    type="text"
                    placeholder="0.3 for 30%"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="input w-32 text-end border-purple-950 border-2 bg-slate-950 rounded-tl-xl"
                    pattern="^\d+(\.\d+)?$"
                    required
                  />
                </div>
                <span className="font-bold ml-2 text-slate-400 ">
                  Slippage in %
                </span>
                <div className="bg-slate-900 border border-purple-950">
                  <button
                    className="text-red-800 ml-32"
                    onClick={handleStopBot}
                  >
                    <BsFillSignStopFill size={42} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <input
                  id="tokenToBuyInput"
                  type="text"
                  placeholder=" ---Paste the token contract address here---"
                  value={tokenToBuy}
                  onChange={(e) => setTokenToBuy(e.target.value)}
                  className="input text-center input-bordered w-full border-purple-950 border-2 bg-slate-950"
                  pattern="^0x[a-fA-F0-9]{40}$"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button" // specify type button to prevent form submission
                  onClick={handleCreateWallet}
                  className="btn border-slate-300  text-slate-300 bg-gradient-to-r from-slate-700 to-slate-800 flex content-center h-12 text-xs border p-2 rounded-tl-xl btn-outline w-32 btn-accent"
                >
                  <BsPlusCircleDotted />
                  Create New Wallet
                </button>
                <button
                  type="submit" // this button will submit the form
                  className="btn btn-primary  text-slate-300 text-bold h-12 w-full border-slate-300 border p-2 bg-gradient-to-r  from-green-700 to-green-600 rounded-tr-xl btn-outline btn-accent"
                  onClick={handleStartBot}
                >
                  ----Start Bot----
                </button>
              </div>
            </form>

            <div className="mb-4 mt-2">
              <h2 className="text-lg font-semibold">Your Wallets</h2>

              <ul>{renderWallets()}</ul>
            </div>
          </div>
          <div className="w-1/3">
            <h3 className="font-semibold text-xl">Anti bot meassures </h3>
          </div>
          <div className="w-1/3">Sell Options</div>
        </div>
        <Console>
          <div className="font-CourierPrime-Regular text-sm pt-2 ">
            <ASCIIart />
          </div>
          <div className="text-semibold font-CourierPrime-Regular text-green-500 text-lg">
            The selected wallet will be used to execute the transaction - make
            sure to{" "}
            <span className="text-sky-700 underline">
              {" "}
              provide enough ETH to cover for gas fees and enough WETH to buy{" "}
            </span>{" "}
            the specified token
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
          </div>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </Console>
      </div>
    </>
  );
};

export default Sniper;
