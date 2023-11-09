import React, { useState } from "react";
import Infobox from "../utils/Infobox";

const SelectFlashbot = () => {
  const [isFlashbotTx, setIsFlashbotTx] = useState(false);
  const [isBribeDisabled, setIsBribeDisabled] = useState(true);

  const handleCheckboxChange = (event) => {
    setIsFlashbotTx(event.target.checked);
    setIsBribeDisabled(!event.target.checked);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center font-semibold text-center text-slate-950 text-lg">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={!isBribeDisabled}
            onChange={handleCheckboxChange}
            className="toggle accent-black stroke-black ring-offset-black caret-black fill-slate-500"
          />
          <span className="ml-8 text-blue-950 font-semibold">
            Use a Flashbot Transaction
          </span>
        </label>
        <Infobox title="Method Snipe">
          Using a flashbot transaction can lead to faster inclusion in a block
          if the validator accepts the bid. However, it also may incur higher
          fees due to competitive bidding{" "}
        </Infobox>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-slate-400 text-md mr-6">
          Set the bribe to use
        </span>
        <input
          type="number"
          className={`input w-32 h-8 text-slate-300 text-end border-purple-950 border-2 bg-slate-950 rounded-none rounded-tl-xl ${
            isBribeDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
};
export default SelectFlashbot;
