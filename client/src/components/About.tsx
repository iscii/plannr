import React from "react";

import { useNavigate } from "react-router-dom";

export const unloadModal = (navigate: Function) => {
  const modal = document.getElementById("modal");
  modal?.classList.remove("load-slide-fast");
  modal?.classList.add("unload-slide-fast");
  setTimeout(() => {
    navigate("/");
  }, 250);
};

export default function About(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div
      className="absolute left-0 top-0 z-40 h-screen w-screen opacity-100"
      onClick={() => unloadModal(navigate)}
    >
      <div
        id="modal"
        className="load-slide-fast absolute inset-y-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-wrap content-center justify-center bg-white opacity-90 duration-75 lg:w-3/4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2/4 w-3/4 lg:w-2/4">
          <span
            onClick={() => unloadModal(navigate)}
            className="back-link mb-12 block cursor-pointer lg:mb-0"
          >
            &lt; Back to plannr
          </span>
          <div className="overflow-y-auto h-full">
            <h1 className="pt-10 text-3xl font-bold">About Plannr</h1>
            <p className="text-3x1 pt-2">
              Team: Lena Kastell, Matt Oyales, Kimberly Tsang, Jackey Yang, and
              Issac Zheng
            </p>
            <p className="text-3x1 pt-4">
              Ever feel like you just can't make a plan? Feel like you have no
              idea what to do? We are here to help with that! We're taking
              Google Maps data to provide you with an easy-to-use trip-planning
              app. The app takes a given location and filtering parameters as
              its input to identify nearby locations that match the user's
              criteria. After that, select the location(s) you would like to go
              to and we will provide the routes to reach your destination(s)!
            </p>
            <p className="text-3x1 pt-6">
              Plannr is a site that will be powered by Google Maps, providing
              our users with a way to drop a pin on the map to a desired
              location that you would like to search. Select a radius around the
              pin location and use a search bar to pass in filters such as the
              price range, and we will provide a list of all available locations
              that you can select based on your query.
            </p>
            <p className="text-3x1 pt-14 text-blue-500">
              Want to get started? Sign up by creating an account with us, or
              continue as Guest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
