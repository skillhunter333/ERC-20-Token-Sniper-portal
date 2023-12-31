import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Console from "../components/Console";
import { io } from "socket.io-client";
import { BsPlusCircleDotted, BsFillSignStopFill } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { toast } from "react-toastify";

import WalletList from "../components/WalletList";
import useWallets from "../hooks/useWallets";
import CustomSelectInput from "../utils/MethodSelectInput";
import SelectFlashbot from "../components/selectFlashbot";
import Sell from "../components/Sell";
import Customgas from "../components/CustomGas";
import GasMultiplier from "../components/GasMultiplier";
import MaxTx from "../components/MaxTx";
import SellOptions from "../components/SellOptions";

const userId = "0x3929B2Ff6a288C7454F5B5ffe652e3300126480A";

const Sniper = () => {
  const socket = useRef(null);
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("");
  const [tokenToBuy, setTokenToBuy] = useState("");
  const [isClassicMode, setIsClassicMode] = useState(false);
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
  //////////

  const [selectedWalletPublicKey, setSelectedWalletPublicKey] = useState("");

  useEffect(() => {
    if (walletsIncludingBalances.length > 0) {
      setSelectedWalletPublicKey(walletsIncludingBalances[0].publicKey);
    }
  }, [walletsIncludingBalances]);

  const [logs, setLogs] = useState([]);

  const [isCustomFixedGasEnabled, setIsCustomFixedGasEnabled] = useState(false);
  const [fixedGasPrice, setFixedGasPrice] = useState(null);
  const [fixedGasLimit, setFixedGasLimit] = useState(null);

  const [isGasMultiplierEnabled, setIsGasMultiplierEnabled] = useState(true);
  const [multiplierValue, setMultiplierValue] = useState(1.3);

  const [isCustomMethodEnabled, setIsCustomMethodEnabled] = useState(false);
  const [customMethod, setCustomMethod] = useState(null);

  const [flashBotEnabled, setFlashBotEnabled] = useState(null);
  const [bribeValue, setBribeValue] = useState(null);

  const [isMaxTxEnabled, setIsMaxTxEnabled] = useState(false);
  const [maxTx, setMaxTx] = useState(null);

  ////////////////// toggle functions

  const handleGasMultiplierToggle = (isEnabled) => {
    setIsGasMultiplierEnabled(isEnabled);
    if (isEnabled) {
      setIsCustomFixedGasEnabled(false);
      setFlashBotEnabled(false);
    }
  };

  const handleCustomFixedGasToggle = (isEnabled) => {
    setIsCustomFixedGasEnabled(isEnabled);
    if (isEnabled) {
      setIsGasMultiplierEnabled(false);
      setFlashBotEnabled(false);
    }
  };

  const handleFlashBotToggle = (isEnabled) => {
    setFlashBotEnabled(isEnabled);
    if (isEnabled) {
      setIsGasMultiplierEnabled(false);
      setIsCustomFixedGasEnabled(false);
    }
  };

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
          fixedGasPrice,
          fixedGasLimit,
          multiplierValue,
          customMethod,
          bribeValue,
          maxTx,
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

  ////handle Wallet

  const onSetActiveWallet = (walletPublicKey) => {
    setSelectedWalletPublicKey(walletPublicKey);
    handleSetActiveWallet(walletPublicKey); // Calling backend update
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
          <div className="w-1/3 bg-purple-950 border-t-[24px] border-r-[16px] border-l-[24px]  border-purple-950 rounded-tl-3xl rounded-tr-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStartBot();
              }}
              className="flex flex-col border-t-8 border-purple-950 rounded-t-3xl pt-2 bg-slate-800 border-2 space-y-4"
            >
              <div id="amount" className="flex flex-row pt-4 items-start">
                <input
                  id="amountInput"
                  type="text"
                  placeholder="eg. 0.3"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input w-32 h-8 text-end text-slate-200 pr-4 border-purple-950 border-2 bg-slate-950 rounded-none  rounded-bl-2xl"
                  pattern="^\d+(\.\d+)?$"
                  required
                />

                <span className="font-bold  text-slate-400 text-center pl-2 ">
                  WETH
                </span>
                <button className=" w-1/3  text-center ml-2 h-8  px-1 pb-1 bg-green-800 font-semibold border-purple-900 text-slate-500 border-2 rounded-none rounded-bl-lg hover:text-slate-300 hover:border-4">
                  10 %
                </button>
                <button className="border-2 h-8 w-1/2 text-slate-500 bg-green-900 border-purple-900 font-semibold px-1 pb-1 hover:text-slate-300 hover:border-4 ">
                  50 %
                </button>
                <button className="border-2 h-8  w-full text-slate-500 border-purple-900  bg-green-950 font-semibold  px-1 pb-1 rounded-none   hover:text-slate-300 hover:border-4">
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
                    className="input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-2xl"
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
                    <IoReload size={28} onClick={fetchWallets} />
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
                  className=" border-purple-700 border-b-4  text-slate-300 bg-gradient-to-r from-slate-700 to-slate-800 flex content-center h-12 text-xs border p-2  rounded-none rounded-tl-xl  w-32 hover:text-sky-300 hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-700 hover:to-sky-800"
                >
                  <BsPlusCircleDotted />
                  Create New Wallet
                </button>
                <button
                  type="submit"
                  className=" text-purple-700 text-bold h-12 w-full border-purple-700 border-2 border-b-4 p-2 bg-gradient-to-r  from-green-700 to-green-600 rounded-tr-xl  btn-outline btn-accent"
                  onClick={handleStartBot}
                >
                  ----Start Bot----
                </button>
              </div>
            </form>

            <div className="mb-4 pt-2  bg-slate-900">
              <h2 className="text-lg font-semibold">Your Wallets</h2>

              <ul>
                {" "}
                <WalletList
                  walletsIncludingBalances={walletsIncludingBalances}
                  deleteWallet={handleDelete}
                  setActiveWallet={onSetActiveWallet}
                  copyWalletAddress={copyToClipboard}
                  selectedWalletPublicKey={selectedWalletPublicKey}
                />
              </ul>
              <div className="flex-grow flex-col h-max  bg-slate-900">
                {" "}
                here
              </div>
            </div>
          </div>
          <div
            id="second-row"
            className="w-1/3 bg-slate-900 border-purple-950 border-t-[16px]    flex flex-col mt-8  px-8  "
          >
            <div className="h-20 pt-2 mb-4 ">
              <GasMultiplier
                setMultiplierValue={setMultiplierValue}
                isEnabled={isGasMultiplierEnabled}
                setIsEnabled={handleGasMultiplierToggle}
              />
            </div>
            <div className="h-20 mb-4 pt-2 border-t-2   border-slate-400">
              <Customgas
                setFixedGasPrice={setFixedGasPrice}
                setFixedGasLimit={setFixedGasLimit}
                isEnabled={isCustomFixedGasEnabled}
                setIsEnabled={handleCustomFixedGasToggle}
              />
            </div>
            <div className="h-20 mb-4 pt-2 items-end  border-t-2   border-slate-400">
              <CustomSelectInput
                setCustomMethod={setCustomMethod}
                isEnabled={isCustomMethodEnabled}
                setIsEnabled={setIsCustomMethodEnabled}
              />
            </div>
            <div className=" h-20 mb-4 pt-2 border-t-2   border-slate-400 w-full">
              <SelectFlashbot
                setBribeValue={setBribeValue}
                isEnabled={flashBotEnabled}
                setIsEnabled={handleFlashBotToggle}
              />
            </div>
            <div className=" h-20 mb-4 pt-2 border-t-2   border-slate-400 w-full">
              <MaxTx
                setMaxTx={setMaxTx}
                isEnabled={isMaxTxEnabled}
                setIsEnabled={setIsMaxTxEnabled}
              />
            </div>
          </div>

          <div
            id="third row"
            className="w-1/3 flex-grow relative mt-8  border-[16px] bg-purple-950 border-purple-950 border-r-[24px] rounded-tr-3xl"
          >
            <div className="border-b-4 h-fit border-purple-900">
              <Sell />
            </div>
            <div className="flex-grow mt-4 ">
              <SellOptions />
            </div>
            <div className="bg-slate-900   border-b-8 border-slate-100"></div>

            <div className="absolute bottom-0 right-0 space-x-4 mb-2 mr-2 text-slate-400">
              <button
                className="underline"
                onClick={console.log("Classic Mode")}
              >
                Chart Mode
              </button>
              <button
                className="underline"
                onClick={console.log("Classic Mode")}
              >
                Classic
              </button>
              <button
                className="underline"
                onClick={console.log("Classic Mode")}
              >
                Pro
              </button>
            </div>
          </div>
        </div>
        <Console>
          <div className="text-bold font-CourierPrime-Regular text-2xl my-4 text-center border-2 border-purple-900 text-pink-700">
            ERC-20 Sniper Bot (Uniswap V2)
          </div>
          <div className="text-semibold font-CourierPrime-Regular text-green-500 text-lg text-center border-b border-dashed border-green-500">
            The selected wallet will be used to execute the transaction - make
            sure to{" "}
            <span className="text-sky-700 underline">
              {" "}
              provide enough ETH to cover for gas fees and enough WETH to buy{" "}
            </span>{" "}
            the specified token
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
