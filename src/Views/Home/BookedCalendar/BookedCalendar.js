import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@material-ui/core";
import CalendarComponent from "../../../Components/Calendar/Calendar";
import TypographyComponent from "../../../Components/Typography/Typography";
import moment from "moment";
import { search } from "../../../Services/Auth.service";

function renderEventContent(eventInfo) {
  return (
    <>
      <div>
        <i
          style={{
            color: "#4AC836",
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: "10px",
          }}
        >
          {eventInfo.event.extendedProps.description}
        </i>
        <br />
        <b>{eventInfo.timeText}</b>
        <br />
        <i>{eventInfo.event.title}</i>
      </div>
    </>
  );
}

const BookedCalendarComponent = (props) => {

  const { t } = useTranslation();
  const [slots, setAllSlots] = useState([]);

  const fetchSlots = async () => {
    const params = {
      from_datetime: moment().startOf("week").format("YYYY-MM-DD hh:mm:ss"),
      to_datetime: moment().endOf("week").format("YYYY-MM-DD hh:mm:ss"),
    };
    const response = await search("/slot/list", params).catch((err) => {
      console.log("error", err);
    });

    if (response) {
      let tempArray = [];
      response["booked_slots"] &&
        response["booked_slots"].forEach((slot) => {
          tempArray.push({
            id: slot.slot_id,
            start: moment(slot.startDate).format(),
            end: moment(slot.endDate).format(),
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
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  function handleChildClick(color) {
    alert("aa")
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TypographyComponent
            title={t("home.myCalendar.title")}
            variant="h3"
          />
        </Grid>
      </Grid>
      <div className="service_calendar">
        <CalendarComponent
          INITIAL_EVENTS={slots}
          renderEventContent={renderEventContent}
          onDateChanged={handleChildClick}
        />
      </div>
    </React.Fragment>
  );
};
export default BookedCalendarComponent;
