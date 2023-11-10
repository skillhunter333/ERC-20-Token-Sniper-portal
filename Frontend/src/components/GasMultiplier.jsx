import React, { useState } from "react";
import Infobox from "../utils/Infobox";

const GasMultiplier = () => {
  const [isGasMultiplierEnabled, setIsGasMultiplierEnabled] = useState(true);
  const [multiplierValue, setMultiplierValue] = useState(1);

  const handleCheckboxChange = (event) => {
    setIsGasMultiplierEnabled(!event.target.checked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex  items-center font-semibold text-center text-slate-950 text-lg">
        <label className=" inline-flex bg-slate-900 h-6 rounded-l-3xl items-center">
          <input
            type="checkbox"
            checked={!isGasMultiplierEnabled}
            onChange={handleCheckboxChange}
            className="toggle accent-black  fill-slate-500"
          />

          <span
            className={`${
              isGasMultiplierEnabled ? "text-purple-700" : "text-pink-700"
            } font-bold bg-slate-900 h-6 mx-4 w-48 rounded-xl hover:underline`}
          >
            Gas Multiplier
          </span>
        </label>
        <div className="">
          <Infobox title="Gas multiplier">
            Pay a higher gas price than the estimated gas price to ensure the tx
            succeeding as fast as possible. Insert 1.5 to pay 50% more gas than
            estimated.
          </Infobox>
        </div>
      </div>
      <div className=" flex justify-end items-center mt-2">
        <span className="text-slate-400 text-md mr-2">Gas</span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            isGasMultiplierEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onChange={(e) => setMultiplierValue(e.target.value)}
        />
      </div>
    </div>
  );
};
export default GasMultiplier;
