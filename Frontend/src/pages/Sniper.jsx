import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Console from "../components/Console";
import ASCIIart from "../utils/ASCII";
import { io } from "socket.io-client";

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

  useEffect(() => {
    // Fetch wallets on component mount
    fetchWallets();
  }, []);

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

  return (
    <>
      <div className="p-8 m-32 rounded-lg shadow-md shadow-white bg-slate-500">
        <h1 className="text-xl font-bold mb-4">Uniswap V2 Sniper bot</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Slippage"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Token to Buy"
            value={tokenToBuy}
            onChange={(e) => setTokenToBuy(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>

        <div className="mb-4">
          <button onClick={startBot} className="btn btn-primary">
            Start Bot
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={createWallet}
            className="btn border-white border p-2 rounded-tl-xl btn-outline btn-accent"
          >
            + Create New Wallet
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Your Wallets</h2>
          <ul>
            {wallets.map((wallet, index) => (
              <li
                key={wallet.publicKey}
                className={`p-2 ${
                  selectedWalletPublicKey === wallet.publicKey
                    ? "bg-sky-300"
                    : ""
                }`}
                onClick={() => {
                  setSelectedWalletPubliKey(wallet.publicKey);
                  setActiveWallet();
                }}
              >
                Public Key: {wallet.publicKey}
                {/* Toggle to show/hide private key */}
              </li>
            ))}
          </ul>
        </div>
        <Console>
          <ASCIIart />
          <div className="text-semibold text-2xl">
            Insert the amount to buy with (e.g 0.25), the slippage to use (e.g
            0.2 for 20%) and the token contract you are aiming to buy. The
            selected wallet will be used to execute the transaction, make sure
            to provide enough funds to cover the gas fees.
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
