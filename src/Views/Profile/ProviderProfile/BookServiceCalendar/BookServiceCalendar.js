import React, { useState, useEffect, useRef } from 'react';
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import { useTranslation } from "react-i18next";
import { search } from "../../../../Services/Auth.service";
import TypographyComponent from "../../../../Components/Typography/Typography";
import CalendarComponent from "../../../../Components/Calendar/Calendar";
import AddBookingSidebar from "../../../../Components/Booking/AddBookingSidebar/AddBookingSidebar";
import moment from "moment";
import "../ProviderProfile.css";

function renderEventContent(eventInfo) {
  return (
    <React.Fragment>
      <div className="calendar_meeting_data">
        <b>{eventInfo.timeText}</b>
        <br />
        <span>{eventInfo.event.title}</span>
      </div>
    </React.Fragment>
  );
}

const BookServiceCalendar = ({ averageRatingInfo, selectedServiceDetails, userData }) => {

  // For the slot details and languages
  useEffect(() => {
    getSlotDetails();
  }, []);

  const { t } = useTranslation();
  const [slots, setAllSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const childRef = useRef();

  // Fetch the slots details
  const getSlotDetails = async () => {

    const params = {
      from_date: moment().startOf("week").format("YYYY-MM-DD"),
      to_date: moment().endOf("week").format("YYYY-MM-DD"),
    };

    await search("/slot/list", params).then(response => {
      response = {"booked_slots":[{"slot_id":59,"booking_id":7,"startDate":"2020-11-04T13:00:00+0000","endDate":"2020-11-04T16:30:00+0000","service_title":"Create a App","booked_by":159},{"slot_id":60,"booking_id":8,"startDate":"2020-11-05T16:15:00+0000","endDate":"2020-11-05T16:30:00+0000","service_title":"Create a App","booked_by":92},{"slot_id":56,"booking_id":null,"startDate":"2020-11-05T11:00:00+0000","endDate":"2020-11-05T15:30:00+0000","service_title":"Create a App","booked_by":null},{"slot_id":57,"booking_id":6,"startDate":"2020-11-05T10:00:00+0000","endDate":"2020-11-05T10:30:00+0000","service_title":"Create a App","booked_by":159}],"available_slots":[{"slot_id":55,"booking_id":null,"startDate":"2020-11-09T05:00:00+0000","endDate":"2020-11-09T07:00:00+0000","booked_by":null}]}
      setAvailableSlots(response["available_slots"]);
      makeSlotsArray(response.available_slots, response.booked_slots);
    }).catch((err) => {
      console.log("error", err);
    });
  }

  // Iterate the response and create array for the calendar
  const makeSlotsArray = (available_slots, booked_slots) => {
    let tempArray = [];
    console.log("available_slots: ", available_slots);
    available_slots.forEach((slot) => {
      tempArray.push({
        start: slot.startDate,
        end: slot.endDate,
        draggable: false,
        slot_id: slot.slot_id,
        color: '#4AC836'
      });
    });

    booked_slots.forEach((slot) => {
      tempArray.push({
        id: slot.slot_id,
        start: slot.startDate,
        end: slot.endDate,
        isBooked: true,
        title: slot.service_title,
        booked_by: slot.booked_by,
        color: "#4F4F4F",
        resize: false,
        overlap: false,
        selectable: false,
        editable: false,
        clickable: false
      });
    });
    setAllSlots([...tempArray]);
  }

  // on add booking save data to the database
  const onAddBooking = (data) => {
    // availableSlots.forEach((slot) => {
    //   const startDate = moment(slot.startDate).format("YYYY-MM-DDTHH:mm:ss");
    //   const endDate = moment(slot.endDate).format("YYYY-MM-DDTHH:mm:ss");
    // });
    console.log("dasdsa", data);
    // setAllSlots((d) => [...(d || []), data]);
  }

  return (
    <section className="book-service">
      <TypographyComponent
        variant="h4"
        title={t("providerProfile.bookService")}
      />
      <div className="book_service_inner">
        <div className="book_service_title">
          <div className="book_service_quality_review">
            <TypographyComponent title="Service quality" variant="h5" />
            <div className="book_service_quality_review_count">
              <TypographyComponent
                title={
                  averageRatingInfo && averageRatingInfo.average_service_quality_rating
                }
                variant="h5"
              />
              <StarRateRounded />
            </div>
            <TypographyComponent
              variant="h3"
              title={selectedServiceDetails.title}
            />
          </div>
          <div className="book_service_quality_review">
            <TypographyComponent title="Simpathy" variant="h5" />
            <div className="book_service_quality_review_count">
              <TypographyComponent
                title={averageRatingInfo && averageRatingInfo.average_sympathy_rating}
                variant="h5"
              />
              <StarRateRounded />
            </div>
            <TypographyComponent
              variant="h6"
              title={
                selectedServiceDetails.price && `${selectedServiceDetails.price} CHF/h`
              }
            />
          </div>
        </div>
      </div>
      <div className="service_calendar">
        <CalendarComponent
          INITIAL_EVENTS={slots}
          renderEventContent={renderEventContent}
          onSelectBookingSlot={(selectedServiceInfo) => {
            childRef.current.getSeletedSlotDetails(selectedServiceInfo);
          }}
        />

        <div className="booking_time">
          <AddBookingSidebar
            ref={childRef}
            onAddBooking={(data) => onAddBooking(data)}
            user={userData}
            selectedService={selectedServiceDetails}
          />
        </div>
      </div>
    </section>
  )
}

export default BookServiceCalendar
