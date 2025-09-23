import React, { useState, useEffect } from "react";

export const TypingResult: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset on text change
    if (!text) return;
    
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i += 1;
      if (i >= text.length) {
        clearInterval(intervalId);
      }
    }, 30); // Adjust speed here (lower is faster)

    return () => clearInterval(intervalId);
  }, [text]);

  return <p className={className}>{displayedText}</p>;
};
