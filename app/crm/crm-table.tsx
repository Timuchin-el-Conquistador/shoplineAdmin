"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Pagination from "@/components/Pagination";
import { TableSkeletonPulse } from "@/components/Loaders/pulse";

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

type CrmTableProps = {
  visitors: VisitorRow[];
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
};

function getVisitorId(visitor: VisitorRow) {
  return visitor.visitorId || visitor.id || visitor._id || "";
}

function getVisitorEmail(visitor: VisitorRow) {
  return visitor.visitorEmail?.trim() || "";
}

function getVisitorName(visitor: VisitorRow) {
  return visitor.visitorName || "Unknown";
}

export default function CrmTable({
  visitors,
  currentPage,
  totalPages,
  itemsPerPage = 10,
}: CrmTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", String(page));
    params.set("limit", String(itemsPerPage));
    startTransition(() => {
      router.push(`/crm?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {isPending ? (
        <div className="px-4 py-6">
          <TableSkeletonPulse />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visitor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visit date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">AI interactions</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                      No visitors found.
                    </td>
                  </tr>
                )}
                {visitors.map((visitor) => {
                  const visitorId = getVisitorId(visitor);
                  const visitorEmail = getVisitorEmail(visitor);
                  const visitorIdentifier = visitorEmail || visitorId;
                  return (
                    <tr key={visitorIdentifier || getVisitorName(visitor)} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {getVisitorName(visitor)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.visitorEmail || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.visitorPhoneNumber || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.visitDate || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.aiInteractionCount ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {visitor.storeId || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {visitorIdentifier ? (
                          <Link
                            href={`/crm/${encodeURIComponent(visitorIdentifier)}`}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            aria-label={`Open visitor ${getVisitorName(visitor)}`}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4" />
                              <path d="M12 8h.01" />
                            </svg>
                            Info
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visitors.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
