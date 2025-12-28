"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "@/styles/table.scss";
import Pagination from "@/components/Pagination";
import Link from "next/link";

const SlRelativeTime = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/relative-time/index.js"),
  {
    //  loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

function Table(props: {
  retailsSessions:
    | {
        _id: string;
        visitor: string;
        location: string;
        staff: string;
        status: string;
        date: string;
      }[]
    | null;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sessions = props.retailsSessions || [];
  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = sessions.slice(startIndex, endIndex);

  return (
    <>
      <div id="sessions" className="mb-6 mx-0 sm:mx-0 hidden sm:block">
        <div id="table-container">
          <table>
            <thead>
              <tr>
                <td>Visitor</td>
                <td>Location</td>
                <td>Date</td>
                <td>Staff</td>
                <td>Link</td>
              </tr>
            </thead>
            <tbody>
              {currentSessions.map((session: any) => {
                return (
                  <tr key={session._id}>
                    <td>
                      <div className="font-medium text-gray-900">{session.visitor}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-600">{session.location}</div>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        <SlRelativeTime date={session.date} />
                      </span>
                    </td>
                    <td>
                      <div className="text-sm text-gray-600">{session.staff}</div>
                    </td>
                    <td>
                      <Link className="text-sm text-blue-600 hover:text-blue-800" href={session.link}>
                        {session.link}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <div className="mt-4 mb-12 mx-0 sm:mx-0 sm:hidden">
        <ul className="rounded-lg mt-2 divide-y divide-gray-200 overflow-hidden shadow">
          {props.retailsSessions?.map((session: any) => {
            return (
              <li key={session._id}>
                <div className="block px-4 py-4 bg-white hover:bg-gray-50">
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {session.visitor}
                        </span>{" "}
                      </span>
                    </span>{" "}
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {session.location}
                        </span>{" "}
                      </span>
                    </span>{" "}
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {session.staff}
                        </span>{" "}
                      </span>
                    </span>{" "}
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      id=""
                      className="flex-shrink-0 h-7 w-7 text-gray-400"
                      style={{ display: "inline-block" }}
                    >
                      <use xlinkHref="/feather-sprite.svg#chevron-right"></use>
                    </svg>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Table;
