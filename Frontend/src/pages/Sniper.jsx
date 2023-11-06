import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Console from "../components/Console";
import ASCIIart from "../utils/ASCII";
import { io } from "socket.io-client";
import { BiCopyAlt } from "react-icons/bi";
import { BsPlusCircleDotted } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
import { toast } from "react-toastify";
import etherscan from "../assets/etherscan.svg";
import { ethers } from "ethers";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
const WETHaddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const Sniper = () => {
  const socket = useRef(null);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [tokenToBuy, setTokenToBuy] = useState("");
  const [wallets, setWallets] = useState([]);
  const [selectedWalletPublicKey, setSelectedWalletPubliKey] = useState("");
  const [logs, setLogs] = useState([]);
  const userAddress = "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A";
  const userId = userAddress;
  const provider = new ethers.providers.JsonRpcProvider(
    `${import.meta.env.VITE_ALCHEMY_API_URL}`
  );

  useEffect(() => {
    // Fetch wallets on component mount
    fetchWallets();
  }, []);

  async function getBalances(address) {
    const WETH = new ethers.Contract(WETHaddress, ERC20.abi, provider);

    // Getting balances for weth and eth of the wallet
    const wethBalance = await WETH.balanceOf(address);
    const ethBalance = await provider.getBalance(address);

    return {
      wethBalance: ethers.utils.formatEther(wethBalance),
      ethBalance: ethers.utils.formatEther(ethBalance),
    };
  }

  //
  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_WEBSOCKET_URL}`, {
      transports: ["websocket"],
    });
    socket.current.emit("register-user", userId);
    socket.current.on("bot-log", (data) => {
      setLogs((prevLogs) => [...prevLogs, data.message]);
    });
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getUserWallets`,
        {
          params: { userAddress: "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A" },
        }
      );
      setWallets(response.data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  const createWallet = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/createWallet`,
        {
          userAddress: "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A",
        }
      );
      fetchWallets(); // Refresh the list of wallets
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };
  ////// need to create backend endpoint to update the users.wallets array so selected wallet will be indexed wallets[0] in database and wallets[0] will be used to snipe
  const setActiveWallet = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/update-wallets`,
        {
          userAddress: "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A",
          selectedWalletPublicKey,
        }
      );
    } catch (error) {
      console.error("Error updating the order of the wallets.array:", error);
    }
  };

  /// need a function to get the private keys from encrypted version to decrypted - possibly just get the whole wallets.array with decrypted keys already or use then another type of encryption to send from backend to frontend and decrypt there the newly decrypted keyss

  ////

  ///
  const startBot = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/startBot`,
        {
          userAddress: "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A",
          amount,
          slippage,
          tokenToBuy,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error starting bot:", error);
    }
  };
  const copyToClipboard = (publicKey) => {
    navigator.clipboard.writeText(publicKey);
    toast("Copied wallet address to clipboard!");
  };

  return (
    <>
      <div className="p-8 pt-10 m-32 border-black border-4 rounded-lg shadow-md shadow-white bg-slate-700">
        <div className="flex">
          <div className="w-1/3">
            <h1 className="text-xl font-bold mb-4">Uniswap V2 Sniper bot</h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                startBot();
              }}
              className="flex flex-col space-y-4" // This will stack your inputs vertically
            >
              <input
                type="text"
                placeholder="eg. 0.3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input text-end pr-4 input-bordered w-32"
                pattern="^\d+(\.\d+)?$" // regex for a number that may contain a dot
                required
              />

              <input
                type="number" // changed to text to use a pattern for validation
                placeholder="0.3 for 30%"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="input text-end input-bordered w-32"
                pattern="^\d+(\.\d+)?$" // same regex here
                required
                aria-label="Slippage"
              />

              <input
                type="text"
                placeholder=" ---Enter the token contract address here---"
                value={tokenToBuy}
                onChange={(e) => setTokenToBuy(e.target.value)}
                className="input text-center input-bordered w-full"
                pattern="^0x[a-fA-F0-9]{40}$" // regex for ERC-20 token address
                required
              />

              <div className="flex justify-between items-center">
                <button
                  type="button" // specify type button to prevent form submission
                  onClick={createWallet}
                  className="btn border-white  text-white bg-gradient-to-r from-slate-700 to-slate-800 flex content-center h-12 text-xs border p-2 rounded-tl-xl btn-outline w-32 btn-accent"
                >
                  <BsPlusCircleDotted />
                  Create New Wallet
                </button>
                <button
                  type="submit" // this button will submit the form
                  className="btn btn-primary  text-white text-bold h-12 w-full border-white border p-2 bg-gradient-to-r  from-green-700 to-green-600 rounded-tr-xl btn-outline btn-accent"
                >
                  ----Start Bot----
                </button>
              </div>
            </form>

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Your Wallets</h2>
              <ul>
                {wallets.map((wallet, index) => (
                  <li
                    key={wallet.publicKey}
                    className={`flex justify-items-start border-b-2 text-white text-bold border-white p-2 ${
                      selectedWalletPublicKey === wallet.publicKey
                        ? "bg-sky-300"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedWalletPubliKey(wallet.publicKey);
                      setActiveWallet();
                    }}
                  >
                    <span>
                      Address:{" "}
                      {wallet.publicKey.slice(0, 4) +
                        "..." +
                        wallet.publicKey.slice(-6)}
                    </span>

                    <button
                      onClick={() => copyToClipboard(wallet.publicKey)}
                      className="mx-4 mb-4"
                    >
                      <BiCopyAlt />
                    </button>
                    <a
                      href={`https://etherscan.io/address/${wallet.publicKey}`}
                    >
                      <img
                        src={etherscan}
                        alt="etherscan"
                        className="h-4 mt-2"
                      />
                    </a>
                    <span className="p-2 bg-slate-800 ml-4 mb-4 rounded-l-lg text-xs text-white">
                      {wallet.wethBalance ? wallet.wethBalance : "0.000"} WETH |
                    </span>
                    <span className="p-2 bg-slate-800 mb-4 rounded-r-lg text-xs text-white">
                      {wallet.ethBalance ? wallet.wethBalance : "0.000"} ETH
                    </span>
                    <span className=" flex content-end">
                      <BsFillTrash3Fill />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-1/2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod,
            quaerat?
          </div>
        </div>
        <Console>
          <div className="font-CourierPrime-Regular text-sm pt-2 ">
            <ASCIIart />
          </div>
          <div className="text-semibold font-CourierPrime-Regular text-green-500 text-lg">
            Start the bot after inserting all required fields - the selected
            wallet will be used to execute the transaction - make sure to
            provide enough ETH to cover for gas fees. WETH is used to buy the
            specified token
            ---------------------------------------------------------------------------------------
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
