import React, { useState } from "react";
import Infobox from "../utils/Infobox";

const GasMultiplier = ({ setMultiplierValue, isEnabled, setIsEnabled }) => {
  const handleToggle = (e) => {
    setIsEnabled(e.target.checked);
    if (!e.target.checked) {
      setMultiplierValue(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex  items-center font-semibold text-center text-slate-950 text-lg">
        <label className=" inline-flex bg-slate-900 h-6 rounded-l-3xl items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            className="toggle accent-black  fill-slate-500"
          />

          <span
            className={`${
              !isEnabled ? "text-purple-700" : "text-pink-700"
            } font-bold bg-slate-900 h-6 mx-4 w-48 rounded-xl hover:underline`}
          >
            Gas Boost
          </span>
        </label>
        <div className="">
          <Infobox title="Gas multiplier">
            Pay a higher gas price than the estimated gas price to ensure the tx
            succeeding as fast as possible. Insert 1.5 to pay 50% more gas than
            estimated. Especially in times of high network traffic and at
            crowded launches it is crucial to pay enough gas for the tx to
            succeed. Please adjust appropriately.
          </Infobox>
        </div>
      </div>
      <div className=" flex justify-end items-center mt-2">
        <span
          className={`${
            !isEnabled ? "opacity-50 cursor-not-allowed" : ""
          }text-slate-400 text-md mr-2 pl-2 `}
        >
          multiplicator
        </span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            !isEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onChange={(e) => setMultiplierValue(e.target.value)}
          value={isEnabled ? 1.3 : ""}
        />
      </div>
    </div>
  );
};
export default GasMultiplier;
