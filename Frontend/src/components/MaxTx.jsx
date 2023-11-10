import React, { useState } from "react";
import Infobox from "../utils/Infobox";

const MaxTx = () => {
  const [isMaxTxEnabled, setIsMaxTxEnabled] = useState(false);
  const [maxTxValue, setMaxTxValue] = useState(1);

  const handleCheckboxChange = (event) => {
    setIsMaxTxEnabled(!event.target.checked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex  items-center font-semibold text-center text-slate-950 text-lg">
        <label className=" inline-flex bg-slate-900 h-6 rounded-l-3xl items-center">
          <input
            type="checkbox"
            checked={!isMaxTxEnabled}
            onChange={handleCheckboxChange}
            className="toggle accent-black  fill-slate-500"
          />

          <span
            className={`${
              isMaxTxEnabled ? "text-purple-700" : "text-pink-700"
            } font-bold bg-slate-900 h-6 mx-4 w-48 rounded-xl hover:underline`}
          >
            MaxTx
          </span>
        </label>
        <div className="">
          <Infobox title="MaxTx">
            Some token only allow a certain amount per tx. To avoid failing
            transactions, set the max tx amount to the maximum tokens allowed
            per tx.
          </Infobox>
        </div>
      </div>
      <div className=" flex justify-end items-center mt-4">
        <span className="text-slate-400 text-md mr-2">MaxAmountOut</span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            isMaxTxEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onChange={(e) => setMaxTxValue(e.target.value)}
        />
      </div>
    </div>
  );
};
export default MaxTx;
