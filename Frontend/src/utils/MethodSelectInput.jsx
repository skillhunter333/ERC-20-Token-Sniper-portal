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
      <div className="flex justify-between items-center font-semibold text-center text-slate-950 text-lg">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={!isDropdownDisabled}
            onChange={handleCheckboxChange}
            className="toggle  fill-slate-500"
          />
          <span className="ml-8 text-blue-950">
            Use a method to snipe instead
          </span>
        </label>
        <Infobox title="Method Snipe">
          Used to circumnavigate anti-bot measures by sending the buy
          transaction upon the corresponding method call by the token smart
          contract instead of upon the Liquidity creation event on Uniswap.
        </Infobox>
      </div>

      <div className="flex justify-end mt-2">
        <select
          value={method}
          disabled={isDropdownDisabled}
          onChange={handleSelectChange}
          className={`border border-purple-950 bg-slate-950 text-slate-300 p-2 rounded-md ${
            isDropdownDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="enableTrading()">enableTrading()</option>
          <option value="startTrading()">startTrading()</option>
          <option value="activateTrading()">activateTrading()</option>
          <option value="custom">Custom...</option>
        </select>
      </div>

      {isCustomMethod && (
        <div className="flex justify-end mt-2">
          <input
            type="text"
            placeholder="-Enter custom method-"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            autoFocus
            className="input input-bordered text-center w-full h-8 text-slate-300 border-purple-950 border-2 bg-slate-950 rounded-none mt-1"
          />
        </div>
      )}
    </div>
  );
}

export default CustomSelectInput;
