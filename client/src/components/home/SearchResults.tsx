import React from "react";

import { FaSearch } from "react-icons/fa";
import { PlaceData } from "../../dataObjects/PlaceData";
import PlaceCard from "../PlaceCard";
import { SlArrowDown } from "react-icons/sl";

interface SearchProps {
  placeData: Array<PlaceData>;
  resultsToggle: boolean;
  toggleResults: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  radius: number;
  unit: string;
}

export default function SearchResults({
  placeData,
  resultsToggle,
  toggleResults,
  searchText,
  radius,
  unit,
}: SearchProps): React.ReactElement {
  // Convert radius to readable format
  const convertRadius = () => {
    if (unit === "KM") {
      return (radius / 1000).toFixed(1);
    } else {
      return ((radius / 1000) * 0.621371).toFixed(1);
    }
  };

  return (
    <aside
      id="searchResults"
      className={`results top-inherit left-inherit load-slide-up load-slide-left fixed bottom-0 z-10 p-2 pb-4 mb-16 lg:bottom-auto lg:left-2 lg:z-20 lg:ml-2 lg:mr-0 lg:p-0 ${placeData.length < 3 ? "lg:h-fit" : "lg:h-4/5"} w-full rounded-lg opacity-90 lg:w-1/3 lg:pb-12 lg:pl-10`}
    >
      {/* <div
        className="flex h-[30px] w-full items-center justify-center rounded-xl bg-white opacity-90 lg:hidden"
        onClick={() => toggleResults(false)}
      >
        <SlArrowDown size={28} />
      </div> */}
      {placeData.length !== 0 ? (
        <div
          className={`dark:bg-gray-150 z-20 flex ${placeData.length < 3 ? "h-fit" : "no-scrollbar h-full"} overflow flex-col rounded-lg bg-white shadow-md`}
        >
          <div className="flex justify-between px-5 py-4">
            <h2 className="pt-2 text-2xl font-bold text-blue-500">
              Search Results
            </h2>
            <button
              type="button"
              className="text-md hidden rounded-md px-4 py-2 text-center hover:font-bold hover:text-red-500 hover:transition hover:duration-300 lg:block"
              onClick={() => toggleResults(!resultsToggle)}
            >
              &lt; Close Search Results
            </button>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => toggleResults(!resultsToggle)}
            >
              <SlArrowDown className="text-2xl" />
            </button>
          </div>
          <h3 className="text-1xl px-5">
            <FaSearch className="mb-1 mr-2 inline-block" />
            <span>
              <span className="font-bold">{placeData.length}</span> Results for
              "{searchText}" in a{" "}
              <span className="font-bold">
                {convertRadius()} {unit.toLowerCase()}
              </span>{" "}
              radius
            </span>
          </h3>
          <div className="h-[400px] lg:h-auto lg:no-scrollbar flex-grow overflow-y-scroll px-3 py-4">
            {placeData.map((result, index) => (
              <div key={result.placeId}>
                <PlaceCard place={result} isResult={true} index={index} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="dark:bg-gray-150 z-20 flex h-fit flex-col rounded-lg bg-white pb-10 shadow-md">
          <div className="flex justify-between px-5 py-4">
            <h2 className="pt-2 text-2xl font-bold text-blue-500">
              Search Results
            </h2>{" "}
            {/* trip name? */}
            <button
              type="button"
              className="text-md hidden rounded-md px-4 py-2 text-center hover:font-bold hover:text-red-500 hover:transition hover:duration-300 lg:block"
              onClick={() => toggleResults(!resultsToggle)}
            >
              &lt; Close Search Results
            </button>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => toggleResults(!resultsToggle)}
            >
              <SlArrowDown className="text-2xl" />
            </button>
          </div>
          {/* <h3 className="text-1xl px-5">
          <span className="font-bold">Number of Results</span>:{" "}
          {placeData.length}
        </h3> */}
          <div className="flex-grow overflow-y-scroll px-3 py-4">
            <p className="text-center text-xl">
              No results {searchText ? ` for "${searchText}"` : ""} found in
              this area.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
