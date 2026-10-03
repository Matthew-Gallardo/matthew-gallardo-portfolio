"use client";

import { useSyncExternalStore } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

const subscribe = () => () => {};
export function ThemeRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="mg-portfolio-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export function ThemeControl() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { theme, resolvedTheme, setTheme } = useTheme();
  const dark = mounted && resolvedTheme === "dark";
  const system = !mounted || theme === "system";
  return (
    <div
      className="theme-control js-required"
      role="group"
      aria-label="Color theme"
    >
      <button
        className="theme-switch"
        type="button"
        role="switch"
        aria-label="Dark mode"
        aria-checked={dark}
        disabled={!mounted}
        onClick={() => setTheme(dark ? "light" : "dark")}
      >
        <span className="theme-track" aria-hidden="true">
          <Sun className="theme-sun" size={14} />
          <Moon className="theme-moon" size={14} />
          <span className="theme-thumb" />
        </span>
      </button>
      <button
        className="theme-system"
        type="button"
        aria-label="Auto (use system theme)"
        aria-pressed={system}
        disabled={!mounted}
        onClick={() => setTheme("system")}
      >
        <Monitor size={13} aria-hidden="true" />
        Auto
      </button>
    </div>
  );
}
