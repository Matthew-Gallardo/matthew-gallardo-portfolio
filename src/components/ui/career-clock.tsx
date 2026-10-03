"use client";

import { useState, useSyncExternalStore } from "react";
import { BriefcaseBusiness, Coffee, Pause, Play } from "lucide-react";
import { career } from "@/content/career";
import { careerDuration } from "@/lib/career-time";

let currentTime: number | null = null;
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | undefined;
function tick() {
  currentTime = Date.now();
  listeners.forEach((listener) => listener());
}
function schedule() {
  clearInterval(interval);
  interval = undefined;
  if (!document.hidden) {
    tick();
    interval = setInterval(tick, 1000);
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", schedule);
    schedule();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(interval);
      interval = undefined;
      document.removeEventListener("visibilitychange", schedule);
    }
  };
}
const getSnapshot = () => currentTime;
const getServerSnapshot = () => null;
const start = Date.parse(career.start);
const units = [
  "years",
  "months",
  "days",
  "hours",
  "minutes",
  "seconds",
] as const;

export function CareerClock() {
  const liveTime = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const now = pausedAt ?? liveTime;
  const duration = now === null ? null : careerDuration(start, now);
  return (
    <div
      className="career-clock"
      role="group"
      aria-labelledby="career-clock-title"
    >
      <div className="career-clock-header">
        <span id="career-clock-title">
          <BriefcaseBusiness size={15} aria-hidden="true" />
          Working for
        </span>
        <button
          type="button"
          className="career-pause js-required"
          disabled={liveTime === null}
          onClick={() => setPausedAt(pausedAt === null ? Date.now() : null)}
          aria-label={
            pausedAt === null ? "Pause career timer" : "Resume career timer"
          }
        >
          {pausedAt === null ? (
            <Pause size={12} aria-hidden="true" />
          ) : (
            <Play size={12} aria-hidden="true" />
          )}
          {pausedAt === null ? "Pause" : "Resume"}
        </button>
      </div>
      <div
        className="career-digits"
        role="timer"
        aria-label="Elapsed career time"
        aria-live="off"
      >
        {units.map((unit) => (
          <div key={unit}>
            <span className="career-value" data-unit={unit}>
              {duration ? String(duration[unit]).padStart(2, "0") : "—"}
            </span>
            <span className="career-unit">{unit}</span>
          </div>
        ))}
      </div>
      <p className="career-since">
        Since <time dateTime="2024-09-02">{career.startLabel}</time>
        <span aria-hidden="true"> · </span>Still compiling.
      </p>
      <div className="career-retirement">
        <Coffee size={15} aria-hidden="true" />
        <p>
          Retirement? <span>{career.retirementMessage}</span>
        </p>
      </div>
    </div>
  );
}
