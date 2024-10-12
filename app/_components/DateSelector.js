"use client";
import { DayPicker } from "react-day-picker";
import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";
import { useReservation } from "./ReservationContext";
import "react-day-picker/dist/style.css";

// don't need this function because I use excludeDates prop on DayPicker
// function isAlreadyBooked(range, datesArr) {
//   return (
//     range.from &&
//     range.to &&
//     datesArr.some((date) => isWithinInterval(date, { start: range.from, end: range.to }))
//   );
// }

function DateSelector({ settings, bookedDates, cabin }) {
  const { range, setRange, resetRange } = useReservation();

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(range?.to, range?.from);
  const totalPrice = numNights * (regularPrice - discount);

  // FROM USER SETTINGS
  const minBookingLength = settings.minBookingLength;
  const maxBookingLength = settings.maxBookingLength;


  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        hideNavigation
        className="pt-12 place-self-center"
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        onSelect={setRange}
        selected={range}
        excludeDisabled
        disabled={(currDate) => isPast(currDate) || bookedDates.some((date) => isSameDay(date, currDate))}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${totalPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
