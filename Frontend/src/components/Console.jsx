import { useRef, useEffect } from "react";

const Console = ({ children }) => {
  const messagesEndRef = useRef(null);

  // UseEffect to scroll to the bottom every time the children change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <div className="console bg-black text-green-400 font-mono text-sm p-4 rounded-lg shadow-md overflow-auto relative">
      <div className="console-content">
        Test Msg
        {children}
        {/* Invisible element to mark where to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      <span className="cursor">|</span>
    </div>
  );
};

export default Console;
