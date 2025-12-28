"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import "@/styles/table.scss";
import Pagination from "@/components/Pagination";

import {useRouter} from 'next/navigation'

const SlButton = dynamic(
  // Notice how we use the full path to the component. If you only do `import("@shoelace-style/shoelace/dist/react")` you will load the entire component library and not get tree shaking.
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    //   loading: () => <p>Loading...</p>,
    ssr: false,
  }
);


type ComponentProps = {
  staff: any[];
};

function Table(props: ComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(props.staff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaff = props.staff.slice(startIndex, endIndex);

  const router = useRouter()
  return (
    <>
      <div id="sessions" className="mb-6 mx-0 sm:mx-0 hidden sm:block">
        <div id="table-container">
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Role</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {currentStaff.map((user: any) => {
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="font-medium text-gray-900">{user.userName}</div>
                    </td>
                    <td>
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                        {user.role}
                      </span>
                    </td>
                    
                    <td>
                      <button
                        onClick={() => {
                          router.push(`/staff/edit/${user._id}`)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title="More options"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
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
          {props.staff.map((user: any) => {
            return (
              <li key={user._id} onClick={() => {
                    router.push(`/staff/edit/${user._id}`)
              }}>
                <div className="block px-4 py-4 bg-white hover:bg-gray-50">
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {user.userName}
                        </span>{" "}
                        <span className="truncate block w-full text-gray-500">
                          {user.role}
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
