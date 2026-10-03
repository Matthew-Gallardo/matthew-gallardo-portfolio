"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { RotateCcw, MousePointer2, X } from "lucide-react";
import { TOUR_STORAGE_KEY } from "@/content/tour";
import type { TourControllerProps } from "./tour-controller";

type Invitation = "invite" | "replay" | "hidden";
let memory: Invitation | undefined;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const serverSnapshot = (): Invitation => "hidden";
function snapshot(): Invitation {
  if (memory === undefined) {
    try {
      const saved = localStorage.getItem(TOUR_STORAGE_KEY);
      memory = saved === "replay" || saved === "hidden" ? saved : "invite";
    } catch {
      memory = "invite";
    }
    if (window.location.hash) memory = "hidden";
  }
  return memory;
}
function remember(value: Invitation) {
  memory = value;
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, value);
  } catch {
    /* Session memory still works. */
  }
  listeners.forEach((listener) => listener());
}

function TourControls() {
  const invitation = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [Controller, setController] =
    useState<ComponentType<TourControllerProps> | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const footer = useRef<HTMLButtonElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const mounted = useRef(true);
  // Ignore a chunk arriving after the visitor leaves the homepage.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function start(element: HTMLButtonElement) {
    trigger.current = element;
    setLoading(true);
    setError("");
    try {
      const controllerModule = await import("./tour-controller");
      if (!mounted.current) return;
      setController(() => controllerModule.default);
      setActive(true);
    } catch {
      if (mounted.current)
        setError("The tour could not load. Please try again.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }
  const finish = useCallback((restoreFocus = true) => {
    setActive(false);
    remember("replay");
    if (restoreFocus)
      requestAnimationFrame(() => {
        const original = trigger.current;
        const rect = original?.getBoundingClientRect();
        const visible =
          original?.isConnected &&
          rect &&
          rect.top >= 0 &&
          rect.bottom <= innerHeight;
        (visible ? original : (launcher.current ?? footer.current))?.focus({
          preventScroll: true,
        });
      });
  }, []);
  return (
    <>
      <button
        ref={footer}
        className="footer-tour js-required"
        type="button"
        disabled={loading || active}
        onClick={(event) => start(event.currentTarget)}
      >
        <MousePointer2 size={14} aria-hidden="true" />
        {loading ? "Loading tour…" : "Take a tour"}
      </button>
      {error && (
        <span role="status" className="tour-load-error">
          {error}
        </span>
      )}
      {!active &&
        invitation !== "hidden" &&
        createPortal(
          <div className="tour-invitation" data-tour-ui="true">
            <button
              ref={launcher}
              type="button"
              disabled={loading}
              onClick={(event) => start(event.currentTarget)}
            >
              {invitation === "replay" ? (
                <RotateCcw size={14} aria-hidden="true" />
              ) : (
                <MousePointer2 size={14} aria-hidden="true" />
              )}
              {loading
                ? "Loading tour…"
                : invitation === "replay"
                  ? "Take the tour again"
                  : "Take a tour with Matt"}
            </button>
            <button
              className="tour-dismiss"
              aria-label="Dismiss tour invitation"
              onClick={() => remember("hidden")}
            >
              <X size={14} />
            </button>
            {error && (
              <span role="status" className="tour-invitation-error">
                {error}
              </span>
            )}
          </div>,
          document.body,
        )}
      {active && Controller && <Controller onEnd={finish} />}
    </>
  );
}

export function HomeTour() {
  return usePathname() === "/" ? <TourControls /> : null;
}
