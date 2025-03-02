"use client";
import dynamic from "next/dynamic";

import Table from "@/components/Tables/customers";
import CustomerProfileDrawer from "@/components/Drawer/customer-drawer";
import { TableSkeletonPulse } from "@/components/Loaders/pulse";

import { useVisibility } from "@/hooks/alerts-visibility";

import { type User } from "@/lib/types/user";

import "@/styles/calls/index.scss";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCustomersStore } from "@/providers/customers";

const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

function debounce(func: Function, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

type PageProps = {
  retrieveCustomerAccountInformationAction: (
    email: string
  ) => Promise<{ status: number; message: string; account: User | null }>;
};

function Customers(props: PageProps) {
  const router = useRouter();

  const {
    customers,
    error,
    loaded,
    success,
    filter,
    reset,
    retrieveCustomers,
  } = useCustomersStore((state) => state); //session store

  //const [sessions, setSessions] = useState(props.calls); //all sessions

  const [drawer, setDrawerState] = useState<{
    isOpen: boolean;
    customerId: string;
    user: {
      planName: string;
      subscriptionStatus: string;
    };
  }>({
    isOpen: false,
    customerId: "",
    user: { planName: "", subscriptionStatus: "" },
  });

  const { isDangerAlertVisible, isSuccessAlertVisible } = useVisibility(
    reset,
    error,
    !loaded,
    success
  );

  const [isDropdownVisible, setDropDownVisibility] = useState(false);

  const elementRef = useRef<HTMLUListElement | null>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node)
    ) {
      setDropDownVisibility(false); // Close or perform an action
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    retrieveCustomers(router);
  }, []);

  /*const linkName = useMemo(() => {
    const call = props.customers.filter((el) => el.slug == filter.slug)[0];
    return call?.linkName ?? "All Links";
  }, [filter.slug]);*/

  // useCallback ensures the function reference remains stable
  const updateDebouncedValue = useCallback(
    debounce((value: string) => {
      //  filterCalls(filter.slug, value, router);
    }, 800), // 500ms delay
    [filter]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateDebouncedValue(value);
  };

  const resetDrawer = useCallback(() => {
    setDrawerState((prevState) => ({
      ...prevState,
      isOpen: false,
      customerId: "",
    }));
  }, []);

  const customer = useMemo(() => {
    const customer = customers.filter((el) => el._id == drawer.customerId)[0];
    return customer;
  }, [drawer.customerId]);

  const retrieveAccountInformation = useCallback(
    async (email: string) => {
      const response = await props.retrieveCustomerAccountInformationAction(
        email
      );
      if (response.status == 200) {
        return response.account;
      }
      return null;
    },
    [drawer.customerId]
  );

  return (
    <div id="main" className="mt-0 sm:mt-0 relative p-6">
      <div
        style={{
          position: "fixed",
          right: "15px",
          top: "15px",
          display: isDangerAlertVisible ? "block" : "hidden",
        }}
      >
        <SlAlert variant="danger" open={isDangerAlertVisible}>
          <SlIcon slot="icon" name="exclamation-octagon"></SlIcon>
          <strong>{error?.message}</strong>
        </SlAlert>
      </div>
      {/*} <div className="mb-4">
        <div className="block lg:flex lg:justify-between lg:items-center w-full">
          <div className="mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search by visitor's email or name..."
              className="w-full sm:w-80 h-9 text-sm shadow-sm"
              onChange={handleChange}
            />
          </div>{" "}
          <div className="block sm:flex items-center">
            <div className="mb-4 sm:mb-0">
              <div
                className="!w-full !max-w-full sm:!w-48 sm:!max-w-xs sm:!text-sm h-9"
                style={{ maxWidth: "300px", width: "300px" }}
              >
                {" "}
                <div className="relative h-full">
                  <button
                    type="button"
                    className="relative w-full rounded-md bg-white py-1 lg:py-1.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 !leading-6 sm:text-sm h-full cursor-pointer shadow-sm"
                    onClick={() => {
                      setDropDownVisibility(true);
                    }}
                  >
                    <div
                      className="truncate text-gray-600"
                      style={{ fontSize: "14px" }}
                    >
                      {""}
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
                  {isDropdownVisible && (
                    <ul
                      tabIndex={-1}
                      role="listbox"
                      className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm py-1"
                      style={{ maxHeight: "300px" }}
                      ref={elementRef}
                    >
                      <li
                        id="option1"
                        role="option"
                        className="relative flex items-center select-none py-2 pr-4 hover:bg-gray-100 text-gray-900 cursor-pointer pl-10"
                        style={{ fontSize: "14px" }}
                        onClick={() => {
                          setDropDownVisibility(false);
                          // filterCalls("All Links", filter.caller, router);
                        }}
                      >
                        <span className="font-normal block truncate">
                          All Customers
                        </span>{" "}
                      </li>
                      {props.customers.map(
                        (el: {  }, i = 1) => (
                          <li
                            key={el._id}
                            id="option12"
                            role="option"
                            className="relative flex items-center select-none py-2 pr-4 hover:bg-gray-100 text-gray-900 cursor-pointer pl-10"
                            style={{ fontSize: "14px" }}
                            onClick={() => {
                              setDropDownVisibility(false);
                              filterCalls(el, filter.caller, router);
                            }}
                          >
                            <span className="font-normal block truncate">
                              {el.linkName}
                            </span>{" "}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
             <div className="ml-0 sm:ml-2">
              <div className="relative inline-block text-left m-0 md:ml-2">
                <button className="flex justify-center items-center rounded-md bg-white py-1.5 px-3 text-gray-900 focus:outline-none ring-1 ring-inset ring-gray-300 hover:bg-gray-50 shadow-sm">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    id=""
                    className="h-6 w-6"
                    style={{ display: "inline-block" }}
                  >
                    <use xlinkHref="/feather-sprite.svg#menu"></use>
                  </svg>
                </button>{" "}
                <div
                  className="absolute mt-1 sm:right-0 z-10 w-56 origin-top-right rounded-t-none rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  style={{ display: "none" }}
                >
                  <div className="py-1">
                    <a
                      href="#"
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Download Records
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>*/}

      {customers.length > 0 && loaded && (
        <Table
          customers={customers}
          openDrawer={async (customerId, email) => {
            const user = (await retrieveAccountInformation(email)) as User;

            if (!user) return;
            setDrawerState((prevState) => ({
              ...prevState,
              isOpen: true,
              customerId,
              user: {
                planName: user.planName,
                subscriptionStatus: user.subscriptionStatus,
              },
            }));
          }}
        />
      )}
      {customers.length == 0 && loaded && (
        <div className="dotted-container sm:h-80 mt-4 py-12 px-6">
          <div className="text-gray-400">
            <svg
              width="45"
              height="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              id=""
              style={{ display: "inline-block" }}
            >
              <use xlinkHref="/feather-sprite.svg#coffee"></use>
            </svg>{" "}
            <h2 className="text-l mt-4 sm:mt-6 text-gray-400">Nothing Found</h2>{" "}
            <h3 className="text-sm mt-2 text-gray-400">
              Clear search field or page filter
            </h3>
          </div>
        </div>
      )}
      {!loaded && <TableSkeletonPulse />}
      {customer && (
        <CustomerProfileDrawer
          isOpen={drawer.isOpen}
          customerId={drawer.customerId}
          fullName={customer.fullName}
          email={customer.email}
          createdOn={customer.createdOn}
          lastLogin={customer.lastLogin}
          accountStatus={customer.accountStatus}
          subscription={{
            planName: drawer.user?.planName,
            subscriptionStatus: drawer.user?.subscriptionStatus,
          }}
          closeDrawer={() => {
            setDrawerState((prevState) => ({
              ...prevState,
              isOpen: false,
            }));
          }}
        />
      )}
    </div>
  );
}

export default Customers;
