"use client";

import { useEffect, useRef } from "react";
import { animate, inView } from "motion";
import { useReducedMotion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let played = false;
    let animation: ReturnType<typeof animate> | undefined;
    const stop = inView(element, () => {
      if (played) return;
      played = true;
      animation = animate(
        element,
        { opacity: [0.85, 1], y: [8, 0] },
        { duration: 0.24, delay, ease: [0.22, 1, 0.36, 1] },
      );
    });
    return () => {
      stop();
      animation?.stop();
    };
  }, [delay, reduced]);
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
