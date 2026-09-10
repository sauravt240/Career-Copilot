import { useState, useEffect } from "react";

export function useTypewriter(
  text: string,
  speed: number = 32,
  startDelay: number = 300
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    let currentIndex = 0;
    let timer: any = null;

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(timer);
          setIsComplete(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, startDelay]);

  return { displayedText, isComplete };
}
