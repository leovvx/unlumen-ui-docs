"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface ScrambleTextProps {
  text: string;
  /** @default 50 */
  scrambleSpeed?: number;
  /** scrambled chars shown ahead of the revealed text — @default 2 */
  scrambledLetterCount?: number;
  characters?: string;
  className?: string;
  /** class for the scrambled (unrevealed) portion */
  scrambledClassName?: string;
  /** @default true */
  autoStart?: boolean;
  delay?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

export interface ScrambleTextHandle {
  start: () => void;
  reset: () => void;
}

const ScrambleText = forwardRef<ScrambleTextHandle, ScrambleTextProps>(
  (
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
      className = "",
      scrambledClassName = "",
      autoStart = true,
      delay = 0,
      onStart,
      onComplete,
    },
    ref,
  ) => {
    const [displayText, setDisplayText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [visibleLetterCount, setVisibleLetterCount] = useState(0);
    const [scrambleOffset, setScrambleOffset] = useState(0);

    const startAnimation = useCallback(() => {
      setIsAnimating(true);
      setVisibleLetterCount(0);
      setScrambleOffset(0);
      onStart?.();
    }, [onStart]);

    const reset = useCallback(() => {
      setIsAnimating(false);
      setVisibleLetterCount(0);
      setScrambleOffset(0);
      setDisplayText("");
    }, []);

    useImperativeHandle(ref, () => ({
      start: startAnimation,
      reset,
    }));

    useEffect(() => {
      if (!autoStart) return;
      if (delay > 0) {
        const t = setTimeout(startAnimation, delay);
        return () => clearTimeout(t);
      }
      startAnimation();
    }, [autoStart, delay, startAnimation]);

    useEffect(() => {
      let interval: NodeJS.Timeout;

      if (isAnimating) {
        interval = setInterval(() => {
          if (visibleLetterCount < text.length) {
            setVisibleLetterCount((prev) => prev + 1);
          } else if (scrambleOffset < scrambledLetterCount) {
            setScrambleOffset((prev) => prev + 1);
          } else {
            clearInterval(interval);
            setIsAnimating(false);
            onComplete?.();
          }

          const remainingSpace = Math.max(0, text.length - visibleLetterCount);
          const currentScrambleCount = Math.min(
            remainingSpace,
            scrambledLetterCount,
          );

          const scrambledPart = Array(currentScrambleCount)
            .fill(0)
            .map(
              () => characters[Math.floor(Math.random() * characters.length)],
            )
            .join("");

          setDisplayText(text.slice(0, visibleLetterCount) + scrambledPart);
        }, scrambleSpeed);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [
      isAnimating,
      text,
      visibleLetterCount,
      scrambleOffset,
      scrambledLetterCount,
      characters,
      scrambleSpeed,
      onComplete,
    ]);

    const renderText = () => {
      const revealed = displayText.slice(0, visibleLetterCount);
      const scrambled = displayText.slice(visibleLetterCount);

      return (
        <>
          <span className={className}>{revealed}</span>
          <span className={scrambledClassName}>{scrambled}</span>
        </>
      );
    };

    return (
      <>
        <span className="sr-only">{text}</span>
        <span className="inline-block whitespace-pre-wrap" aria-hidden="true">
          {renderText()}
        </span>
      </>
    );
  },
);

ScrambleText.displayName = "ScrambleText";

export { ScrambleText };
export default ScrambleText;
