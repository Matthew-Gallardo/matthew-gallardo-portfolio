import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Section({
  id,
  number,
  title,
  intro,
  action,
  children,
}: {
  id: string;
  number: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-heading`}>
      <div className="section-heading">
        <h2 id={`${id}-heading`} tabIndex={-1}>
          <span className="section-number" aria-hidden="true">
            {number}
          </span>
          {title}
        </h2>
        {action && (
          <Link className="text-link section-action" href={action.href}>
            {action.label}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
      {intro && <p className="section-intro">{intro}</p>}
      {children}
    </section>
  );
}
