import PrivateLayout from "@/components/layouts/private";
import { retrieveCrmData } from "@/lib/actions/crm";
import CrmTable from "@/app/crm/crm-table";

type VisitorRow = {
  _id?: string;
  id?: string;
  visitorId?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhoneNumber?: string;
  visitDate?: string;
  storeId?: string;
  aiInteractionCount?: number;
  aiInteractions: [];
};

type CrmPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getNumberParam(
  value: string | string[] | undefined,
  fallback: number
) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function CrmPage({ searchParams }: CrmPageProps) {
  const page = getNumberParam(searchParams?.page, 1);
  const limit = getNumberParam(searchParams?.limit, 10);
  const crmData = await retrieveCrmData({ page, limit });
  const visitors = Array.isArray(crmData)
    ? (crmData as VisitorRow[])
    : ((crmData as { visitors?: VisitorRow[]; data?: { visitors?: VisitorRow[] } } | null)?.visitors ??
      (crmData as { visitors?: VisitorRow[]; data?: { visitors?: VisitorRow[] } } | null)?.data?.visitors ??
      []);

  const total =
    (crmData as { total?: number; meta?: { total?: number }; pagination?: { total?: number } } | null)?.total ??
    (crmData as { total?: number; meta?: { total?: number }; pagination?: { total?: number } } | null)?.meta?.total ??
    (crmData as { total?: number; meta?: { total?: number }; pagination?: { total?: number } } | null)?.pagination
      ?.total ??
    visitors.length;

  const totalPages =
    (crmData as { totalPages?: number; meta?: { totalPages?: number }; pagination?: { totalPages?: number } } | null)
      ?.totalPages ??
    (crmData as { totalPages?: number; meta?: { totalPages?: number }; pagination?: { totalPages?: number } } | null)
      ?.meta?.totalPages ??
    (crmData as { totalPages?: number; meta?: { totalPages?: number }; pagination?: { totalPages?: number } } | null)
      ?.pagination?.totalPages ??
    (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1);

  return (
    <PrivateLayout page="crm" sidebar={true} notifications={true} pageTitle="CRM">
      <main className="px-6 pb-8">
        <div className="flex items-center justify-between pt-2 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Visitors</h1>
            <p className="text-sm text-gray-500">All CRM visitors</p>
          </div>
          {/*<div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition shadow-none">
              <svg width="20" height="20" fill="none" stroke="#3B82F6" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="none" />
                <path d="M4 4h16v16H4V4zm0 0l8 8 8-8" />
              </svg>
              Send email
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#6D8CFF] text-white font-medium shadow-none hover:bg-[#5276e9] transition">
              Actions
              <span className="inline-block text-xl align-middle">&#8230;</span>
            </button>
          </div>*/}
        </div>

        <CrmTable
          visitors={visitors}
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={limit}
        />
      </main>
    </PrivateLayout>
  );
}
