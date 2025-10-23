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
