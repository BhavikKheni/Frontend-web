import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
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
  let { user } = useSession();
  const { id_service, editRecord } = props;
  const [slots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    getSlotDetails();
  }, []);

  const getSlotDetails = async () => {
    const params = {
      from_date: moment().startOf("week").format("YYYY-MM-DD"),
      to_date: moment().endOf("week").format("YYYY-MM-DD"),
    };
    const response = await search("/slot/list", params).catch((err) => {
      console.log("error", err);
    });

    if (response) {
      makeSlotsArray(response);
    }
  }

  const makeSlotsArray = (data) => {
    setAvailableSlots(data["available_slots"]);

    let tempArray = [];

    data["available_slots"].forEach((slot) => {
      tempArray.push({
        groupId: "availableForMeeting",
        start: moment(slot.startDate).toISOString(),
        end: moment(slot.endDate).toISOString(),
        display: "background",
        // constraint: 'availableForMeeting',
      });
    });

    data["booked_slots"].forEach((slot) => {
      tempArray.push({
        id: slot.slot_id,
        start: moment(slot.startDate).toISOString(),
        end: moment(slot.endDate).toISOString(),
        title: slot.service_title,
        description: "Booked",
        booked_by: slot.booked_by,
        color: "#4F4F4F",
        resize: false,
        overlap: false,
      });
    });
  
    setAllSlots([...tempArray]);
  }

  // Refresh the calendar after create slot
  const onAddBookingCalendar = (data) => {
    console.log("Data", data);

    // availableSlots.forEach((slot) => {
    //   const startDate = moment(slot.startDate).format("YYYY-MM-DDTHH:mm:ss");
    //   const endDate = moment(slot.endDate).format("YYYY-MM-DDTHH:mm:ss");
    // });
    setAllSlots((d) => [...(d || []), data]);
  };

  return (
    <React.Fragment>
      {id_service && (
        <section className="add-booking-space">
          <h3>Add Booking Space</h3>
          <div className="service_calendar">
            <CalendarComponent
              INITIAL_EVENTS={slots}
              renderEventContent={renderEventContent}
              selectable={true}
            />
          </div>
        </section>
      )}
      {id_service && (
        <div className="booking_time">
          <AddBookingSlotSideBar
            onAddBookingCalendar={(data) => onAddBookingCalendar(data)}
            user={user}
            selectedService={editRecord}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default AddBookingSlotCalendar;
