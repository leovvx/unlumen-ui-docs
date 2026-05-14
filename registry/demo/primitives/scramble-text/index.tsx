"use client";

import { useEffect, useRef, useState } from "react";

import {
  ScrambleText,
  ScrambleTextHandle,
} from "@/registry/primitives/scramble-text";

const CHAOS_VERBS = [
  "Asking the rubber duck",
  "Flipping the table",
  "Yelling into the void",
  "Performing dark rituals",
  "Sacrificing a semicolon",
  "Consulting the Magic 8-Ball",
  "Rolling for initiative",
  "Blaming cosmic rays",
  "Summoning Cthulhu",
  "Dividing by zero",
  "Feeding the chaos monkey",
  "Releasing the kraken",
  "Rearranging deck chairs on the Titanic",
  "Poking the bear",
  "Opening Pandora's box",
  "Unplugging and plugging back in",
  "Smashing the keyboard",
  "Consulting the ouija board",
  "Generating random numbers by rolling dice",
  "Letting the intrusive thoughts win",
  "Stack-overflowing the stack overflow",
  "Applying percussive maintenance",
  "Crossing the streams",
  "Playing Russian roulette with git force push",
  "Turning the chaos up to eleven",
  "Invoking Murphy's Law",
  "Ignoring all the red flags",
  "Vibing with the segfault",
  "Tempting fate",
  "Gazing upon forbidden knowledge",
  "Questioning all life choices",
  "Embracing the entropy",
  "Hitting random buttons",
  "Trusting the process (blindly)",
  "Entering the danger zone",
];

export function ScrambleTextDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);
  const ref = useRef<ScrambleTextHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CHAOS_VERBS.length);
      setKey((k) => k + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <p className="text-xl font-mono  tracking-tight">
          <ScrambleText
            key={key}
            ref={ref}
            text={CHAOS_VERBS[currentIndex]}
            scrambledClassName="text-[#E07947]"
            scrambleSpeed={30}
          />
        </p>
      </div>
    </div>
  );
}
