"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate } from "motion";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MousePointer2,
  Pause,
  Play,
  X,
} from "lucide-react";
import { tourSteps, TOUR_READING_TIME } from "@/content/tour";

export type TourControllerProps = { onEnd: (restoreFocus?: boolean) => void };
type Position = {
  x: number;
  y: number;
  bubbleX: number;
  bubbleY: number;
  visible: boolean;
};
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), Math.max(minimum, maximum));

export default function TourController({ onEnd }: TourControllerProps) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState({ index: 0, ready: false });
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [position, setPosition] = useState<Position | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const programmaticScroll = useRef(false);
  const cancelMovement = useRef<() => void>(() => {});
  const focused = useRef(false);
  const reading = useRef({ index: -1, remaining: TOUR_READING_TIME });
  const current = tourSteps[step.index];
  const last = step.index === tourSteps.length - 1;

  useEffect(() => {
    if (position && !focused.current) {
      focused.current = true;
      panel.current?.focus({ preventScroll: true });
    }
  }, [position]);

  const advance = useCallback(
    (direction: number) => {
      for (
        let index = step.index + direction;
        index >= 0 && index < tourSteps.length;
        index += direction
      ) {
        if (document.getElementById(tourSteps[index].target)) {
          setStep({ index, ready: false });
          return;
        }
      }
      if (direction > 0) onEnd();
    },
    [step.index, onEnd],
  );

  // Position observers run only while the tour is mounted.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const target = document.getElementById(current.target);
      const bubble = panel.current;
      if (!target) {
        advance(1);
        return;
      }
      if (!bubble) return;
      const rect = target.getBoundingClientRect();
      const width = window.visualViewport?.width ?? innerWidth;
      const height = window.visualViewport?.height ?? innerHeight;
      const mobile = width < 768 || height < 600;
      const bubbleHeight = bubble.offsetHeight;
      const bubbleWidth = bubble.offsetWidth;
      const below = rect.bottom + 36;
      const next = {
        x: clamp(rect.left - 23, 8, width - 76),
        y: clamp(rect.top + 4, 8, height - 50),
        bubbleX: mobile
          ? (width - bubbleWidth) / 2
          : clamp(rect.left + 24, 16, width - bubbleWidth - 16),
        bubbleY: mobile
          ? height - bubbleHeight - 16
          : clamp(
              below + bubbleHeight <= height - 16
                ? below
                : rect.top - bubbleHeight - 28,
              16,
              height - bubbleHeight - 16,
            ),
        visible:
          rect.bottom > 64 &&
          rect.top < height - (mobile ? bubbleHeight + 36 : 0),
      };
      setPosition((previous) =>
        previous &&
        Object.keys(next).every(
          (key) =>
            previous[key as keyof Position] === next[key as keyof Position],
        )
          ? previous
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    const contentObserver = new MutationObserver(schedule);
    const main = document.getElementById("main-content");
    if (main) contentObserver.observe(main, { childList: true, subtree: true });
    if (panel.current) observer.observe(panel.current);
    const target = document.getElementById(current.target);
    if (target) observer.observe(target);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      contentObserver.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [current.target, advance]);

  useEffect(() => {
    let cancelled = false;
    let interrupted = false;
    let settle: ReturnType<typeof setTimeout> | undefined;
    let scrollAnimation: ReturnType<typeof animate> | undefined;
    const target = document.getElementById(current.target);
    cancelMovement.current = () => {
      interrupted = true;
      scrollAnimation?.stop();
      clearTimeout(settle);
      programmaticScroll.current = false;
      setStep((value) => (value.ready ? value : { ...value, ready: true }));
    };
    const frame = requestAnimationFrame(async () => {
      if (interrupted) return;
      if (!target) {
        advance(1);
        return;
      }
      target.setAttribute("data-tour-active", "true");
      const top = clamp(
        target.getBoundingClientRect().top +
          scrollY -
          (innerHeight < 600 ? (innerWidth >= 1024 ? 48 : 88) : 100),
        0,
        document.documentElement.scrollHeight - innerHeight,
      );
      programmaticScroll.current = true;
      if (reduced) window.scrollTo({ top, behavior: "instant" });
      else {
        scrollAnimation = animate(scrollY, top, {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (value) =>
            window.scrollTo({ top: value, behavior: "instant" }),
        });
        await scrollAnimation;
      }
      if (cancelled || interrupted) return;
      // Reading time begins after both scrolling and pointer travel settle.
      settle = setTimeout(
        () => {
          programmaticScroll.current = false;
          setStep((value) => ({ ...value, ready: true }));
        },
        reduced ? 0 : 420,
      );
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      scrollAnimation?.stop();
      programmaticScroll.current = false;
      target?.removeAttribute("data-tour-active");
      cancelMovement.current = () => {};
    };
  }, [current.target, reduced, advance]);

  useEffect(() => {
    if (reading.current.index !== step.index)
      reading.current = { index: step.index, remaining: TOUR_READING_TIME };
    if (paused || !step.ready || last) return;
    const budget = reading.current;
    const started = performance.now();
    const timeout = setTimeout(() => advance(1), budget.remaining);
    return () => {
      clearTimeout(timeout);
      budget.remaining = Math.max(
        0,
        budget.remaining - (performance.now() - started),
      );
    };
  }, [step.index, step.ready, paused, last, advance]);

  useEffect(() => {
    const inside = (target: EventTarget | null) =>
      target instanceof Element && target.closest("[data-tour-ui]");
    const interrupt = () => {
      setPaused(true);
      cancelMovement.current();
    };
    const pointer = (event: PointerEvent) => {
      if (inside(event.target)) return;
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest("a[href], [data-tour-cancel]")) onEnd(false);
      else interrupt();
    };
    const focus = (event: FocusEvent) => {
      if (!inside(event.target)) interrupt();
    };
    const scroll = () => {
      if (!programmaticScroll.current) interrupt();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEnd();
      } else if (
        ["PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp"].includes(
          event.key,
        )
      )
        interrupt();
    };
    const click = (event: MouseEvent) => {
      if (
        !inside(event.target) &&
        event.target instanceof Element &&
        event.target.closest("a[href], [data-tour-cancel]")
      )
        onEnd(false);
    };
    const visibility = () => {
      if (document.hidden) interrupt();
    };
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const changePreference = () => {
      if (preference.matches) interrupt();
    };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("click", click, true);
    document.addEventListener("focusin", focus);
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchmove", interrupt, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    preference.addEventListener("change", changePreference);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("click", click, true);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchmove", interrupt);
      window.removeEventListener("scroll", scroll);
      preference.removeEventListener("change", changePreference);
    };
  }, [onEnd]);

  return createPortal(
    <>
      <motion.div
        className="tour-pointer"
        aria-hidden="true"
        initial={false}
        animate={{
          x: position?.x ?? 0,
          y: position?.y ?? 0,
          opacity: position?.visible ? 1 : 0,
        }}
        transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <MousePointer2 size={24} fill="currentColor" strokeWidth={1.5} />
        <span>Matt</span>
      </motion.div>
      <div
        ref={panel}
        className="tour-bubble"
        role="dialog"
        aria-modal="false"
        aria-labelledby="matt-tour-title"
        aria-describedby="matt-tour-description"
        aria-busy={!step.ready}
        tabIndex={-1}
        data-tour-ui="true"
        data-tour-step={current.id}
        data-tour-ready={step.ready}
        style={{
          left: position?.bubbleX ?? 16,
          top: position?.bubbleY ?? 100,
          visibility: position ? "visible" : "hidden",
        }}
      >
        <div className="tour-bubble-heading">
          <div>
            <h2 id="matt-tour-title">
              Matt <span>your guide</span>
            </h2>
            <p className="tour-step-name">{current.title}</p>
          </div>
          <button
            className="tour-close"
            type="button"
            aria-label="Skip tour"
            onClick={() => onEnd()}
          >
            <X size={17} />
          </button>
        </div>
        <p
          id="matt-tour-description"
          className="tour-message"
          aria-live="polite"
          aria-atomic="true"
        >
          {current.explanation}
        </p>
        <div className="tour-progress">
          <span>
            {step.index + 1} of {tourSteps.length}
          </span>
          <span>
            {last ? "Your turn to explore" : paused ? "Paused" : "Auto tour"}
          </span>
        </div>
        <div className="tour-buttons">
          <button
            type="button"
            disabled={step.index === 0 || !step.ready}
            onClick={() => advance(-1)}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back
          </button>
          {!last && (
            <button
              type="button"
              aria-label={paused ? "Resume tour" : "Pause tour"}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? (
                <Play size={13} aria-hidden="true" />
              ) : (
                <Pause size={13} aria-hidden="true" />
              )}
              {paused ? "Resume" : "Pause"}
            </button>
          )}
          <button
            className="tour-next"
            type="button"
            disabled={!step.ready}
            onClick={() => (last ? onEnd() : advance(1))}
          >
            {last ? "Finish" : "Next"}
            {last ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <ArrowRight size={14} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
