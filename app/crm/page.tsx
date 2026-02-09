import PrivateLayout from "@/components/layouts/private";
import { retrieveCrmData } from "@/lib/actions/crm";
import Link from "next/link";
import React from "react";

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
  aiInteractions:[]
};

function getVisitorId(visitor: VisitorRow) {
  return visitor.visitorId || visitor.id || visitor._id || "";
}

function getVisitorName(visitor: VisitorRow) {
  return visitor.visitorName || "Unknown";
}

export default async function CrmPage() {
  const crmData = await retrieveCrmData();
  const visitors = Array.isArray(crmData)
    ? (crmData as VisitorRow[])
    : ((crmData as { visitors?: VisitorRow[] } | null)?.visitors ?? []);

  return (
    <PrivateLayout page="crm" sidebar={true} notifications={true} pageTitle="CRM">
      <main className="px-6 pb-8">
        <div className="flex items-center justify-between pt-2 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Visitors</h1>
            <p className="text-sm text-gray-500">All CRM visitors</p>
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                  return (
                    <tr key={visitorId || getVisitorName(visitor)} className="hover:bg-gray-50">
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
                        {visitorId ? (
                          <Link
                            href={`/crm/${visitorId}`}
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
        </div>
      </main>
    </PrivateLayout>
  );
}
