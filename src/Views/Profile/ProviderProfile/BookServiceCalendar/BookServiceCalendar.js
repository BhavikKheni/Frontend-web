import React, { useState,  useRef } from "react";
import StarRateRounded from "@material-ui/icons/StarRateRounded";
import { useTranslation } from "react-i18next";
import { search } from "../../../../Services/Auth.service";
import TypographyComponent from "../../../../Components/Typography/Typography";
import CalendarComponent from "../../../../Components/Calendar/Calendar";
import AddBookingSidebar from "../../../../Components/Booking/AddBookingSidebar/AddBookingSidebar";
import TooltipComponent from "../../../../Components/Tooltip/Tooltip";
import moment from "moment";
import "../ProviderProfile.css";

function renderEventContent(eventInfo) {
  return (
    <React.Fragment>
      <div className="calendar_meeting_data">
        <b>{eventInfo.timeText}</b>
        <br />
        <TooltipComponent title={eventInfo.event.title} placement="bottom">
          <span>{eventInfo.event.title}</span>
        </TooltipComponent>
      </div>
    </React.Fragment>
  );
}

const BookServiceCalendar = ({
  averageRatingInfo,
  selectedServiceDetails,
  userData,
  loginUser
}) => {

  const { t } = useTranslation();
  const [slots, setAllSlots] = useState([]);

  // To set start and end datetime 
  const [dateRange, setDateRange] = useState({});

  const childRef = useRef();

  const fetchSlots = async (from_datetime, to_datetime,service) => {
    const params = {
      id_service:service.id_service,
      from_datetime: moment(from_datetime).subtract(1, 'day').format("YYYY-MM-DD hh:mm:ss"),
      to_datetime: moment(to_datetime).format("YYYY-MM-DD hh:mm:ss")
    };

    await search("/slot/list/service", params).then((response) => {
      handleResponse(response['available_slots'], response['booked_slots']);
    }).catch((err) => {
      console.log("error", err);
    });
  };

  // Iterate the response and create array for the calendar
  const handleResponse = (available_slots, booked_slots) => {
    let tempArray = [];
    available_slots.forEach((slot) => {
      tempArray.push({
        start: slot.startDate,
        end: slot.endDate,
        draggable: false,
        slot_id: slot.slot_id,
        color: "#4AC836",
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
        clickable: false,
      });
    });
    setAllSlots([...tempArray]);
  };

  // Refresh the calendar once create slot
  const onAddBookingCalendar = () => {
    fetchSlots(dateRange.from_datetime, dateRange.to_datetime,selectedServiceDetails);
  };

  const refreshCalendar = (val) => {
    setDateRange(val);
    fetchSlots(val.from_datetime, val.to_datetime,selectedServiceDetails);
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
                  averageRatingInfo &&
                  averageRatingInfo.average_service_quality_rating
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
                title={
                  averageRatingInfo && averageRatingInfo.average_sympathy_rating
                }
                variant="h5"
              />
              <StarRateRounded />
            </div>
            <TypographyComponent
              variant="h6"
              title={
                selectedServiceDetails.price &&
                `${selectedServiceDetails.price} CHF/h`
              }
            />
          </div>
        </div>
      </div>
      <div className="service_calendar">
        <CalendarComponent
          INITIAL_EVENTS={slots}
          renderEventContent={renderEventContent}
          onDateChanged={(val) => refreshCalendar(val)}
          onSelectBookingSlot={(selectedServiceInfo) => {
            childRef.current.getSeletedSlotDetails(selectedServiceInfo);
          }}
        />

        <div className="booking_time">
          <AddBookingSidebar
            ref={childRef}
            onAddBookingCalendar={onAddBookingCalendar}
            user={userData}
            selectedService={selectedServiceDetails}
            loginUser={loginUser}
          />
        </div>
      </div>
    </section>
  );
};

export default BookServiceCalendar;
