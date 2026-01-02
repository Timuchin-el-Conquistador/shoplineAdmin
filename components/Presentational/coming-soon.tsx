import Link from "next/link";
import "@/styles/coming-soon.scss";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function ComingSoon({
  title = "Coming soon",
  subtitle = "We're working on this feature — check back soon.",
}: Props) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-card">
        <div className="cs-icon" aria-hidden>
          <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
            <path d="M20 38c2-6 8-10 12-10s10 4 12 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 18v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="cs-title">{title}</h1>
        <p className="cs-subtitle">{subtitle}</p>

        <div className="cs-actions">
          <Link href="/dashboard" className="btn btn-outline cs-action">Back to Dashboard</Link>
          <Link href="/integrations" className="btn btn-blue cs-action">Explore Integrations</Link>
        </div>
      </div>
    </div>
  );
}
