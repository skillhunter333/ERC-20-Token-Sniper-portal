import React, { useState } from "react";
import Infobox from "../utils/Infobox";

const Customgas = () => {
  const [isCustomGasEnabled, setIsCustomGasEnabled] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsCustomGasEnabled(!event.target.checked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex  items-center font-semibold text-center text-slate-950 text-lg">
        <label className=" inline-flex bg-slate-900 h-6 rounded-l-3xl items-center">
          <input
            type="checkbox"
            checked={!isCustomGasEnabled}
            onChange={handleCheckboxChange}
            className="toggle accent-black  fill-slate-500"
          />

          <span
            className={`${
              isCustomGasEnabled ? "text-purple-700" : "text-pink-700"
            } font-bold bg-slate-900 h-6 mx-4 w-48 rounded-xl hover:underline`}
          >
            Custom Gas
          </span>
        </label>
        <div className="">
          <Infobox title="Custom Gas">
            Using custom gas uses a fixed gas price of the specified amount in
            gwei and a specified gas limit. Make sure to select high options to
            ensure the transaction is successful, while keeping the resultung
            gas fee and a sufficient wallet balance in mind.
          </Infobox>
        </div>
      </div>
      <div className=" flex justify-end items-center mt-4">
        <span className="text-slate-400 text-md mr-8 pl-2 ">Gas</span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end mr-4 border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            isCustomGasEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <span className="text-slate-400 text-md mr-2">Gaslimit</span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            isCustomGasEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default Customgas;
