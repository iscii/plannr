import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import { FaGripLines } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { TbMapUp } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import { SlArrowDown } from "react-icons/sl";

import { Button } from "@mui/material";
import { TripContext } from "../../contexts/TripContext";
import PlaceCard, { PlaceCardRef } from "../PlaceCard";

interface TripWindowProps {
  tripToggle: boolean;
  toggleTrip: React.Dispatch<React.SetStateAction<boolean>>;
  classNames: string;
}

export default function TripWindow({
  tripToggle,
  toggleTrip,
  classNames,
}: TripWindowProps): React.ReactElement {
  const { currentTrip, hasChanges, savingTrip, onSortEnd, saveTrip } =
    React.useContext(TripContext);
  const [shareTooltipCopied, setShareTooltipCopied] =
    React.useState<boolean>(false);

  // doesn't work only bc the entire component gets replaced in Home when toggle is called. gotta delay, same way done with authmodals.
  const unloadWindow = () => {
    document.getElementById("tripWindow")?.classList.remove("load-slide-up");
    document.getElementById("tripWindow")?.classList.add("unload-slide-up");

    document.getElementById("tripWindow")?.classList.remove("load-slide-right");
    document.getElementById("tripWindow")?.classList.add("unload-slide-right");
    toggleTrip(!tripToggle);
  };

  const createShareLink = () => {
    const baseUrl = window.location.href.split("?")[0];
    const placeIds = currentTrip.map((place) => place.placeId);
    const shareLink = `${baseUrl}?places[]=${placeIds.join("&places[]=")}`;
    navigator.clipboard.writeText(shareLink);
    setShareTooltipCopied(true);
  };

  const openInMaps = () => {
    // https://developers.google.com/maps/documentation/urls/get-started#directions-action
    const baseUrl = "https://www.google.com/maps/dir/?api=1";

    if (currentTrip.length === 0) return window.open(baseUrl, "_blank");

    const placeIds = currentTrip.map((place) =>
      encodeURIComponent(place.placeId),
    );
    const placeNames = currentTrip.map((place) =>
      encodeURIComponent(place.title),
    );
    const originQP = `origin=${placeNames[0]}&origin_place_id=${placeIds[0]}`;

    if (placeIds.length === 1)
      return window.open(`${baseUrl}&${originQP}`, "_blank");

    const destinationQP = `destination=${placeNames[placeNames.length - 1]}&destination_place_id=${placeIds[placeIds.length - 1]}`;
    const waypointsQP = `waypoints=${placeNames.slice(1, placeNames.length - 1).join("|")}&waypoint_place_ids=${placeIds.slice(1, placeIds.length - 1).join("|")}`;
    const mapsLink = `${baseUrl}&${originQP}&${destinationQP}&${waypointsQP}`;
    window.open(mapsLink, "_blank");
  };

  return (
    <aside
      id="tripWindow"
      onClick={(e) => e.stopPropagation()}
      className={`trip top-inherit left-inherit load-slide-up load-slide-right absolute bottom-0 left-full z-10 p-2 pb-4 lg:fixed lg:left-auto ${classNames} lg:bottom-auto lg:right-12 lg:z-20 lg:ml-2 lg:mr-0 lg:p-0 ${currentTrip.length < 3 ? "lg:h-fit" : "lg:h-4/5"} w-full rounded-lg opacity-90 lg:w-1/3 lg:pb-12 lg:pl-10`}
    >
      {/* move this conditional into just the cards so we don't have to repeat some elements */}
      <div
        className={`dark:bg-gray-150 z-20 flex ${currentTrip.length < 3 ? "h-fit pb-10" : "h-full"} flex-col rounded-lg bg-white shadow-md`}
      >
        <div className="flex justify-between px-5 py-4">
          {/* trip name? */}
          <div className="flex w-1/2 flex-row">
            <h2 className="pt-2 text-2xl font-bold text-blue-500">Your Trip</h2>
            <Tooltip
              anchorSelect=".share-tooltip"
              place="top"
              afterHide={() => setShareTooltipCopied(false)}
            >
              {shareTooltipCopied ? "Copied!" : "Share Trip"}
            </Tooltip>
            <button
              className="share-tooltip ml-2 pt-2 hover:text-blue-500"
              onClick={() => createShareLink()}
            >
              {<FaShare size={22} />}
            </button>
            <Tooltip anchorSelect=".open-in-map-tooltip" place="top">
              {"Open In Google Maps"}
            </Tooltip>
            <button
              className="open-in-map-tooltip ml-2 pt-2 hover:text-blue-500"
              onClick={() => openInMaps()}
            >
              {<TbMapUp size={22} />}
            </button>
          </div>
          <button
            type="button"
            className="text-md hidden rounded-md px-4 py-2 text-center hover:font-bold hover:text-red-500 hover:transition hover:duration-300 lg:block"
            onClick={() => unloadWindow()}
          >
            Close Trip Window &gt;
          </button>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => unloadWindow()}
          >
            <SlArrowDown className="text-2xl" />
          </button>
        </div>
        {hasChanges && (
          <div className="justify-left flex px-5 pb-1">
            {savingTrip ? (
              <p className="pb-1 text-red-500">Saving...</p>
            ) : (
              <>
                <p className="pb-1 text-red-500">You have unsaved changes!</p>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => saveTrip()}
                  endIcon={<SaveIcon />}
                  className="text-md rounded-md px-8 !pt-0 text-center hover:font-bold hover:text-red-500 hover:transition hover:duration-300"
                >
                  Save
                </Button>
              </>
            )}
          </div>
        )}
        {currentTrip.length !== 0 ? (
          <>
            <h3 className="text-1xl px-5">
              <span className="font-bold">Places in Trip</span>:{" "}
              {currentTrip.length}
            </h3>
            <div className="lg:no-scrollbar h-[400px] flex-grow overflow-y-scroll px-3 py-4">
              <SortableList
                onSortEnd={onSortEnd}
                className="list"
                draggedItemClassName="dragged"
                lockAxis="y"
              >
                {currentTrip.map((result, i) => (
                  <SortableItem key={result.placeId}>
                    <PlaceCardRef>
                      {/* wraps a div around placecard */}
                      <PlaceCard place={result} isResult={false}>
                        <SortableKnob>
                          <div className="col-span-1 row-span-2 flex cursor-pointer select-none flex-col items-center justify-center">
                            <FaGripLines size={20} />
                            {i + 1}
                          </div>
                        </SortableKnob>
                      </PlaceCard>
                    </PlaceCardRef>
                  </SortableItem>
                ))}
              </SortableList>
            </div>
          </>
        ) : (
          <div className="flex-grow overflow-y-scroll px-3 py-4">
            <p className="text-center text-xl">
              No places in trip yet!
              <br />
              Use the search results on the left to build an itinerary.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
