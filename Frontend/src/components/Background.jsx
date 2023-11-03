import { motion } from "framer-motion";

const Background = () => {
  const numRows = 150;
  const numCols = 100;

  const colors = [
    "#7dd3fc",
    "#f9a8d4",
    "#86efac",
    "#fde047",
    "#fca5a5",
    "#d8b4fe",
    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className=" bg-slate-900 fixed h-full w-full z-[-1]">
      <div
        style={{
          transform: `translate(-40%, -60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        }}
        className="bg-slate-900 absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-[-1]"
      >
        {Array.from({ length: numRows }).map((_, i) => (
          <motion.div
            key={`row-${i}`}
            className=" w-16 h-8 border-l border-slate-700 relative"
          >
            {Array.from({ length: numCols }).map((_, j) => (
              <motion.div
                whileHover={{
                  backgroundColor: `${getRandomColor()}`,
                  transition: { duration: 0 },
                }}
                animate={{
                  transition: { duration: 2 },
                }}
                key={`col-${j}`}
                className="w-16 h-8 border-r border-t border-slate-700 relative"
              >
                {j % 2 === 0 && i % 2 === 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                )}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Background;
