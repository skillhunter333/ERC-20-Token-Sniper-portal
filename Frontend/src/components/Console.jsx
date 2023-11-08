import { useRef, useEffect } from "react";

const Console = ({ children }) => {
  const messagesEndRef = useRef(null);

  // UseEffect to scroll to the bottom every time the children change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <div className="h-96 border-t-4 border-purple-950 console bg-black text-green-400  text-lg p-4 rounded-lg shadow-md overflow-auto relative">
      <div className="console-content">
        {children}
        {/* Invisible element to mark where to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      <input className="hidden" type="text" />
      <span className="cursor">|</span>
    </div>
  );
};

export default Console;
