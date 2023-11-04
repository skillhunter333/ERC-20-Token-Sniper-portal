import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Console from "../components/Console";
import ASCIIart from "../utils/ASCII";
import { io } from "socket.io-client";
const socket = io(`${import.meta.env.VITE_WEBSOCKET_URL}`);

const Sniper = () => {
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [tokenToBuy, setTokenToBuy] = useState("");
  const [wallets, setWallets] = useState([]);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(null);
  const [logs, setLogs] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // Fetch wallets on component mount
    fetchWallets();
  }, []);
  useEffect(() => {
    ws.current = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);
    ws.current.onmessage = (event) => {
      const message = event.data;
      setLogs((prevLogs) => [...prevLogs, message]);
    };
    ws.current.onclose = () => console.log("WebSocket disconnected");
    // Make sure to close the WebSocket connection when the component unmounts
    return () => {
      ws.current.close();
    };
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
  const setWallet = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/update-wallets`,
        {
          wallets: [...wallets],
        }
      );
    } catch (error) {
      console.error("Error updating the order of the wallets.array:", error);
    }
  };

  /// need a function to get the private keys from encrypted version to decrypted - possibly just get the whole wallets.array with decrypted keys already or use then another type of encryption to send from backend to frontend and decrypt there the newly decrypted keyss

  ////

  ///
  const startBot = async (socketId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/startBot`,
        {
          userAddress: "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A",
          amount,
          slippage,
          tokenToBuy,
          socketId,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error starting bot:", error);
    }
  };

  // Listen for bot log events
  socket.on("bot-log", (data) => {
    setLogs(data);
  });

  const selectWallet = (index) => {
    // This will be used to set the selected wallet as primary for the bot
    setSelectedWalletIndex(index);
    // Logic to reorder wallets array and set to state
    const newWallets = [...wallets];
    [newWallets[0], newWallets[index]] = [newWallets[index], newWallets[0]];
    setWallets(newWallets);
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
          <button onClick={createWallet} className="btn btn-outline btn-accent">
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
                  selectedWalletIndex === index ? "bg-blue-200" : ""
                }`}
                onClick={() => selectWallet(index)}
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
