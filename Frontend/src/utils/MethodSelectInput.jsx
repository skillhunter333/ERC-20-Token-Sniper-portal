import React, { useState } from "react";

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
    <div>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={!isDropdownDisabled}
          onChange={handleCheckboxChange}
        />
        <span className="ml-2">Enable Dropdown</span>
      </label>
      <label>
        Methods
        <select
          value={method}
          disabled={isDropdownDisabled}
          onChange={handleSelectChange}
          className={`border border-purple-950 bg-slate-950 text-white p-2 rounded-md ${
            isDropdownDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="enableTrading()">enableTrading()</option>
          <option value="startTrading()">startTrading()</option>
          <option value="activateTrading()">activateTrading()</option>
          <option value="custom">Custom...</option>
        </select>
      </label>
      {isCustomMethod && (
        <input
          type="text"
          placeholder="Enter custom method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          autoFocus
        />
      )}
    </div>
  );
}

export default CustomSelectInput;
