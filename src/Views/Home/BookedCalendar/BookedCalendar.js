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

  const fetchSlots = async (from_datetime, to_datetime) => {
    const params = {
      from_datetime: moment(from_datetime).subtract(1, 'day').toISOString(),
      to_datetime: moment(to_datetime).toISOString()
    };
    const response = await search("/slot/list", params).catch((err) => {
      console.log("error", err);
    });

    if (response) {
      handleResponse(response);
    }
  }

  const handleResponse = (response) => {
    let tempArray = [];
    response["booked_slots"] && response["booked_slots"].forEach((slot) => {
      tempArray.push({
        id: slot.slot_id,
        start: slot.startDate,
        end: slot.endDate,
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

  const refreshCalendar = (val) => {
    fetchSlots(val.from_datetime, val.to_datetime);
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
          onDateChanged={(val) => refreshCalendar(val)}
        />
      </div>
    </React.Fragment>
  );
};
export default BookedCalendarComponent;
