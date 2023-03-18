import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { ControllerRenderProps, UseFormRegisterReturn } from "react-hook-form";

export const DatePicker = ({ onChange, value, name }: Without<ControllerRenderProps, "ref">) => {
  const calendarRef = useRef<HTMLDivElement | undefined>();
  const { days, goToNextMonth, goToPreviousMonth, isDayInFocusedMonth, focusedDay, setFocusedDay } =
    useCalendar(value ?? undefined);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsCalendarVisible(false);
  }, []);

  useEffect(() => {
    onChange(focusedDay.toISOString());
  }, [focusedDay]);

  return (
    <>
      <input
        className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
        onFocus={() => setIsCalendarVisible((v) => !v)}
        name={name}
        value={!!value ? value : ""}
        onChange={onChange}
      />
      {isCalendarVisible ? (
        <div className="h-64 w-64 border border-gray-400 bg-malibu-900 text-white rounded-lg grid grid-cols-7 grid-rows-7 text-center p-2 absolute z-50 top-[7.25rem]">
          <div className="col-span-7 row-span-1 flex justify-between">
            <span
              onClick={(e) => {
                e.preventDefault();
                goToPreviousMonth();
              }}
            >
              prev
            </span>
            <span>{focusedDay.format("MMM YYYY")}</span>
            <span
              onClick={(e) => {
                e.preventDefault();
                goToNextMonth();
              }}
            >
              next
            </span>
          </div>
          <span className="col-span-1 row-span-1">S</span>
          <span className="col-span-1 row-span-1">M</span>
          <span className="col-span-1 row-span-1">T</span>
          <span className="col-span-1 row-span-1">W</span>
          <span className="col-span-1 row-span-1">T</span>
          <span className="col-span-1 row-span-1">F</span>
          <span className="col-span-1 row-span-1">S</span>

          {days.map((day) => (
            <span
              key={day.format("MM-DD-YYYY")}
              className={`col-span-1 row-span-1 ${
                isDayInFocusedMonth(day) ? "text-white" : "text-gray-400"
              }`}
              data-date={day.format("MM-DD-YYYY")}
              onClick={(e) => {
                if (e.target instanceof HTMLSpanElement && e.target.dataset.date) {
                  e.preventDefault();
                  setFocusedDay(e.target.dataset.date);
                  handleClose();
                }
              }}
            >
              {day.get("date")}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
};

function useCalendar(defaultDate?: string | Dayjs) {
  defaultDate = dayjs(defaultDate);
  const [date, setDate] = useState(defaultDate);
  const days = getDaysInMonth(date);

  const goToNextMonth = (..._any: any) => {
    setDate((oldDate) => oldDate.add(1, "month"));
  };

  const setFocusedDay = (newDate: string | Dayjs) => {
    setDate(dayjs(newDate));
  };

  const goToPreviousMonth = (..._any: any) => {
    setDate((oldDate) => oldDate.subtract(1, "month"));
  };

  const isDayInFocusedMonth = (day: Dayjs) => {
    const startOfMonth = date.startOf("month");
    const endOfMonth = date.endOf("month");
    return (
      day.isSame(startOfMonth) ||
      day.isSame(endOfMonth) ||
      (day.isAfter(startOfMonth) && day.isBefore(endOfMonth))
    );
  };

  return {
    days,
    goToPreviousMonth,
    goToNextMonth,
    focusedDay: date,
    isDayInFocusedMonth,
    setFocusedDay,
  };
}

function getDaysInMonth(date?: Dayjs) {
  date = dayjs(date);
  const startOfMonth = date.startOf("month");
  let amountOfDaysToRender = 7 * 6;
  const datesToRender: Array<Dayjs> = [];
  // backfill first row
  while (startOfMonth.get("day") > datesToRender.length) {
    const difference = startOfMonth.get("day") - datesToRender.length;
    const dayToAddFromLastMonth = startOfMonth.subtract(difference, "days");

    datesToRender.push(dayToAddFromLastMonth);
  }

  for (let i = 0; i < date.daysInMonth(); i++) {
    const dayToAdd = startOfMonth.clone().add(i, "days");

    datesToRender.push(dayToAdd);
  }

  // fill remaining of days with next months days
  while (datesToRender.length < amountOfDaysToRender) {
    const lastDaySoFar = datesToRender.slice(-1)[0];
    const dayToAddFromNextMonth = lastDaySoFar.clone().add(1, "day");

    datesToRender.push(dayToAddFromNextMonth);
  }

  return datesToRender;
}
