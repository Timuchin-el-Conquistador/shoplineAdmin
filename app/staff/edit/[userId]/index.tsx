"use client";
import dynamic from "next/dynamic";
import Spinner from "@/components/Loaders/spinner";
import "@/styles/pages.new.scss";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


// removed SlButton dynamic import to standardize button styles

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
  updateUserAction: (
    userId: string,
    userEmail: string,
    userPassword: string,
    userName: string,
    userPhoneNumber: string,
    role: string,
    location: string
  ) => Promise<{ status: string; message: string }>;
  retrieveLocationsAction: () => Promise<{
    status: string;
    message: string;
    locations: any[];
  }>;
  user: any;
};
function EditRetailUser(props: PageProps) {
  const router = useRouter();

  const [locations, setLocations] = useState<any[]>([]);

  const [error, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccessMesssage] = useState<string>("");

  const staffEmail = useRef<HTMLInputElement | null>(null);
  const staffPassword = useRef<HTMLInputElement | null>(null);
  const staffName = useRef<HTMLInputElement | null>(null);
  const staffPhoneNumber = useRef<HTMLInputElement | null>(null);
  const staffRole = useRef<HTMLInputElement | null>(null);
  const staffLocation = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const retrieveLoations = async () => {
      setLoading(true);
      const response = await props.retrieveLocationsAction();
      setLoading(false);
      if (response.status != "OK") {
        setLocations([]);
        return;
      }
      setLocations(response.locations);
    };
    retrieveLoations();
  }, []);

  const createSession = async () => {
    setLoading(true);

    const email = staffEmail?.current?.value || props.user.userEmail;
    const password = staffPassword?.current?.value || props.user.userPassword;
    const name = staffName?.current?.value || props.user.userName;
    const phoneNumber =
      staffPhoneNumber?.current?.value || props.user.userPhoneNumber;
    const role = staffRole?.current?.value || props.user.role;
    const location = staffLocation?.current?.value || props.user.location;

    const response = await props.updateUserAction(
      props.user._id,
      email,
      password,
      name,
      phoneNumber,
      role,
      location
    );
    setLoading(false);
    if (response.status != "OK") {
      setErrorMessage(response.message);
      return;
    }

    setSuccessMesssage(response.message);
    router.replace("/staff");
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
            <h2 className="font-semibold text-xl mb-12">
              Staff Member Information
            </h2>{" "}
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">Staff Name</label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    name="Name"
                    placeholder="name"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-10 pr-10 !truncate"
                    ref={staffName}
                    defaultValue={props.user.userName}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">Staff Email</label>{" "}
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
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-10 pr-10 !truncate"
                    ref={staffEmail}
                    defaultValue={props.user.userEmail}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">Staff Password</label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    name="Password"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-10 pr-10 !truncate"
                    ref={staffPassword}
                    defaultValue={props.user.userPassword}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">
                  Staff Phone Number
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
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-10 pr-10 !truncate"
                    ref={staffPhoneNumber}
                    defaultValue={props.user.userPhoneNumber}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">Staff Role</label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    name="Role"
                    placeholder="Role"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-10 pr-10 !truncate"
                    ref={staffRole}
                    defaultValue={props.user.role}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label
                  htmlFor="locations"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Loations
                </label>
              </div>
              <select
                id="locations"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ref={staffLocation}
              >
                <option
                  key={props.user.location._id}
                  value={props.user.location._id}
                >
                  {props.user.location.locationName}
                </option>
                {locations
                  .filter(
                    (location) => location._id !== props.user.location._id
                  )
                  .map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.locationName}
                    </option>
                  ))}
              </select>
            </div>
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
                onClick={createSession}
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

export default EditRetailUser;
