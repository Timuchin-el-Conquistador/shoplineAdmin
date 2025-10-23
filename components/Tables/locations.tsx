"use client";

import dynamic from "next/dynamic";

import "@/styles/table.scss";

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
  locations: any[];
};

function Table(props: ComponentProps) {


  const router = useRouter()
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
              {props.locations.map((location: any) => {
                return (
                  <tr key={location._id}>
                    <td className="truncate">
                      <span className="text-gray-500 text-xs lg:text-sm block w-full truncate">
                        {location.locationName}
                      </span>
                    </td>
                    <td className="truncate">
                      <span className="text-gray-500 text-xs lg:text-sm block w-full truncate">
                        {location.locationAddress}
                      </span>
                    </td>
                    
                    <td>
                      <SlButton
                        size="small"
                        variant="default"
                        data-optional=""
                        data-valid=""
                        onClick={() => {
                          router.push(`/locations/edit/${location._id}`)
                        }}
                      >
                        Details
                      </SlButton>
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
          {props.locations.map((location: any) => {
            return (
              <li key={location._id} onClick={() => {
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
