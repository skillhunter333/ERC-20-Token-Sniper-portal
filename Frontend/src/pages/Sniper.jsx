import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Console from "../components/Console";
import ASCIIart from "../utils/ASCII";
import { io } from "socket.io-client";
import { BsPlusCircleDotted, BsFillSignStopFill } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { toast } from "react-toastify";

import WalletList from "../components/WalletList";
import useWallets from "../hooks/useWallets";
import CustomSelectInput from "../utils/MethodSelectInput";
import SelectFlashbot from "../components/selectFlashbot";
import Sell from "../components/Sell";

const userId = "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A";

const Sniper = () => {
  const socket = useRef(null);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [tokenToBuy, setTokenToBuy] = useState("");
  const [
    wallets,
    walletsIncludingBalances,
    fetchWallets,
    handleCreateWallet,
    handleSetActiveWallet,
    handleDeleteWallet,
    copyToClipboard,
    refreshBalances,
    handleDelete,
  ] = useWallets(userId);

  const [logs, setLogs] = useState([]);

  const [method, setMethod] = useState("");

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
      toast.success("Stopping this Bot Instance!");
    } catch (error) {
      toast.error(
        `Error stopping bot: ${error.response?.data?.message || error.message}`
      );
    }
  };

  ////////////////////////////////

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

    if (userId) {
      registerUser();
    }
    return () => {
      if (socket.current) {
        socket.current.off("bot-log", handleBotLog);
        socket.current.emit("unregister", userId);
        if (socket.current.connected) {
          socket.current.disconnect();
        }
      }
    };
  }, [userId]);

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
                  className="input w-32 h-8 text-end text-slate-200 pr-4 border-purple-950 border-2 bg-slate-950 rounded-none rounded-bl-xl"
                  pattern="^\d+(\.\d+)?$"
                  required
                />

                <span className="font-bold  text-slate-400 text-center pl-2 ">
                  WETH
                </span>
                <button className=" w-1/3 mx-1 text-center ml-2 h-8  px-1 pb-1 bg-green-800 font-semibold border-purple-950 text-slate-500 border-2 rounded-none rounded-bl-lg">
                  10 %
                </button>
                <button className="border-2 h-8 w-1/2 text-slate-500 bg-green-900 border-purple-950 font-semibold px-1 pb-1 ">
                  50 %
                </button>
                <button className="border-2 h-8 mx-1 w-full text-slate-500 border-purple-950  bg-green-950 font-semibold  px-1 pb-1 rounded-none rounded-tr-lg">
                  100 %
                </button>
              </div>

              <div className="flex space-x-2">
                <div className="flex flex-col">
                  <input
                    id="slippageInput"
                    type="text"
                    placeholder="eg. 30%"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl"
                    pattern="^\d+(\.\d+)?$"
                    required
                  />
                </div>
                <span className="font-bold ml-2 text-slate-400 flex-grow">
                  Slippage in %
                </span>
                <div className="bg-slate-900 border-2 border-purple-950 w-1/2 flex justify-between items-center rounded-none rounded-t-xl">
                  <button
                    type="button"
                    className="text-slate-300 ml-6 p-2 hover:text-sky-300"
                    onClick={refreshBalances}
                  >
                    <IoReload size={28} />
                  </button>
                  <button
                    type="button"
                    className="text-red-900 p-2 hover:text-red-800"
                    onClick={handleStopBot}
                  >
                    <BsFillSignStopFill size={28} />
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
                  className="input input-bordered text-center  w-full h-8 text-slate-300 border-purple-950 border-2 bg-slate-950 rounded-none"
                  pattern="^0x[a-fA-F0-9]{40}$"
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleCreateWallet}
                  className=" border-slate-300  text-slate-300 bg-gradient-to-r from-slate-700 to-slate-800 flex content-center h-12 text-xs border p-2  rounded-none rounded-tl-xl  w-32 hover:text-sky-300 hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-700 hover:to-sky-800"
                >
                  <BsPlusCircleDotted />
                  Create New Wallet
                </button>
                <button
                  type="submit"
                  className=" text-slate-300 text-bold h-12 w-full border-slate-300 border p-2 bg-gradient-to-r  from-green-700 to-green-600 rounded-tr-xl btn-outline btn-accent"
                  onClick={handleStartBot}
                >
                  ----Start Bot----
                </button>
              </div>
            </form>

            <div className="mb-4 mt-2">
              <h2 className="text-lg font-semibold">Your Wallets</h2>

              <ul>
                {" "}
                <WalletList
                  userId={userId}
                  wallets={walletsIncludingBalances}
                  onWalletDelete={handleDelete}
                  onWalletSetActive={handleSetActiveWallet}
                  onWalletCopy={copyToClipboard}
                />
              </ul>
            </div>
          </div>
          <div id="second-row" className="w-1/3 flex flex-col pt-8 mx-4 p-4">
            <div className="flex-grow h-40 items-end">
              <CustomSelectInput />
            </div>
            <div className=" h-2/3 border-t-2 border-slate-900 w-full">
              <SelectFlashbot />
            </div>
            <div className="flex flex-grow h-full border-t-2 border-black"></div>
          </div>

          <div id="third row" className="w-1/3 flex mt-2 pt-8 mx-4 p-4 ">
            <Sell />
          </div>
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
