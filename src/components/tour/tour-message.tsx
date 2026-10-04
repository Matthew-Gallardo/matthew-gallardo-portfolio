"use client";

import { useEffect, useRef, useState } from "react";
import {
  TOUR_CHARACTER_TIME,
  TOUR_READING_TIME,
  TOUR_REDUCED_READING_TIME,
} from "@/content/tour";

type TourMessageProps = {
  text: string;
  ready: boolean;
  paused: boolean;
  reduced: boolean;
  onComplete: () => void;
};

export function TourMessage({
  text,
  ready,
  paused,
  reduced,
  onComplete,
}: TourMessageProps) {
  const [count, setCount] = useState(() => (reduced ? text.length : 0));
  const typingElapsed = useRef(0);
  const reading = useRef({
    reduced,
    remaining: reduced ? TOUR_REDUCED_READING_TIME : TOUR_READING_TIME,
  });
  const complete = reduced || count === text.length;
  const phase = !ready ? "moving" : complete ? "reading" : "typing";

  useEffect(() => {
    // Once reduced motion reveals a message, never type it again if the
    // preference changes back during the same stop.
    if (reduced) {
      const frame = requestAnimationFrame(() => setCount(text.length));
      return () => cancelAnimationFrame(frame);
    }
    if (!ready || paused || complete) return;
    const started = performance.now();
    const update = () => {
      const elapsed = typingElapsed.current + performance.now() - started;
      setCount(Math.min(text.length, Math.floor(elapsed / TOUR_CHARACTER_TIME)));
    };
    const interval = setInterval(update, TOUR_CHARACTER_TIME);
    return () => {
      clearInterval(interval);
      typingElapsed.current += performance.now() - started;
    };
  }, [ready, paused, reduced, complete, text.length]);

  useEffect(() => {
    if (reading.current.reduced !== reduced) {
      reading.current = {
        reduced,
        remaining: reduced ? TOUR_REDUCED_READING_TIME : TOUR_READING_TIME,
      };
    }
    if (!ready || !complete || paused) return;
    const budget = reading.current;
    const started = performance.now();
    // This begins after the completed text has committed to the screen.
    const timeout = setTimeout(onComplete, budget.remaining);
    return () => {
      clearTimeout(timeout);
      budget.remaining = Math.max(
        0,
        budget.remaining - (performance.now() - started),
      );
    };
  }, [ready, complete, paused, reduced, onComplete]);

  return (
    <>
      <div
        className="tour-message"
        aria-hidden="true"
        data-tour-phase={phase}
        data-tour-paused={paused}
      >
        <span className="tour-message-reserve">{text}</span>
        <span className="tour-message-typed">
          {ready ? (complete ? text : text.slice(0, count)) : ""}
          {phase === "typing" && <span className="tour-caret" />}
        </span>
      </div>
      <p
        id="matt-tour-description"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {ready ? text : ""}
      </p>
    </>
  );
}
