import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page isn’t here.</h1>
      <p>Head back to the overview to explore my work.</p>
      <Link href="/" className="button button-primary">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
