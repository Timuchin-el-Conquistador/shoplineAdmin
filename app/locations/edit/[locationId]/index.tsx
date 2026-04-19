"use client";
import dynamic from "next/dynamic";
import Spinner from "@/components/Loaders/spinner";
import "@/styles/pages.new.scss";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

const SlButton = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/button/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  },
);

const SlIcon = dynamic(
  // Notice how we use the full path to the component. If you only do `import("@shoelace-style/shoelace/dist/react")` you will load the entire component library and not get tree shaking.
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    //   loading: () => <p>Loading...</p>,
    ssr: false,
  },
);
const SlAlert = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/alert/index.js"),
  {
    //  loading: () => <>Loading...</>,
    ssr: false,
  },
);

type PageProps = {
  updateLocationAction: (
    locationId: string,
    storeId: string,
    locationEmail: string,
    locationName: string,
    locationPhoneNumber: string,
    locationAddress: string,
  ) => Promise<{ status: string; message: string }>;
  location: any;
  stores: any[];
};

function EditLocation(props: PageProps) {
  const router = useRouter();

  const [error, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccessMesssage] = useState<string>("");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  const locationEmail = useRef<HTMLInputElement | null>(null);
  const locationName = useRef<HTMLInputElement | null>(null);
  const locationPhoneNumber = useRef<HTMLInputElement | null>(null);
  const locationAddress = useRef<HTMLInputElement | null>(null);

  const activeStore = useMemo(
    () =>
      props.stores.find(
        (store) =>
          store._id === (props.location.onlineStore?._id || selectedStoreId),
      ),
    [props.stores, props.location.onlineStore?._id, selectedStoreId],
  );


  const updateLocation = async () => {
    try {
      setLoading(true);
      const email =
        locationEmail?.current?.value || props.location.locationEmail;
      const name = locationName?.current?.value || props.location.locationName;
      const storeId = activeStore._id;
      const phoneNumber =
        locationPhoneNumber?.current?.value ||
        props.location.loationPhoneNumber;
      const address =
        locationAddress?.current?.value || props.location.locationAddress;

      const response = await props.updateLocationAction(
        props.location._id,
        storeId,
        email,
        name,
        phoneNumber,
        address,
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
            <h2 className="font-semibold text-xl mb-12">Loation Information</h2>{" "}
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">Loation Name</label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <input
                    name="Slug"
                    placeholder="Email"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                    ref={locationName}
                    defaultValue={props.location.locationName}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">Online Store</label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <select
                    value={selectedStoreId}
                    onChange={(event) => setSelectedStoreId(event.target.value)}
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                  >
                    <option value="">Select online store</option>
                    {props.stores.map((store) => (
                      <option key={store._id} value={store._id}>
                        {store.name}
                      </option>
                    ))}
                  </select>{" "}
                </div>
                {activeStore ? (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected store:{" "}
                    <span className="font-medium text-gray-900">
                      {activeStore.name}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-amber-600">
                    Please select an online store.
                  </div>
                )}
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">
                  Loation Email
                </label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <input
                    name="Slug"
                    placeholder="Email"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                    ref={locationEmail}
                    defaultValue={props.location.locationEmail}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">
                  Location Phone Number
                </label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <input
                    name="Slug"
                    placeholder="Phone number"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                    ref={locationPhoneNumber}
                    defaultValue={props.location.locationPhoneNumber}
                  />{" "}
                </div>
              </div>
            </div>{" "}
            <hr />
            <div className="md:flex w-full">
              <div className="md:w-1/2">
                <label className="font-medium text-md">
                  Location Address
                </label>{" "}
              </div>{" "}
              <div className="md:w-1/2 relative">
                <div className="flex relative">
                  <input
                    name="Slug"
                    placeholder="Phone number"
                    className="rounded-none rounded-e-md border border-gray-300 text-gray-700 focus:border-blue-300 focus:outline-none block w-full text-sm py-2 pl-3 pr-10 !truncate"
                    ref={locationAddress}
                    defaultValue={props.location.locationAddress}
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
                onClick={updateLocation}
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

export default EditLocation;
