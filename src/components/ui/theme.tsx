"use client";

import { useId, useSyncExternalStore } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Monitor } from "lucide-react";

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
  const id = useId();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-control js-required">
      <Monitor size={15} aria-hidden="true" />
      <label className="sr-only" htmlFor={id}>
        Color theme
      </label>
      <select
        id={id}
        aria-label="Color theme"
        value={mounted ? theme : "system"}
        disabled={!mounted}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
