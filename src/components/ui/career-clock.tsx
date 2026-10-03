"use client";

import { useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
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
const calendarUnits = [
  { name: "years", suffix: "y" },
  { name: "months", suffix: "m" },
  { name: "days", suffix: "d" },
] as const;
const clockUnits = ["hours", "minutes", "seconds"] as const;

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
    <div className="career-clock" role="group" aria-label="Career activity">
      <div
        className="career-timer"
        role="timer"
        aria-label="Elapsed career time"
        aria-live="off"
      >
        <div className="career-stat">
          <div className="career-value career-calendar">
            {calendarUnits.map(({ name, suffix }) => (
              <span key={name}>
                <span data-unit={name}>{duration ? duration[name] : "—"}</span>
                <span aria-hidden="true">{suffix}</span>
                <span className="sr-only"> {name} </span>
              </span>
            ))}
          </div>
          <span className="career-label">Working for</span>
        </div>
        <div className="career-stat">
          <div className="career-value career-time">
            {clockUnits.map((unit, index) => (
              <span key={unit}>
                {index > 0 && <span aria-hidden="true">:</span>}
                <span data-unit={unit}>
                  {duration ? String(duration[unit]).padStart(2, "0") : "—"}
                </span>
                <span className="sr-only"> {unit} </span>
              </span>
            ))}
          </div>
          <div className="career-label-row">
            <span className="career-label">
              {pausedAt === null ? "And counting" : "On pause"}
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
            </button>
          </div>
        </div>
      </div>
      <div className="career-stat career-retirement">
        <p className="career-value">{career.retirementMessage}</p>
        <span className="career-label">Retirement</span>
      </div>
    </div>
  );
}
