"use client";
import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: null, to: null };

const ReservationContextProvider = ({ children }) => {
  const [range, setRange] = useState(initialState);

  const resetRange = () => {
    setRange({ from: null, to: null });
  };

  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);

  if (context === undefined) {
    throw new Error("Context was used outside Provider.");
  }

  return context;
};

export default ReservationContextProvider;
