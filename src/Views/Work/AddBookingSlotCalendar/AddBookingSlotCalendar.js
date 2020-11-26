import React, { useState,useEffect } from "react";
import { SessionContext } from "../../../Provider/Provider";
import CalendarComponent from "../../../Components/Calendar/Calendar";
import AddBookingSlotSideBar from "../../../Components/Booking/AddBookingSlotSidebar/AddBookingSlotSidebar";
import { search } from "../../../Services/Auth.service";
import moment from "moment";

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

const AddBookingSlotCalendar = (props) => {

  const useSession = () => React.useContext(SessionContext);
  const { user } = useSession();

  const { id_service, editRecord } = props;
  const [slots, setAllSlots] = useState([]);
  const [getSelectedDateTime, setSelectedDateTime] = useState(null);
  const [dateRange, setDateRange] = useState({});
  
  const fetchSlots = async (from_datetime, to_datetime) => {
    const params = {
      from_datetime: moment(from_datetime).format("YYYY-MM-DD hh:mm:ss"),
      to_datetime: moment(to_datetime).format("YYYY-MM-DD hh:mm:ss")
    };
    console.log("params", params);
    const response = await search("/slot/list", params).catch((err) => {
      console.log("error", err);
    });
    
    
    if (response) {
      handleResponse(response);
    }
  }

  const handleResponse = (data) => {
    let tempArray = [];
    data["available_slots"] && data["available_slots"].forEach((slot) => {
      tempArray.push({
        groupId: "availableForMeeting",
        start: moment(slot.startDate).toISOString(),
        end: moment(slot.endDate).toISOString(),
        display: "background",
        // constraint: 'availableForMeeting',
      });
    });
    setAllSlots([...tempArray]);
  }

  // Refresh the calendar once create slot
  const onAddBookingCalendar = () => {
    fetchSlots(dateRange);
  };

  const setSelectedDate = (selected) => {
    setSelectedDateTime(selected);
  }

  const refreshCalendar = (val) => {
    console.log(val)
    setDateRange(val);
    fetchSlots(val.from_datetime, val.to_datetime);
  }

  return (
    <React.Fragment>
      {id_service && (
        <section className="add-booking-space" style={{position: 'relative'}}>
          <h3>Add Booking Space</h3>
          <div className="service_calendar">
            <CalendarComponent
              INITIAL_EVENTS={slots}
              renderEventContent={renderEventContent}
              selectable={true}
              onSelectDate={(e) => setSelectedDate(e)}
              onDateChanged={(val) => refreshCalendar(val)}
            />
            <div className="booking_time">
              <AddBookingSlotSideBar
                onAddBookingCalendar={onAddBookingCalendar}
                user={user}
                getSelectedDateTime={getSelectedDateTime}
              />
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

export default AddBookingSlotCalendar;
