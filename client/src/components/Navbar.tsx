import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import logo_cropped from "../assets/logo_cropped.png";
import NavDropdown from "./NavDropdown";

export default function NavBar(): React.ReactElement {
  const wordsList: string[] = [
    " go on a date",
    " take a hike",
    " eat at a restaurant",
    " hit a bar",
    " sing karaoke",
    " play games with friends",
    " try a new coffee shop",
    " get some boba",
    " explore the city",
    " check out a museum",
    " discover a new park",
    " go to a concert",
  ];

  return (
    <header className="fixed w-full bottom-0 z-20 h-16 lg:static lg:bottom-auto lg:h-auto lg:block bg-white">
      <nav
        className="p-2 lg:mx-auto flex lg:max-w-7xl items-center justify-end lg:justify-between lg:px-8"
        aria-label="Global"
      >
        <div className="hidden lg:flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            {/* <img className="h-14 w-auto" src={logo_transparent} alt=""></img> */}
            <img
              className="h-14 w-auto rounded-full"
              src={logo_cropped}
              alt=""
            ></img>
          </Link>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-3xl">
            Today, I want to
            <span className="text-3xl font-bold text-blue-500">
              <Typewriter
                words={wordsList}
                loop={Infinity}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={70}
                delaySpeed={1000}
              />
            </span>
          </h1>
        </div>
        <NavDropdown />
      </nav>
    </header>
  );
}
