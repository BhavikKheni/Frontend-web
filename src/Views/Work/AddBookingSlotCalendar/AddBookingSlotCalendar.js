import React, { useState, useRef } from "react";
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
  const childRef = useRef();

  const { id_service, editRecord } = props;
  const [slots, setAllSlots] = useState([]);

  // To set start and end datetime 
  const [dateRange, setDateRange] = useState({});
  
  const fetchSlots = async (from_datetime, to_datetime) => {
    const params = {
      from_datetime: moment(from_datetime).subtract(1, 'day').format("YYYY-MM-DD hh:mm:ss"),
      to_datetime: moment(to_datetime).format("YYYY-MM-DD hh:mm:ss"),
      id_service:id_service
    };
    const response = await search("/slot/list/service", params).catch((err) => {
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
        start: slot.startDate,
        end: slot.endDate,
        color: "#4AC836",
        resize: false,
        overlap: false,
        slot_id: slot.slot_id,
        date1: moment(slot.startDate).format("DD/MM/YYYY HH:mm"),
        date2: moment(slot.endDate).format("DD/MM/YYYY HH:mm")
      });
    });
    console.log(tempArray)
    setAllSlots([...tempArray]);
  }

  // Refresh the calendar once create slot
  const onAddBookingCalendar = () => {
    fetchSlots(dateRange.from_datetime, dateRange.to_datetime);
  };

  const refreshCalendar = (val) => {
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
              onSelectDate={(slotDetails) => {
                childRef.current.setSeletedSlotDetails(slotDetails);
              }}
              onDateChanged={(val) => refreshCalendar(val)}
              onSelectBookingSlot={(slotDetails) => {
                childRef.current.setSeletedSlotDetails(slotDetails);
              }}
            />
            <div className="booking_time">
              <AddBookingSlotSideBar
                ref={childRef}
                onAddBookingCalendar={onAddBookingCalendar}
                user={user}
                id_service={id_service}
              />
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
};

export default AddBookingSlotCalendar;
