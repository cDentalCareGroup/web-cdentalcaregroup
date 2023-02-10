import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { useState } from "react";
import { dayName, monthName } from "../../utils/Extensions";
import Spinner from "./Spinner";



const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};


interface CalendarProps {
  availableHours: string[];
  handleOnSelectDate: (date: Date) => void;
  handleOnSelectTime: (date: any) => void;
  isLoading: Boolean;
  validateTime: boolean;
  orientation?: string;
}
const Calendar = ({ availableHours, handleOnSelectDate, isLoading, handleOnSelectTime, orientation, validateTime }: CalendarProps) => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const [showError, setShowError] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const previousMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    const res = format(firstDayNextMonth, "MMM-yyyy");
    setCurrentMonth(res);
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const isNotBeforeToday = (day: Date): Boolean => {
    return !isBefore(day, add(new Date(), { days: -1 }));
  };

  const validateHours = (data: string[]): string[] => {
    if (!validateTime) {
      return data;
    }
    if (selectedDay.getDate() != (new Date()).getDate()) {
      return data;
    }
    const splitDate = new Date().toLocaleString('en-GB').split(',')[1].split(':')
    const hour = splitDate[0]
    let newData: string[] = []
    data.forEach((value, index) => {
      const hourToCheck = value.split(':')[0]
      if (parseInt(hourToCheck) >= parseInt(hour)) {
        newData.push(value)
      }
    });
    return newData
  }

  const handleOnDay = (day: Date) => {
    const name = dayName(day);
    if (name != 'Domingo') {
      setShowError(false);
      handleOnSelectDate(day);
    } else {
      setShowError(true);
    }
    setSelectedDay(day);
    setSelectedTime('');
  }

  const validateMonths = (data: string): Boolean => {
    const currentMonth = format(new Date(), "MMM-yyyy");
    const year = Number(data.split("-")[1]);
    const currentYear = Number(currentMonth.split("-")[1]);
    return (year == currentYear)
  }

  const buildDateToDisplay = (): JSX.Element => {

    const dayname = dayName(selectedDay);
    const day = selectedDay.getDate();
    const monthname = monthName(selectedDay);
    const hasSchedules = validateHours(availableHours).length != 0;

    return (
      hasSchedules ? <div className="flex flex-col">
        <span className="text text-sm text-gray-500">Horarios disponibles</span>
        <span>{`${dayname} ${day}, ${monthname} ${selectedDay.getFullYear()}`}</span>
      </div> : <div className="flex flex-col items-center justify-center mt-20">
        <span className="text text-sm text-gray-500">No hay horarios disponibles para la fecha: </span>
        <span>{`${dayname} ${day}, ${monthname} ${selectedDay.getFullYear()}`}</span>
      </div>
    )
  }

  const AvailabilityHoursInDay = () => {
    if (isLoading) {
      return <div className="flex w-full h-full items-center justify-center"><Spinner /></div>
    }
    if (showError) {
      return <div className="flex w-full h-full items-center justify-center">
        <span className="text-sm text-gray-500">La sucursal no abre los Domingos.</span>
      </div>
    }
    return (
      <>
        <h2 className="font-semibold text-gray-900">
          {buildDateToDisplay()}
        </h2>
        <div className="mt-4 space-y-1 text-sm leading-6 text-gray-500 max-h-96 overflow-scroll">
          {validateHours(availableHours).map((value, index) => (
            <div onClick={() => {
              handleOnSelectTime(value)
              setSelectedTime(value)
            }} key={index} className={`flex flex-auto items-center px-4 cursor-pointer py-2 space-x-4 group rounded-xl ${selectedTime == value ? 'border bg-blue-800 text-white' : 'border border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white'}`}>
              {value}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className={orientation == 'vertical' ? "md:grid md:grid-cols-1" : "md:grid md:grid-cols-2 md:divide-x md:divide-gray-200"}>
          <div className={orientation == 'vertical' ? "" : "md:pr-14"}>
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {`${monthName(firstDayCurrentMonth)} ${firstDayCurrentMonth.getFullYear()}`}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none border-none items-center bg-white cursor-pointer justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                 {validateMonths(currentMonth) && <RiArrowLeftSLine className="w-5 h-5" aria-hidden="true" />}
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none border-none bg-white cursor-pointer items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <RiArrowRightSLine className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
              <div>D</div>
              <div>L</div>
              <div>M</div>
              <div>M</div>
              <div>J</div>
              <div>V</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "py-1.5"
                  )}
                >
                  {isNotBeforeToday(day) ? (
                    <button
                      type="button"
                      onClick={() => handleOnDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && "text-white",
                        !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-blue-800",
                        !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-900",
                        !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                        isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-blue-800",
                        isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-blue-800",
                        !isEqual(day, selectedDay) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                        "mx-auto flex h-8 w-8 items-center bg-white cursor-pointer justify-center rounded-full border-none"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>
                  ) : (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center line-through text-red-900">
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <section className={orientation == 'vertical' ? "mt-12" : "mt-12 md:mt-0 md:pl-14"}>
            {AvailabilityHoursInDay()}
          </section>
        </div>
      </div>
    </div>
  );
};

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default Calendar;