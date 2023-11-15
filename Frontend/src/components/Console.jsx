import React, { useRef, useEffect, useState } from "react";
import "../Console.css"; // Make sure to include your CSS file

const Console = ({ children }) => {
  const endOfMessagesRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandHistory]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setCommandHistory([...commandHistory, `> ${inputValue}`]);
      setInputValue("");
    }
  };

  return (
    <div className="console-container h-96 border-[24px]  border-purple-950 bg-black text-green-400 text-lg p-4 rounded-b-lg shadow-md overflow-auto">
      <div className="console-content">
        {children}
        {commandHistory.map((cmd, index) => (
          <div
            key={index}
            className="console-message font-CourierPrime-Regular text-sm pt-2"
          >
            {cmd}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="console-input-container flex items-center">
        <span className="console-prompt text-green-400 mr-2">></span>
        <input
          className="console-input bg-black text-green-400 flex-grow border-none outline-none"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
        />
      </div>
    </div>
  );
};

export default Console;
