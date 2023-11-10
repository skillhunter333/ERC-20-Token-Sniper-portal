import React, { useState } from "react";
import Infobox from "./Infobox";

function CustomSelectInput() {
  const [method, setMethod] = useState("");
  const [isCustomMethod, setIsCustomMethod] = useState(false);
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(true);

  const handleSelectChange = (event) => {
    if (event.target.value === "custom") {
      setIsCustomMethod(true);
      setMethod("");
    } else {
      setIsCustomMethod(false);
      setMethod(event.target.value);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsDropdownDisabled(!event.target.checked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-start font-semibold text-lg ">
        <label className="inline-flex bg-slate-900 h-6 rounded-l-3xl items-center mr-4">
          <input
            type="checkbox"
            checked={!isDropdownDisabled}
            onChange={handleCheckboxChange}
            className="toggle  fill-slate-500"
          />
          <span
            className={`${
              isDropdownDisabled ? "text-purple-700" : "text-pink-700"
            } ml-4 font-bold  h-8 px-16 rounded-xl hover:underline`}
          >
            method snipe
          </span>
        </label>

        <select
          value={method}
          disabled={isDropdownDisabled}
          onChange={handleSelectChange}
          className={`border border-purple-950 bg-slate-950 text-slate-300 p-2 h-6 rounded-md ${
            isDropdownDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="enableTrading()">enableTrading()</option>
          <option value="startTrading()">startTrading()</option>
          <option value="activateTrading()">activateTrading()</option>
          <option value="custom">Custom...</option>
        </select>
      </div>

      <Infobox title="Method Snipe">
        Used to circumnavigate anti-bot measures by sending the buy transaction
        upon the corresponding method call by the token smart contract instead
        of upon the Liquidity creation event on Uniswap.
      </Infobox>

      {isCustomMethod && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="-Enter custom method-"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            autoFocus
            className="input input-bordered text-center w-full h-8 text-slate-300 border-purple-950 border-2 bg-slate-950 rounded-none"
          />
        </div>
      )}
    </div>
  );
}

export default CustomSelectInput;
