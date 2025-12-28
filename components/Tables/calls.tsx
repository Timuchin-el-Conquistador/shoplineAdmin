"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import "@/styles/table.scss";
import Pagination from "@/components/Pagination";

import { Call } from "@/lib/types/call";
import { Caller } from "@/lib/types/call";

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

type ComponentProps = {
  calls: Call[];
  openCall: (callId: string) => void;
  openDrawer: (
    sessionId: string,
    slug: string,
    callStartedTime: string,
    caller: Caller,
    callStatus: string,
    callAnsweredBy: string
  ) => void;
};

function Table(props: ComponentProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(props.calls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCalls = props.calls.slice(startIndex, endIndex);

  return (
    <>
      <div id="sessions" className="mb-6 mx-0 sm:mx-0 hidden sm:block">
        <div id="table-container">
          <table>
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Link</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Date Created</th>
                <th>Answered By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCalls.map((call: Call) => {
                // Step 1: Remove the ordinal suffix (e.g., "nd")

                const cleanedDateString = call.callStartedTime.replace(
                  /(\d+)(st|nd|rd|th)/,
                  "$1"
                );

                // Step 2: Parse the date
                const date = new Date(cleanedDateString);

                // Step 3: Convert to ISO 8601 format
                const isoDate = date.toISOString();

                const callStatus = call.callStatus;

                const getStatusDot = () => {
                  if (callStatus === "live") return "bg-green-500";
                  if (callStatus === "waiting") return "bg-yellow-500";
                  if (callStatus === "ended") return "bg-gray-500";
                  return "bg-red-500";
                };

                const getStatusColor = () => {
                  if (callStatus === "live") return "text-green-700 bg-green-50";
                  if (callStatus === "waiting") return "text-yellow-700 bg-yellow-50";
                  return "text-gray-700 bg-gray-50";
                };

                return (
                  <tr key={call._id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{call.callerInfo.fullName}</div>
                        {call.callerInfo.email && (
                          <div className="text-sm text-gray-500">{call.callerInfo.email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{call.link.linkName}</div>
                        <div className="text-sm text-blue-600">@{call.slug}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot()}`}></span>
                        <span className="text-sm capitalize">{call.callStatus}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-900">
                        {Math.round(call.duration / 60)} min
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        <SlRelativeTime date={isoDate} />
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        {call.callAnsweredBy ? (
                          <>
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                {call.callAnsweredBy.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{call.callAnsweredBy}</div>
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Not answered</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                          onClick={() => {
                            if (
                              call.callStatus == "live" ||
                              call.callStatus == "waiting"
                            ) {
                              props.openDrawer(
                                call._id,
                                call.slug,
                                isoDate,
                                call.callerInfo,
                                call.callStatus,
                                call?.callAnsweredBy ?? ""
                              );
                              return;
                            }
                            props.openCall(call._id);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="More options"
                          onClick={() => {
                            if (call.callStatus !== "waiting") {
                              router.push(`/calls/${call._id}`);
                            }
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

      </div>

      <div className="mt-4 mb-12 mx-0 sm:mx-0 sm:hidden">
        <ul className="rounded-lg mt-2 divide-y divide-gray-200 overflow-hidden shadow">
          {props.calls.map((call: Call) => {
            const callStatus = call.callStatus;
            const variant =
              callStatus == "waiting"
                ? "primary"
                : callStatus == "live"
                ? "success"
                : "danger";

            const showBadge = callStatus == "waiting" || callStatus == "live";

            return (
              <li
                key={call._id}
                onClick={() => {
                  if (
                    call.callStatus == "live" ||
                    call.callStatus == "waiting"
                  ) {
                    // Step 2: Parse the date
                    const date = new Date(
                      call.callStartedTime.replace(/(\d+)(st|nd|rd|th)/, "$1")
                    );

                    // Step 3: Convert to ISO 8601 format
                    const isoDate = date.toISOString();
                    props.openDrawer(
                      call._id,
                      call.slug,
                      isoDate,
                      call.callerInfo,
                      call.callStatus,
                      call?.callAnsweredBy ?? ""
                    );
                    return;
                  }
                  props.openCall(call._id);
                }}
              >
                <div className="block px-4 py-4 bg-white hover:bg-gray-50">
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {call.callerInfo.fullName}
                        </span>{" "}
                        {call.callerInfo.email && (
                          <span className="truncate block w-full text-gray-500">
                            {call.callerInfo.email}
                          </span>
                        )}
                        <span className="truncate block w-full text-gray-500">
                          Meeting with China, a few seconds ago
                        </span>
                      </span>
                    </span>{" "}
                    <span>
                      {showBadge && (
                        <SlBadge variant={variant} className="inline-block">
                          {callStatus}
                        </SlBadge>
                      )}

                      {!showBadge && callStatus != "ended" && (
                        <span className="text-red-500"> {call.callStatus}</span>
                      )}
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
      {/*<div id="sessions" className="mb-12 mx-0 sm:mx-0 sm:hidden">
        <ul className="rounded-lg mt-2 divide-y divide-gray-200 overflow-hidden shadow">
          <li>
            <div className="block px-4 py-4 bg-white hover:bg-gray-50">
              <span className="flex items-center space-x-4">
                <span className="flex-1 flex space-x-2 truncate">
                  <span className="flex flex-col text-gray-900 text-sm truncate">
                    <span className="truncate font-semibold">Magush</span>{" "}
                    <span className="truncate text-gray-500">
                      test@gmail.com
                    </span>{" "}
                    <span className="truncate text-gray-500">
                      Meeting with Cingiz, 1 minutes
                    </span>
                  </span>
                </span>{" "}
                <span></span>{" "}
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
        </ul>
      </div>{" "}*/}
      {/*} <SlDialog
        label="Download Records"
        className="dialog-deny-close with-header"
        style={{ width: "520px" }}
      >
        <div className="mt-2 flex items-center text-gray-700 w-full">
          <span className="mr-5 w-1/5 sm:text-base text-sm">Date Range: </span>{" "}
          <div className="text-sm" style={{ maxWidth: "80%", width: "80%" }}>
            {" "}
            <div className="relative h-full">
              <button
                type="button"
                className="relative w-full rounded-md bg-white py-1 lg:py-1.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 !leading-6 sm:text-sm h-full cursor-pointer shadow-sm"
              >
                <div
                  className="truncate text-gray-600"
                  style={{ fontSize: "14px" }}
                >
                  Last 7 days
                </div>{" "}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  {" "}
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>{" "}
            </div>
          </div>
        </div>{" "}
        <div className="text-gray-700" style={{ display: "none" }}>
          <div className="flex mt-4 items-center w-full">
            <span className="mr-5 w-1/5 sm:text-base text-sm">Start Date:</span>{" "}
            <div className="vdp-datepicker">
              <div>
                {" "}
                <input
                  type="text"
                  placeholder="Select start date"
                  readOnly
                  className="custom-datepicker-styling sm:h-9 h-8"
                />{" "}
              </div>{" "}
              <div
                className="vdp-datepicker__calendar"
                style={{ display: "none" }}
              >
                {" "}
                <header>
                  <span className="prev">&lt;</span>{" "}
                  <span className="day__month_btn up">Dec 2024</span>{" "}
                  <span className="next">&gt;</span>
                </header>{" "}
                <div className="">
                  <span className="cell day-header">Sun</span>
                  <span className="cell day-header">Mon</span>
                  <span className="cell day-header">Tue</span>
                  <span className="cell day-header">Wed</span>
                  <span className="cell day-header">Thu</span>
                  <span className="cell day-header">Fri</span>
                  <span className="cell day-header">Sat</span>{" "}
                  <span className="cell day weekend sun">1</span>
                  <span className="cell day">2</span>
                  <span className="cell day">3</span>
                  <span className="cell day">4</span>
                  <span className="cell day">5</span>
                  <span className="cell day">6</span>
                  <span className="cell day weekend sat">7</span>
                  <span className="cell day weekend sun">8</span>
                  <span className="cell day">9</span>
                  <span className="cell day">10</span>
                  <span className="cell day">11</span>
                  <span className="cell day">12</span>
                  <span className="cell day">13</span>
                  <span className="cell day weekend sat">14</span>
                  <span className="cell day weekend sun">15</span>
                  <span className="cell day">16</span>
                  <span className="cell day">17</span>
                  <span className="cell day">18</span>
                  <span className="cell day">19</span>
                  <span className="cell day">20</span>
                  <span className="cell day weekend sat">21</span>
                  <span className="cell day weekend sun">22</span>
                  <span className="cell day">23</span>
                  <span className="cell day">24</span>
                  <span className="cell day">25</span>
                  <span className="cell day">26</span>
                  <span className="cell day today">27</span>
                  <span className="cell day weekend sat">28</span>
                  <span className="cell day weekend sun">29</span>
                  <span className="cell day">30</span>
                  <span className="cell day">31</span>
                </div>
              </div>{" "}
              <div
                className="vdp-datepicker__calendar"
                style={{ display: "none" }}
              >
                {" "}
                <header>
                  <span className="prev">&lt;</span>{" "}
                  <span className="month__year_btn up">2024</span>{" "}
                  <span className="next">&gt;</span>
                </header>{" "}
                <span className="cell month">January</span>
                <span className="cell month">February</span>
                <span className="cell month">March</span>
                <span className="cell month">April</span>
                <span className="cell month">May</span>
                <span className="cell month">June</span>
                <span className="cell month">July</span>
                <span className="cell month">August</span>
                <span className="cell month">September</span>
                <span className="cell month">October</span>
                <span className="cell month">November</span>
                <span className="cell month">December</span>
              </div>{" "}
              <div
                className="vdp-datepicker__calendar"
                style={{ display: "none" }}
              >
                {" "}
                <header>
                  <span className="prev">&lt;</span> <span>2020 - 2029</span>{" "}
                  <span className="next">&gt;</span>
                </header>{" "}
                <span className="cell year">2020</span>
                <span className="cell year">2021</span>
                <span className="cell year">2022</span>
                <span className="cell year">2023</span>
                <span className="cell year">2024</span>
                <span className="cell year">2025</span>
                <span className="cell year">2026</span>
                <span className="cell year">2027</span>
                <span className="cell year">2028</span>
                <span className="cell year">2029</span>
              </div>
            </div>
          </div>{" "}
          <div className="flex mt-4 items-center w-full">
            <span className="mr-5 w-1/5 sm:text-base text-sm">End Date:</span>{" "}
            <div className="vdp-datepicker">
              <div className="">
                {" "}
                <input
                  type="text"
                  placeholder="Select end date"
                  readOnly
                  className="custom-datepicker-styling sm:h-9 h-8"
                />{" "}
              </div>{" "}
              <div
                className="vdp-datepicker__calendar"
                style={{ display: "none" }}
              >
                {" "}
                <header>
                  <span className="prev">&lt;</span>{" "}
                  <span className="day__month_btn up">Dec 2024</span>{" "}
                  <span className="next">&gt;</span>
                </header>{" "}
                <div>
                  <span className="cell day-header">Sun</span>
                  <span className="cell day-header">Mon</span>
                  <span className="cell day-header">Tue</span>
                  <span className="cell day-header">Wed</span>
                  <span className="cell day-header">Thu</span>
                  <span className="cell day-header">Fri</span>
                  <span className="cell day-header">Sat</span>{" "}
                  <span className="cell day weekend sun">1</span>
                  <span className="cell day">2</span>
                  <span className="cell day">3</span>
                  <span className="cell day">4</span>
                  <span className="cell day">5</span>
                  <span className="cell day">6</span>
                  <span className="cell day weekend sat">7</span>
                  <span className="cell day weekend sun">8</span>
                  <span className="cell day">9</span>
                  <span className="cell day">10</span>
                  <span className="cell day">11</span>
                  <span className="cell day">12</span>
                  <span className="cell day">13</span>
                  <span className="cell day weekend sat">14</span>
                  <span className="cell day weekend sun">15</span>
                  <span className="cell day">16</span>
                  <span className="cell day">17</span>
                  <span className="cell day">18</span>
                  <span className="cell day">19</span>
                  <span className="cell day">20</span>
                  <span className="cell day weekend sat">21</span>
                  <span className="cell day weekend sun">22</span>
                  <span className="cell day">23</span>
                  <span className="cell day">24</span>
                  <span className="cell day">25</span>
                  <span className="cell day">26</span>
                  <span className="cell day today">27</span>
                  <span className="cell day weekend sat">28</span>
                  <span className="cell day weekend sun">29</span>
                  <span className="cell day">30</span>
                  <span className="cell day">31</span>
                </div>
              </div>{" "}
              <div
                className="vdp-datepicker__calendar"
                style={{ display: "none" }}
              >
                {" "}
                <header>
                  <span className="prev">&lt;</span>{" "}
                  <span className="month__year_btn up">2024</span>{" "}
                  <span className="next">&gt;</span>
                </header>{" "}
                <span className="cell month">January</span>
                <span className="cell month">February</span>
                <span className="cell month">March</span>
                <span className="cell month">April</span>
                <span className="cell month">May</span>
                <span className="cell month">June</span>
                <span className="cell month">July</span>
                <span className="cell month">August</span>
                <span className="cell month">September</span>
                <span className="cell month">October</span>
                <span className="cell month">November</span>
                <span className="cell month">December</span>
              </div>{" "}
              <div
                className="vdp-datepicker__calendar"
                style={{ display: "none" }}
              >
                {" "}
                <header>
                  <span className="prev">&lt;</span> <span>2020 - 2029</span>{" "}
                  <span className="next">&gt;</span>
                </header>{" "}
                <span className="cell year">2020</span>
                <span className="cell year">2021</span>
                <span className="cell year">2022</span>
                <span className="cell year">2023</span>
                <span className="cell year">2024</span>
                <span className="cell year">2025</span>
                <span className="cell year">2026</span>
                <span className="cell year">2027</span>
                <span className="cell year">2028</span>
                <span className="cell year">2029</span>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="mb-8 flex mt-4 items-center text-gray-700 w-full">
          <span className="mr-5 w-1/5 sm:text-base text-sm">Pages: </span>{" "}
          <div className="text-sm" style={{ maxWidth: "80%", width: "80%" }}>
            {" "}
            <div className="relative h-full">
              <button
                type="button"
                className="relative w-full rounded-md bg-white py-1 lg:py-1.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 !leading-6 sm:text-sm h-full cursor-pointer shadow-sm"
              >
                <div
                  className="truncate text-gray-600"
                  style={{ fontSize: "14px" }}
                >
                  All Links
                </div>{" "}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>{" "}
            </div>
          </div>
        </div>{" "}
        <div className="py-2">
          <span className="block text-xs mb-2 h-4 text-gray-600"></span>{" "}
          <a href="/calls/download?page_slug=all&amp;start_date=2024-12-20 00:00:00 UTC&amp;end_date=2024-12-27 23:59:59 UTC">
            <SlButton
              variant="primary"
              size="medium"
              data-optional=""
              data-valid=""
              className="flex items-center px-24 sm:px-36"
            >
              Download
            </SlButton>
          </a>
        </div>
      </SlDialog>{" "}*/}
      {/*<SlDrawer
        no-header=""
        label=""
        placement="end"
        className="drawer-overview"
      >
        <div>
          <SlAlert open={false} variant="primary">
            <SlIcon
              slot="icon"
              name="info-circle"
              aria-hidden="true"
              library="default"
            ></SlIcon>
            No session selected. Select one and try again.
          </SlAlert>
        </div>{" "}
        <div slot="footer" className="flex justify-between">
          <span>
            <SlButton
              variant="text"
              size="medium"
              data-optional=""
              data-valid=""
            >
              <SlIcon
                name="arrow-left"
                aria-hidden="true"
                library="default"
              ></SlIcon>{" "}
              Back
            </SlButton>
          </span>{" "}
          <span className="mr-4">
            <SlButton
              variant="danger"
              size="medium"
              data-optional=""
              data-valid=""
            >
              Delete
            </SlButton>
          </span>
        </div>
      </SlDrawer>*/}
    </>
  );
}

export default Table;
