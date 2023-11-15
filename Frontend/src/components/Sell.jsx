import React, { useState } from "react";
import { IoReload } from "react-icons/io5";

const Sell = () => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [sellAmount, setSellAmount] = useState("");
  const [slippageSell, setSlippageSell] = useState(10);

  const handlePercentage = (percentage) => {
    const newSellAmount = (totalTokens * percentage) / 100;
    setSellAmount(newSellAmount);
  };

  const handleSliderChange = (e) => {
    const invertedValue = 100 - e.target.value;
    handlePercentage(invertedValue);
  };
  const handleSellAmountChange = (e) => {
    const inputAmount = e.target.validity.valid ? e.target.value : sellAmount;
    setSellAmount(inputAmount);
  };

  return (
    <div className=" w-full border-purple-950 border-r-2 rounded-tr-2xl bg-slate-800 border-t-2 ">
      <div>
        <div id="amount" className="flex items-start">
          {["100", "50", "10"].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handlePercentage(percentage)}
              className={`border-2 h-8  ${
                percentage === "100" ? "flex-grow w-full  bg-red-950 " : "w-1/2"
              }
              ${
                percentage === "10" ? "bg-red-800 mr-2" : "bg-red-900"
              } text-slate-500 border-purple-900  font-semibold px-1 pb-1 rounded-none hover:text-slate-300 hover:border-4`}
            >
              {percentage} %
            </button>
          ))}
          <span className="font-bold text-slate-400 text-center pr-2 ">
            Token
          </span>
          <input
            id="tokenAmountInput"
            type="text"
            placeholder="0000"
            value={sellAmount}
            onChange={handleSellAmountChange}
            className="input w-32 h-8 text-end text-slate-200 pl-4 border-purple-950 border-2 bg-slate-950 rounded-none rounded-tr-xl "
            pattern="^\d+(\.\d+)?$"
          />
        </div>

        <div className="w-full transform scale-x-[-1]">
          <input
            type="range"
            min={0}
            max={100}
            value={parseInt((sellAmount / totalTokens) * 100) || 0}
            onChange={handleSliderChange}
            className="range range-xs"
          />
        </div>

        <div className="flex flex-col mt-4 space-y-2">
          <div className="flex justify-end items-end w-full">
            <div className="bg-slate-900 border-2 border-purple-950 w-1/2 flex justify-between items-center rounded-none rounded-t-xl">
              <button
                type="button"
                className="text-slate-300 ml-6 p-2 hover:text-sky-300"
                onClick={console.log("reload tokenamount")}
              >
                <IoReload size={28} />
              </button>
            </div>

            <span className="font-bold text-slate-400">Slippage in %</span>
            <input
              id="slippageInput"
              type="text"
              placeholder="eg. 30%"
              value={slippageSell}
              onChange={(e) => setSlippageSell(e.target.value)}
              className="input w-32 h-8 ml-4 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tr-xl"
              pattern="^\d+(\.\d+)?$"
            />
          </div>
          <div className="flex pt-8">
            <button className="text-slate-400 text-bold h-12  w-32 border-slate-900 border p-2 bg-gradient-to-r from-red-950 to-red-900 btn-outline btn-accent rounded-tl-xl">
              Sell
            </button>
            <div className="bg-slate-900 flex flex-grow space-x-4 italic items-center justify-center h-12 text-purple-700 font-semibold text-lg">
              <span>P/L</span>
              <span>0.00</span>
              <span>%</span>
              <span className="px-8">|</span>
              <span>0.00</span>
              <span>USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
