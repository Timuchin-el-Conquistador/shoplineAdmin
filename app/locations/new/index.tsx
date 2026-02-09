"use client";
import dynamic from "next/dynamic";
import Spinner from "@/components/Loaders/spinner";
import "@/styles/pages.new.scss";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import StaffModal from "@/components/modals/staff";

const SlButton = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

const SlIcon = dynamic(
  // Notice how we use the full path to the component. If you only do `import("@shoelace-style/shoelace/dist/react")` you will load the entire component library and not get tree shaking.
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    //   loading: () => <p>Loading...</p>,
    ssr: false,
  }
);
const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  }
);

type PageProps = {
  storeId:string,
  createLocationAction: (
    storeId:string,
    loationEmail: string,
    locationName: string,
    locationPhoneNumber: string,
    locationAddress: string,
  ) => Promise<{ status: string; message: string }>;
};
function NewLocation(props: PageProps) {
  const router = useRouter();
  
  const [error, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccessMesssage] = useState<string>("");

  const locationEmail = useRef<HTMLInputElement | null>(null);
  const locationName = useRef<HTMLInputElement | null>(null);
  const locationPhoneNumber = useRef<HTMLInputElement | null>(null);
  const locationAddressr = useRef<HTMLInputElement | null>(null);

  const createLocation = async () => {
    try {
      setLoading(true);
      const email = locationEmail?.current?.value || "";
      const name = locationName?.current?.value || "";
      const phoneNumber = locationPhoneNumber?.current?.value || "";
      const address = locationAddressr?.current?.value || "";

      const response = await props.createLocationAction(
        props.storeId,
        email,
        name,
        phoneNumber,
        address
      );

      if (response.status != "OK") {
        setErrorMessage(response.message);
        return;
      }

      setSuccessMesssage(response.message);
      router.replace("/locations");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="main" className="p-6 mb-20">
        <div
          style={{
            position: "fixed",
            right: "15px",
            top: "15px",
            display: success ? "block" : "hidden",
          }}
        >
          <SlAlert variant="success" open={!!success}>
            <SlIcon slot="icon" name="info-circle"></SlIcon>
            <div className="flex items-center">
              <strong>{success}</strong>
            </div>
          </SlAlert>
        </div>

        <div
          style={{
            position: "fixed",
            right: "15px",
            top: "15px",
            display: error ? "block" : "hidden",
          }}
        >
          <SlAlert variant="danger" open={!!error}>
            <SlIcon slot="icon" name="info-circle"></SlIcon>
            <div className="flex items-center">
              <strong>{error}</strong>
            </div>
          </SlAlert>
        </div>
        <div className="p-6 bg-white">
          <div className="flex flex-col max-w-3xl w-full">
            <h2 className="font-bold text-2xl mb-8 text-gray-900">Loation Information</h2>{" "}
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-semibold text-sm text-gray-900">Loation Name <span className="text-red-500">*</span></label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    name="Name"
                    placeholder="Name"
                    className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-0 block w-full text-sm py-3.5 pl-10 pr-10 placeholder-gray-500"
                    ref={locationName}
                  />{" "}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-semibold text-sm text-gray-900">Loation Email <span className="text-red-500">*</span></label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    name="Email"
                    placeholder="Email"
                    className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-0 block w-full text-sm py-3.5 pl-10 pr-4 placeholder-gray-500"
                    ref={locationEmail}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-semibold text-sm text-gray-900">
                  Location Phone Number <span className="text-red-500">*</span>
                </label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    name="Phone"
                    placeholder="Phone number"
                    className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-0 block w-full text-sm py-3.5 pl-10 pr-4 placeholder-gray-500"
                    ref={locationPhoneNumber}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-semibold text-sm text-gray-900">Location Address <span className="text-red-500">*</span></label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                    <span className="text-sm text-gray-900 font-medium px-3 border-r border-gray-300">USA</span>
                  </div>
                  <input
                    name="Address"
                    placeholder="Address"
                    className="bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-0 block w-full text-sm py-3.5 pl-24 pr-4 placeholder-gray-500"
                    ref={locationAddressr}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="w-full flex items-center justify-between mt-16 mb-1">
              <button
                className="btn btn-outline btn-lg"
                onClick={() => {
                  router.back();
                }}
              >
                Cancel
              </button>{" "}
              <button
                className="btn btn-primary btn-lg"
                onClick={createLocation}
              >
                {loading ? <Spinner /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default NewLocation;
