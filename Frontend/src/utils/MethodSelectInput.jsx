import React, { useState, useEffect } from "react";
import Infobox from "./Infobox";

function CustomSelectInput({ setCustomMethod, isEnabled, setIsEnabled }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [customMethod, setCustomMethodInput] = useState("");

  useEffect(() => {
    if (selectedMethod === "custom") {
      setCustomMethod(customMethod);
    } else {
      setCustomMethod(selectedMethod);
    }
  }, [selectedMethod, customMethod, setCustomMethod]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedMethod(value);
    if (value !== "custom") {
      setCustomMethodInput("");
    }
  };

  const handleCheckboxChange = (event) => {
    setIsEnabled(event.target.checked);
    if (!event.target.checked) {
      setSelectedMethod("");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Checkbox and Info */}
      <div className="flex items-center font-semibold text-lg">
        <label className="inline-flex bg-slate-900 h-6 rounded-l-3xl items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleCheckboxChange}
            className="toggle fill-slate-500"
          />
          <span
            className={`${
              isEnabled ? "text-pink-700" : "text-purple-700"
            } mx-4 w-48 font-bold h-8 px-8 rounded-xl hover:underline`}
          >
            method snipe
          </span>
        </label>
        <Infobox title="Method Snipe">
          Used to circumnavigate anti-bot measures by sending the buy
          transaction upon the corresponding method call by the token smart
          contract instead of upon the Liquidity creation event on Uniswap.
        </Infobox>
      </div>

      {/* Method Selection */}
      <div className="flex justify-end items-center mt-2">
        {/* Custom Method Input */}
        {selectedMethod === "custom" && (
          <input
            type="text"
            placeholder="-Enter custom method-"
            value={customMethod}
            onChange={(e) => setCustomMethodInput(e.target.value)}
            autoFocus
            className=" input  mt-2 input-bordered text-center w-full h-8 text-slate-300 border-purple-950 border-2 bg-slate-950 rounded-none"
          />
        )}
        <select
          value={selectedMethod}
          onChange={handleSelectChange}
          className={`input w-32 h-8  text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            !isEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="">Select Method...</option>
          <option value="enableTrading()">enableTrading()</option>
          <option value="startTrading()">startTrading()</option>
          <option value="activateTrading()">activateTrading()</option>
          <option value="custom">Custom...</option>
        </select>
      </div>
    </div>
  );
}

export default CustomSelectInput;
