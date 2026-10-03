"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X, Download } from "lucide-react";
import { navigation } from "@/content/site";
import { profile } from "@/content/profile";
import { ThemeControl } from "@/components/ui/theme";

export function MobileNavigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const destination = useRef<string | null>(null);
  const pathname = usePathname();

  function openMenu() {
    dialog.current?.showModal();
  }
  function finishClose() {
    const id = destination.current;
    if (id) {
      const heading = document.getElementById(`${id}-heading`);
      if (heading) {
        destination.current = null;
        document.getElementById(id)?.scrollIntoView();
        heading.focus({ preventScroll: true });
      }
    } else trigger.current?.focus();
  }
  useEffect(() => {
    if (pathname !== "/" || !destination.current) return;
    const id = destination.current;
    const heading = document.getElementById(`${id}-heading`);
    if (heading) {
      destination.current = null;
      document.getElementById(id)?.scrollIntoView();
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => {
      if (media.matches && dialog.current?.open) dialog.current.close();
    };
    media.addEventListener("change", handleResize);
    return () => media.removeEventListener("change", handleResize);
  }, []);

  return (
    <>
      <button
        className="icon-button js-required"
        ref={trigger}
        onClick={openMenu}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        data-tour-cancel="true"
      >
        <Menu size={22} />
      </button>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-dialog"
        aria-labelledby="navigation-title"
        onClose={finishClose}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled]), select:not([disabled])",
            ),
          ).filter((element) => element.getClientRects().length > 0);
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-content">
          <div className="dialog-header">
            <span id="navigation-title" className="mono">
              Navigation
            </span>
            <button
              className="icon-button"
              onClick={() => dialog.current?.close()}
              aria-label="Close navigation"
              autoFocus
            >
              <X size={22} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            <ol className="mobile-links">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    onClick={(event) => {
                      destination.current = item.id;
                      if (pathname === "/") {
                        event.preventDefault();
                        history.pushState(null, "", `/#${item.id}`);
                      }
                      dialog.current?.close();
                    }}
                  >
                    <span className="nav-number">{item.number}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="dialog-bottom">
            <a
              className="button button-secondary"
              href={profile.resume}
              download="Matthew-Gallardo-Resume-2026.pdf"
            >
              <Download size={16} aria-hidden="true" />
              Download resume
            </a>
            <ThemeControl />
          </div>
        </div>
      </dialog>
    </>
  );
}
