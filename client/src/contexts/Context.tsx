import React from "react";
import { AuthProvider } from "./AuthContext";
import { PlaceProvider } from "./PlaceContext";
import { SearchResultProvider } from "./SearchResultContext";
import { TripProvider } from "./TripContext";

const providers = [AuthProvider, TripProvider, SearchResultProvider, PlaceProvider];

/**
 * This component is used to wrap the entire application with all the context providers.
 */
export function ContextProvider({ children }: { children: React.ReactNode }) {
  return providers.reduce((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
}
