"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import "@/styles/table.scss";
import Pagination from "@/components/Pagination";

import {useRouter} from 'next/navigation'
import { useLayoutStore } from "@/providers/layout";

const SlButton = dynamic(
  // Notice how we use the full path to the component. If you only do `import("@shoelace-style/shoelace/dist/react")` you will load the entire component library and not get tree shaking.
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    //   loading: () => <p>Loading...</p>,
    ssr: false,
  }
);


type ComponentProps = {
  locations: any[];
  onDelete: (locationId: string) => Promise<void> | void;
};

function Table(props: ComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(props.locations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = props.locations.slice(startIndex, endIndex);

  const router = useRouter()
  const setGlobalLoading = useLayoutStore((store) => store.setGlobalLoading);
  return (
    <>
      <div id="sessions" className="mb-6 mx-0 sm:mx-0 hidden sm:block">
        <div id="table-container">
          <table>
            <thead>
              <tr>
                <td>Loation</td>
                <td>Loation address</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {currentLocations.map((location: any) => {
                return (
                  <tr key={location._id}>
                    <td>
                      <div className="font-medium text-gray-900">{location.locationName}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-600">{location.locationAddress}</div>
                    </td>
                    
                    <td>
                      <button
                        onClick={() => {
                          setGlobalLoading(true);
                          router.push(`/locations/edit/${location._id}`)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title="More options"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={async (event) => {
                          event.stopPropagation();
                          setDeletingId(location._id);
                          try {
                            await props.onDelete(location._id);
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        className="ml-3 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete location"
                        aria-label="Delete location"
                      >
                        {deletingId === location._id ? (
                          "..."
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
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
          {props.locations.map((location: any) => {
            return (
              <li key={location._id} onClick={() => {
                          setGlobalLoading(true);
                          router.push(`/locations/edit/${location._id}`)
              }}>
                <div className="block px-4 py-4 bg-white hover:bg-gray-50">
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {location.locationName}
                        </span>{" "}
                        <span className="truncate block w-full text-gray-500">
                          {location.locationAddress}
                        </span>
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
                    <button
                      onClick={async (event) => {
                        event.stopPropagation();
                        setDeletingId(location._id);
                        try {
                          await props.onDelete(location._id);
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                      title="Delete location"
                      aria-label="Delete location"
                    >
                      {deletingId === location._id ? (
                        "..."
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
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
