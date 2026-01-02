import Link from "next/link";

export default function IntegrationRequestCard({
  href = "/integrations/new",
  title = "Request Integrations",
  subtitle = "Tell us which tool you want to connect next — we use this to shape our roadmap",
}: {
  href?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <Link href={href} className="integration-request-card index-card">
      <div className="ir-inner">
        <div className="ir-plus" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h4 className="ir-title">{title}</h4>
        <p className="ir-subtitle">{subtitle}</p>
      </div>
    </Link>
  );
}
