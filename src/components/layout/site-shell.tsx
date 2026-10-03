import Link from "next/link";
import { ArrowUpRight, ArrowUp, Download, Mail } from "lucide-react";
import { navigation } from "@/content/site";
import { profile } from "@/content/profile";
import { ThemeControl } from "@/components/ui/theme";
import { MobileNavigation } from "./mobile-navigation";
import { HomeTour } from "@/components/tour/home-tour";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link href="/" className="identity" aria-label="Matthew Gallardo home">
          <span className="monogram">
            MG<span>.</span>
          </span>
          <span className="identity-name">
            Matthew
            <br />
            Gallardo
          </span>
        </Link>
        <div className="sidebar-description">
          Backend software engineer
          <br />
          <span>Quezon City, Philippines</span>
        </div>
        <nav aria-label="Main navigation">
          <ol className="sidebar-links">
            {navigation.map((item) => (
              <li key={item.id}>
                <Link href={`/#${item.id}`}>
                  <span className="nav-number">{item.number}</span>
                  {item.label}
                  <span className="nav-dash" aria-hidden="true">
                    —
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="sidebar-bottom">
          <a
            href={profile.resume}
            download="Matthew-Gallardo-Resume-2026.pdf"
            className="sidebar-resume"
          >
            <Download size={15} aria-hidden="true" />
            Download resume
          </a>
          <div className="sidebar-socials">
            <a href={profile.github}>
              GitHub
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a href={profile.linkedin}>
              LinkedIn
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <div className="sidebar-utility">
            <ThemeControl />
            <a
              className="icon-button"
              href={`mailto:${profile.email}`}
              aria-label="Email Matthew"
            >
              <Mail size={17} />
            </a>
          </div>
          <p className="sidebar-note">
            Built with care.
            <br />
            Always learning.
          </p>
        </div>
      </aside>
      <header className="mobile-header">
        <Link href="/" className="mobile-brand">
          <span className="mono">
            MG<span className="accent">.</span>
          </span>
          <span>Matthew Gallardo</span>
        </Link>
        <MobileNavigation />
      </header>
      <noscript>
        <style>{`.js-required { display: none !important; }`}</style>
        <nav className="fallback-navigation" aria-label="Section navigation">
          {navigation.map((item) => (
            <a href={`/#${item.id}`} key={item.id}>
              {item.label}
            </a>
          ))}
        </nav>
      </noscript>
      <div className="page-shell">
        <main id="main-content" tabIndex={-1} className="content-column">
          {children}
        </main>
        <footer className="site-footer content-column">
          <div>
            <span className="mono">
              MG<span className="accent">.</span>
            </span>
            <p>© {new Date().getFullYear()} Matthew Gallardo</p>
          </div>
          <div className="footer-links">
            <HomeTour />
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a
              href="#main-content"
              className="icon-button"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
