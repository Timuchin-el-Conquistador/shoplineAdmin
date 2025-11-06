"use client";

import dynamic from "next/dynamic";

import "@/styles/table.scss";

import { Call } from "@/lib/types/call";

import { Caller } from "@/lib/types/call";
import { useMemo } from "react";

const SlButton = dynamic(
  // Notice how we use the full path to the component. If you only do `import("@shoelace-style/shoelace/dist/react")` you will load the entire component library and not get tree shaking.
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    //   loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

const SlBadge = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/badge/index.js"),
  {
    //  loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const SlRelativeTime = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/relative-time/index.js"),
  {
    //  loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

function Table(props: {
  visitors:
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
              </tr>
            </thead>
            <tbody>
              {props.visitors?.map((session: any) => {


                return (
                  <tr key={session._id}>
                    <td className="truncate">
                      <b className="truncate">{session.visitor}</b>
                    </td>
                    <td className="text-left truncate">
                      <b className="truncate">{session.location}</b>
                    </td>
                    <td className="hidden lg:table-cell truncate">
                      <b>
                        <SlRelativeTime date={session.date} />
                      </b>
                    </td>
                    <td className="text-left truncate">
                      <b className="truncate">{session.staff}</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 mb-12 mx-0 sm:mx-0 sm:hidden">
        <ul className="rounded-lg mt-2 divide-y divide-gray-200 overflow-hidden shadow">
          {props.visitors?.map((session: any) => {
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
