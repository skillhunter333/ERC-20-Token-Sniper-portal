import { useRef, useEffect } from "react";

const Console = ({ children }) => {
  const messagesEndRef = useRef(null);

  // UseEffect to scroll to the bottom every time the children change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <div className="h-96 console bg-black text-green-400  text-lg p-4 rounded-lg shadow-md overflow-auto relative">
      <div className="console-content">
        {children}
        {/* Invisible element to mark where to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      <span className="cursor">|</span>
    </div>
  );
};

export default Console;
