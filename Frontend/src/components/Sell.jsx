import React, { useState } from "react";

const Sell = () => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [sellAmount, setSellAmount] = useState("");
  const [slippageSell, setSlippageSell] = useState(10);

  const handlePercentage = (percentage) => {
    const newSellAmount = (totalTokens * percentage) / 100;
    setSellAmount(newSellAmount);
  };

  const handleSliderChange = (e) => {
    const sliderValue = e.target.value;
    handlePercentage(sliderValue);
  };

  const handleSellAmountChange = (e) => {
    const inputAmount = e.target.validity.valid ? e.target.value : sellAmount;
    setSellAmount(inputAmount);
  };

  return (
    <div className="mt-1 w-full ">
      <div>
        <div id="amount" className="flex items-start">
          {["100", "50", "10"].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handlePercentage(percentage)}
              className={`border-2 h-8 mx-1 ${
                percentage === "100"
                  ? "flex-grow w-full rounded-tl-lg bg-red-950"
                  : "w-1/2"
              }
              ${
                percentage === "50" ? "bg-red-900" : "bg-red-800"
              } text-slate-500 border-purple-950  font-semibold px-1 pb-1 rounded-none`}
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
            className="input w-32 h-8 text-end text-slate-200 pl-4 border-purple-950 border-2 bg-slate-950 rounded-none rounded-br-xl"
            pattern="^\d+(\.\d+)?$"
          />
        </div>

        <div className="mt-2 w-full transform scale-x-[-1]">
          <input
            type="range"
            min={0}
            max={100}
            value={parseInt((sellAmount / totalTokens) * 100) || 0}
            onChange={handleSliderChange}
            className="range range-xs w-full"
          />{" "}
        </div>

        <div className="flex flex-col mt-4 space-y-2">
          <div className="flex justify-end items-end w-full">
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
          <button className="text-slate-950 text-bold h-12 w-32 border-slate-300 border p-2 bg-gradient-to-r from-red-950 to-red-900 rounded-t-xl">
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sell;
