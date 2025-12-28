"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import "@/styles/table.scss";
import Pagination from "@/components/Pagination";

import { type Call } from "@/lib/types/call";
import { type User } from "@/lib/types/user";

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
  customers: User[];
  openDrawer: (customerId: string, email:string) => void;
};

function Table(props: ComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(props.customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = props.customers.slice(startIndex, endIndex);

  return (
    <>
      <div id="sessions" className="mb-6 mx-0 sm:mx-0 hidden sm:block">
        <div id="table-container">
          <table>
            <thead>
              <tr>
                <td>Customer</td>
                <td>Account Status</td>
                <td className="hidden lg:table-cell">Last Login</td>
                <td className="hidden lg:table-cell">Subscription Status</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer: User) => {
                // Step 1: Remove the ordinal suffix (e.g., "nd")
                let isoDate;
                    if(customer.lastLogin){
                const cleanedDateString = customer.lastLogin.replace(
                  /(\d+)(st|nd|rd|th)/,
                  "$1"
                ) ;

                // Step 2: Parse the date
                const date = new Date(cleanedDateString);

                // Step 3: Convert to ISO 8601 format
                 isoDate = date.toISOString();
              }

                const subscriptionStatus = customer.subscriptionStatus;
                const variant =
                  subscriptionStatus == "active" ? "success" : "danger";

                const showBadge = subscriptionStatus != "active" && subscriptionStatus != 'trialing';

                const getStatusDot = () => {
                  if (subscriptionStatus === "active" || subscriptionStatus === "trialing") return "bg-green-500";
                  if (subscriptionStatus === "pending") return "bg-orange-500";
                  return "bg-red-500";
                };

                return (
                  <tr key={customer._id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{customer.fullName}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot()}`}></span>
                        <span className="text-sm">{customer.accountStatus}</span>
                      </div>
                    </td>

                    <td className="hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        <SlRelativeTime date={isoDate} />
                      </span>
                    </td>
                    <td>
                      {showBadge ? (
                        <SlBadge variant={variant} className="inline-block">
                          {subscriptionStatus}
                        </SlBadge>
                      ) : (
                        <span className="text-sm text-green-600 font-medium">
                          {subscriptionStatus}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          props.openDrawer(customer._id, customer.email);
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
          {props.customers.map((customer: User) => {
            // Step 1: Remove the ordinal suffix (e.g., "nd")

            const subscriptionStatus = customer.subscriptionStatus;
            const variant =
              subscriptionStatus == "active" ? "success" : "danger";

            const showBadge = subscriptionStatus != "active" && subscriptionStatus !='trialing';
            return (
              <li
                key={customer._id}
                onClick={() => {
                  props.openDrawer(customer._id, customer.email);
                }}
              >
                <div className="block px-4 py-4 bg-white hover:bg-gray-50">
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      <span className="flex flex-col text-gray-900 text-sm truncate">
                        <span className="truncate block w-full font-semibold">
                          {customer.fullName}
                        </span>{" "}
                        <span className="truncate block w-full text-gray-500">
                          {customer.email}
                        </span>
                        <span className="truncate block w-full text-gray-500">
                          Meeting with China, a few seconds ago
                        </span>
                      </span>
                    </span>{" "}
                    <span>
                      {showBadge && (
                        <SlBadge variant={variant} className="inline-block">
                          {subscriptionStatus}
                        </SlBadge>
                      )}


                      {!showBadge && (
                        <span className="text-green-500">
                          {" "}
                          {subscriptionStatus}
                        </span>
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
