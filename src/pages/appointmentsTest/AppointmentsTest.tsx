import { useCallback, useEffect, useState } from "react";
import LayoutCard from "../layouts/LayoutCard";
import {
  NOT_DENTIST,
  UserRoles,
  stringToDateAndTime,
} from "../../utils/Extensions";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Strings from "../../utils/Strings";
import "../../index.css";
import { endOfMonth, startOfMonth, startOfToday } from "date-fns";
import Constants from "../../utils/Constants";
import { useGetAppointmentsByBranchOfficeCalendarMutation } from "../../services/appointmentService";
import useSessionStorage from "../../core/sessionStorage";
import { Select } from "antd";
import ClickedDateModal from "./components/OnClickDateModal";
import SelectedEventModal from "./components/SelectedEventModal"; 
import CalendarAppointmentEvent from "../../data/appointment/calendar.appointment.event ";

const localizer = dayjsLocalizer(dayjs);

interface AppointmentsProps {
  rol: UserRoles;
}

const AppointmentsTest = (props: AppointmentsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [getAppointmentsByBranchOffice] = useGetAppointmentsByBranchOfficeCalendarMutation();
  const [displayedDate, setDisplayedDate] = useState<Date>(startOfToday());
  const [branchId, setBranchId] = useSessionStorage(Constants.BRANCH_ID, 0);
  const [calendarEvents, setCalendarEvents] = useState<CalendarAppointmentEvent[]>([]);
  const [currentDateText, setCurrentDateText] = useState<string>("");
  const [key, setKey] = useState(0);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarAppointmentEvent | null>(null);
  const [isClickedDateModalVisible, setIsClickedDateModalVisible] = useState(false);
  const [isSelectedEventModalVisible, setIsSelectedEventModalVisible] = useState(false);
  const { Option } = Select;
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);





  const handleFilterChange = useCallback((value: string) => {
    if (value === null || value === Constants.EMPTY_VALUE) {
      setFilterStatus(undefined);
    } else {
      setFilterStatus(value);
    }
  }, []);

  const getCalendarAppointmets = async () => {
    try {
      setIsLoading(true);
  
      const startOfMonthDate = startOfMonth(displayedDate);
      const endOfMonthDate = endOfMonth(displayedDate);
      
      const requestBody = {
        id: Number(branchId),
        status: filterStatus,
        date1: dayjs(startOfMonthDate).format("YYYY-MM-DD"),
        date2: dayjs(endOfMonthDate).format("YYYY-MM-DD"),
      };

      const responseProcess = await getAppointmentsByBranchOffice(requestBody).unwrap();
  
      const events = responseProcess.map((event) => {
        const dentist ="Dr@ " +(event.dentist?.name ? event.dentist?.name : Strings.notAssigned) +" " +(event.dentist?.lastname ? event.dentist?.lastname : " ");
        const patient =". " +(event.patient?.name ? event.patient?.name : Strings.notAssigned) +" " +(event.patient?.lastname ? event.patient?.lastname : " ") +
        " " +(event.patient?.secondLastname ? event.patient?.secondLastname: " ");
        const folioPatient =" Folio:" + (event.patient?.folio ? event.patient.folio : "NA");
        const phone =" Tel: " +(event.patient?.primaryContact || event.patient?.secondaryContact || "N/A ");
        const prospect = event.appointment?.prospectId ? "Prospecto" : Constants.EMPTY_VALUE;
        const information = dentist + patient + folioPatient + phone + prospect;        
        const startDate = stringToDateAndTime(event.appointment?.appointment, event.appointment?.time);
        const endDate = stringToDateAndTime(event.appointment?.appointment, event.appointment?.time);
  
        const color = event.dentist?.dentistColor || NOT_DENTIST;
        const status = event.appointment?.status || Constants.EMPTY_VALUE;

  
        return new CalendarAppointmentEvent(
          information,
          startDate,
          endDate,
          color,
          status
        );
      });
  
      setCalendarEvents(events);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getCalendarAppointmets();
  }, [displayedDate, filterStatus]);

 
  const handleNavigate = (newDate: Date, view: string) => {
    setDisplayedDate(newDate);
    setCurrentDateText(dayjs(newDate).format("MMMM YYYY")); 
  };

  const eventStyleGetter = (event: CalendarAppointmentEvent) => {
    let backgroundColor = "#" + event.color;
    let style = {};
    if (event.color === NOT_DENTIST) {
      style = {
        color: "black",
        border: "1px solid black",
      };
    }

    if (event.status === Constants.STATUS_CANCELLED || event.status === Constants.STATUS_NOT_ATTENDED) {
      backgroundColor = "gray";
    }

    return {
      style: {
        ...style,
        backgroundColor,
      },
    };
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setClickedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsClickedDateModalVisible(true);
    setIsSelectedEventModalVisible(false);
    disableBodyScroll();
  };

  const handleSelectEvent = (event: CalendarAppointmentEvent) => {
    setClickedDate(event.start);
    setSelectedEvent(event);
    setIsSelectedEventModalVisible(true);
    setIsClickedDateModalVisible(false);
    disableBodyScroll();
  };

  const handleModalCancel = () => {
    setIsClickedDateModalVisible(false);
    setIsSelectedEventModalVisible(false);
    enableBodyScroll();
  };


  return (
    <LayoutCard
      title={Strings.appointmentsTest}
      isLoading={isLoading}
      content={
        <div className="p-4">
          <Select
            style={{ width: 120, marginBottom: 16 }}
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <Option value={Constants.EMPTY_VALUE}>{Strings.reset}</Option>
            <Option value={Constants.STATUS_ACTIVE}>{Strings.active}</Option>
            <Option value={Constants.STATUS_PROCESS}>{Strings.inProcess}</Option>
            <Option value={Constants.STATUS_FINISHED}>{Strings.finsished}</Option>
            <Option value={Constants.STATUS_NOT_ATTENDED}>{Strings.notAttended}</Option>
          </Select>
          <Calendar
            key={key}
            selectable={true}
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "500px", width: "100%" }}
            onNavigate={(date, view) => handleNavigate(date, view)}
            eventPropGetter={eventStyleGetter}
            defaultView="day"
            defaultDate={displayedDate}
            min={Constants.MIN} 
            max={Constants.MAX}
            onSelectSlot={handleSelectSlot} 
            onSelectEvent={handleSelectEvent}
            onSelecting={() => true}
            components={{
              toolbar: (props) => (
                <div className="flex justify-between items-center mb-4">
                  <div className="flex mt-2 ml-2">
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 rounded-l-full border-none focus:outline-none"
                      onClick={() => props.onNavigate("TODAY")}
                    >
                      {Strings.today}
                    </button>
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 border-none focus:outline-none"
                      onClick={() => props.onNavigate("PREV")}
                    >
                      {Strings.prev}
                    </button>
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 rounded-r-full border-none focus:outline-none"
                      onClick={() => props.onNavigate("NEXT")}
                    >
                      {Strings.next}
                    </button>
                  </div>
                  <div
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {props.label}
                  </div>
                  <div className="flex mt-2 mr-2">
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 rounded-l-full border-none focus:outline-none"
                      onClick={() => props.onView("month")}
                    >
                      {Strings.month}
                    </button>
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 border-none focus:outline-none"
                      onClick={() => props.onView("week")}
                    >
                      {Strings.week}
                    </button>
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 border-none focus:outline-none"
                      onClick={() => props.onView("day")}
                    >
                      {Strings.day}
                    </button>
                    <button
                      className="bg-secondary hover:bg-calendar text-white px-4 py-2 rounded-r-full border-none focus:outline-none"
                      onClick={() => props.onView("agenda")}
                    >
                      {Strings.agenda}
                    </button>
                  </div>
                </div>
              ),
            }}
          />
         <ClickedDateModal
            isVisible={isClickedDateModalVisible}
            onCancel={() => setIsClickedDateModalVisible(false)}
            clickedDate={clickedDate}
          />
          <SelectedEventModal
            isVisible={isSelectedEventModalVisible}
            onCancel={() => setIsSelectedEventModalVisible(false)}
            selectedEvent={selectedEvent}
          />
        </div>
      }
    />
  );
};

export default AppointmentsTest;


function disableBodyScroll() {
  document.body.style.overflow = 'hidden';
}

function enableBodyScroll() {
  document.body.style.overflow = 'visible';
}