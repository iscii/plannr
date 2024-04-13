import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "react-simple-typewriter/dist/index";

import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import { RiEditCircleLine } from "react-icons/ri";
import { SlArrowUp } from "react-icons/sl";

import { Slider } from "@mui/material";
import nearbySearch from "../api/GoogleMaps/nearbySearch";
import Directions from "../components/directions/Directions";
import SearchResults from "../components/home/SearchResults";
import TripWindow from "../components/home/TripWindow";
import Navbar from "../components/Navbar";
import {
  radius as DEFAULT_RADIUS,
  EPlaces,
  Units,
  libsArr,
  pinSVGFilled,
  placeKeys,
  travelModeKeys,
} from "../constants/GoogleMaps/config";
import { MapContext } from "../contexts/MapContext";
import { SearchResultContext } from "../contexts/SearchResultContext";
import { TripContext } from "../contexts/TripContext";
import { CircleData } from "../dataObjects/CircleData";
import { PlaceData } from "../dataObjects/PlaceData";
import { PlanMarkerData } from "../dataObjects/PlanMarkerData";
import { HomeProps } from "../types/HomeTypes";

const underScoreRegex = new RegExp("_", "g");

export default function Home(props: HomeProps): React.ReactElement {
  const { mapRef } = useContext(MapContext);
  const [centerData, setCenterData] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral
  >({ lat: 40.74273, lng: -74.038 });
  const [circleData, setCircleData] = useState<CircleData>();
  const [resultsToggle, toggleResults] = useState(false);
  const [placeData, setPlaceData] = useState<Array<PlaceData>>([]);
  const [tripToggle, toggleTrip] = useState(false);
  const [markerData, setMarkerData] = useState<Array<PlanMarkerData>>([]);
  const [typeData, setTypeData] = useState<string>("");
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>();
  const [keyWordData, setKeyWordData] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [currentUnit, setCurrentUnit] = useState<Units>(Units.KM);
  const [radiusSliderToggle, toggleRadiusSlider] = useState(false);
  const { currentInfoWindow, setInfoWindow: setSearchWindow } =
    useContext(SearchResultContext);
  const { currentTrip, setInfoWindow: setTripWindow } = useContext(TripContext);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: String(import.meta.env.VITE_MAPS_API_KEY),
    libraries: libsArr,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setCircleData(undefined);
    setPlaceData([]);
    setMarkerData([]);
    mapRef.current = map;
  }, []);

  const updateWindows = useCallback((index: number) => {
    setSearchWindow(index);
    setTripWindow(-1);
  }, []);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const center = mapRef.current?.getCenter();

    if (
      event.currentTarget.searchBar.value != keyWordData ||
      event.currentTarget.categories.value != typeData ||
      center != centerData ||
      event.currentTarget.travel_mode.value != travelMode
    ) {
      setSearchText(event.currentTarget.searchBar.value);
      setKeyWordData(event.currentTarget.searchBar.value);
      setTypeData(event.currentTarget.categories.value);
      setTravelMode(event.currentTarget.travel_mode.value);
      setCircleData(undefined);
      setPlaceData([]);
      setMarkerData([]);

      if (center) {
        setCenterData(center);
        setCircleData(
          new CircleData(
            centerData,
            circleData?.radius ? circleData.radius : DEFAULT_RADIUS,
          ),
        );
      }

      toggleResults(true);
      toggleTrip(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setSearchWindow(-1);
        nearbySearch(
          mapRef,
          centerData,
          circleData,
          keyWordData,
          typeData,
          setPlaceData,
        );
      } catch (e) {
        console.log(e);
      }
    }

    if (resultsToggle) {
      fetchData();
    }
  }, [keyWordData, typeData, centerData, travelMode]);

  return (
    <div className="flex h-screen flex-col">
      {props.children /* modal */}
      <Navbar />
      {isLoaded ? (
        <div className="flex flex-grow">
          <GoogleMap
            mapContainerStyle={{ width: "100vw" }}
            center={centerData}
            zoom={15}
            id={"WEBSITE_MAP"}
            onLoad={onLoad}
            options={{
              gestureHandling: "greedy",
            }}
          >
            {/* Map crosshair */}
            <AddIcon className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-2xl text-blue-800" />
            {/* Search Bar */}
            <form className="flex justify-center" onSubmit={search}>
              <input
                type="search"
                id="searchBar"
                name="searchBar"
                placeholder="Search a Place"
                className="bg-gray-40 p-50 z-10 m-3 block h-12 w-full rounded-full border border-gray-600 p-4 align-middle text-lg opacity-90 lg:w-2/6 lg:rounded-xl"
              />
              <select
                name="categories"
                id="categories"
                className="bg-gray-40 p-50 z-10 m-3 hidden w-min rounded-xl border border-gray-600 p-4 text-lg opacity-90 lg:block"
              >
                {placeKeys.map((key) => {
                  const val = EPlaces[key];
                  const text = (
                    key[0].toUpperCase() + key.substring(1, key.length)
                  ).replace(underScoreRegex, " ");
                  return (
                    <option
                      key={val.toString()}
                      id={val.toString()}
                      value={key}
                    >
                      {text}
                    </option>
                  );
                })}
              </select>
              <select
                name="travel_mode"
                id="travel_mode"
                className="bg-gray-40 p-50 z-10 m-3 hidden w-min rounded-xl border border-gray-600 p-4 text-lg opacity-90 lg:block"
                defaultValue={google.maps.TravelMode.WALKING}
                onChange={(e) =>
                  setTravelMode(e.target.value as google.maps.TravelMode)
                }
              >
                {travelModeKeys.map((key) => {
                  const val = google.maps.TravelMode[key];
                  const text =
                    key[0].toUpperCase() +
                    key.substring(1, key.length).toLowerCase();
                  return (
                    <option
                      key={val.toString()}
                      id={val.toString()}
                      value={key}
                    >
                      {text}
                    </option>
                  );
                })}
              </select>

              {/* web radius */}
              <div className="bg-gray-40 p-50 z-10 m-3 hidden w-2/12 flex-row justify-center rounded-xl border border-gray-600 p-4 text-lg lg:flex">
                <p className="text-md mr-5 rounded-xl bg-slate-100 pl-2 pr-2 text-center opacity-90">
                  Radius
                </p>
                <Slider
                  defaultValue={
                    DEFAULT_RADIUS / (currentUnit === Units.KM ? 1000 : 1609)
                  }
                  value={
                    circleData
                      ? circleData.radius /
                        (currentUnit === Units.KM ? 1000 : 1609)
                      : DEFAULT_RADIUS /
                        (currentUnit === Units.KM ? 1000 : 1609)
                  }
                  aria-label="Radius"
                  valueLabelDisplay="auto"
                  step={0.5}
                  marks
                  min={0.5}
                  max={5}
                  onChange={(e, value) => {
                    if (e) {
                    } //src/pages/Home.tsx(213,32): error TS6133: 'e' is declared but its value is never read.
                    const center = mapRef.current?.getCenter();
                    if (value && center) {
                      setCenterData(center);
                      setCircleData(
                        new CircleData(centerData, (value as number) * 1000),
                      );
                    }
                  }}
                />
              </div>

              {/* mobile radius */}
              {/* for km-mi switching, take inspo from android volume slider */}
              <div className="absolute right-4 top-4 z-10 m-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-600 lg:hidden">
                <RiEditCircleLine
                  size={22}
                  onClick={() => toggleRadiusSlider(!radiusSliderToggle)}
                />
                {radiusSliderToggle && (
                  <div className="absolute top-10 h-[200px] rounded-full border border-gray-600 bg-slate-100 py-4 opacity-90">
                    <Slider
                      defaultValue={DEFAULT_RADIUS / 1609}
                      value={
                        circleData
                          ? circleData.radius / 1609
                          : DEFAULT_RADIUS / 1609
                      }
                      aria-label="Radius"
                      valueLabelDisplay="auto"
                      step={0.5}
                      marks
                      min={0.5}
                      max={5}
                      onChange={(e, value) => {
                        if (e) {
                        }
                        const center = mapRef.current?.getCenter();
                        if (value && center) {
                          setCenterData(center);
                          setCircleData(
                            new CircleData(
                              centerData,
                              (value as number) * 1609,
                            ),
                          );
                        }
                      }}
                      sx={{
                        '& input[type="range"]': {
                          WebkitAppearance: "slider-vertical",
                        },
                      }}
                      orientation="vertical"
                    />
                  </div>
                )}
              </div>

              <select
                name="units"
                id="units"
                className="bg-gray-40 p-50 z-10 m-3 hidden w-min rounded-xl border border-gray-600 p-4 text-lg opacity-90 lg:block"
                defaultValue={Units.KM}
                onChange={(e) => {
                  const center = mapRef.current?.getCenter();

                  if (center) {
                    setCenterData(center);
                  }

                  setCurrentUnit(e.target.value as Units);
                  if (circleData) {
                    if (e.target.value === Units.KM) {
                      // convert to km
                      setCircleData(
                        new CircleData(centerData, circleData.radius / 1.609),
                      );
                    } else {
                      // convert to miles
                      setCircleData(
                        new CircleData(centerData, circleData.radius * 1.609),
                      );
                    }
                  }
                }}
              >
                <option value={Units.KM}>km</option>
                <option value={Units.MI}>mi</option>
              </select>
            </form>

            {/* Results Window pretend-component */}
            {resultsToggle ? (
              <SearchResults
                placeData={placeData}
                resultsToggle={resultsToggle}
                toggleResults={toggleResults}
                searchText={searchText}
                radius={circleData ? circleData.radius : DEFAULT_RADIUS}
                unit={currentUnit}
              />
            ) : (
              // how should i do this? i want to keep it one component that slides up and down but this is toggle. gotta revamp a lil much of the UI
              <aside
                id="showSearchResultsButton"
                className="results top-inherit left-inherit load-slide-up load-slide-left w-full fixed bottom-0 z-20 rounded-lg p-2 opacity-90 lg:bottom-auto lg:w-1/6 lg:left-2 lg:ml-2 lg:mr-0 lg:h-4/5"
              >
                <div
                  className={`dark:bg-gray-150 z-20 hidden flex-col rounded-lg bg-white p-5 shadow-md lg:flex`}
                >
                  <SearchIcon className="hidden text-2xl text-blue-500 lg:inline" />
                  <p
                    className="toggle-button text-center text-lg"
                    onClick={() => toggleResults(true)}
                  >
                    Show Search Results &gt;
                  </p>
                </div>
                <div
                  className="lg:hidden flex h-[30px] w-full items-center justify-center rounded-xl bg-white opacity-90"
                  onClick={() => toggleResults(true)}
                >
                  <SlArrowUp size={28} />
                </div>
              </aside>
            )}

            {/* Trip Window pretend-component */}
            {tripToggle ? (
              <TripWindow tripToggle={tripToggle} toggleTrip={toggleTrip} />
            ) : (
              <aside
                id="showTripWindowButton"
                className="trip top-inherit 
                left-inherit load-slide-right w-1/6 fixed right-12 z-20 hidden h-4/5 rounded-lg pb-10 opacity-90 lg:block"
              >
                <div
                  className={`dark:bg-gray-150 z-20 flex flex-col justify-items-end rounded-lg bg-white p-5 shadow-md`}
                >
                  <MapIcon className="text-2xl text-blue-500" />
                  <p
                    className="toggle-button text-center text-lg"
                    onClick={() => toggleTrip(true)}
                  >
                    &lt; Show Your Trip
                  </p>
                </div>
              </aside>
            )}

            <Directions
              travelMode={
                travelMode ? travelMode : google.maps.TravelMode.WALKING
              }
              mapRef={mapRef}
            />

            {currentInfoWindow != -1 && placeData[currentInfoWindow] ? (
              <InfoWindow
                onCloseClick={() => setSearchWindow(-1)}
                options={{
                  ariaLabel: placeData[currentInfoWindow].title,
                  position: placeData[currentInfoWindow].marker?.location,
                }}
              >
                <div className="text-center">
                  <h1 className="font-bold">
                    {placeData[currentInfoWindow].title}
                  </h1>
                  <p>{placeData[currentInfoWindow].addr}</p>
                  <p>
                    {placeData[currentInfoWindow].rating
                      ? `${placeData[currentInfoWindow].rating} ☆ (${placeData[currentInfoWindow].ratingsTotal})`
                      : "No ratings"}
                  </p>
                </div>
              </InfoWindow>
            ) : (
              <></>
            )}

            {markerData.map((result) => {
              return (
                <Marker
                  key={`(${result.location.lat()}, ${result.location.lng()})`}
                  title={result.title}
                  position={result.location}
                />
              );
            })}

            {circleData && (
              <Circle
                center={centerData}
                radius={circleData.radius}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
                }}
              />
            )}
            {placeData.map((result, ind) => {
              if (
                result.marker &&
                !currentTrip.some(({ placeId }) => placeId === result.placeId)
              ) {
                return (
                  <Marker
                    key={`(${result.marker.location.lat()}, ${result.marker.location.lng()})`}
                    title={result.marker.title}
                    position={result.marker.location}
                    label={{
                      color: "black",
                      text: String(ind + 1),
                    }}
                    onClick={() => updateWindows(ind)}
                    icon={{
                      path: pinSVGFilled,
                      anchor: new google.maps.Point(12, 17),
                      labelOrigin: new google.maps.Point(12.5, 10),
                      fillOpacity: 1,
                      fillColor: "lightblue",
                      strokeWeight: 2,
                      strokeColor: "gray",
                      scale: 2,
                    }}
                  />
                );
              }
            })}
          </GoogleMap>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      <footer className="hidden h-8 items-center justify-center bg-black text-white lg:flex">
        <p className="text-center">
          Plannr © 2023 gang gang ice cream so good, Inc.
        </p>
      </footer>
    </div>
  );
}
