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
const MyCalendar = (props) => {
  const { t } = useTranslation();
  const [slots, setAllSlots] = useState([]);
  useEffect(() => {
    async function fetchSlots() {
      const params = {
        from_date: moment().startOf("week").format("YYYY-MM-DD"),
        to_date: moment().endOf("week").format("YYYY-MM-DD"),
      };
      const response = await search("/slot/list", params).catch((err) => {
        console.log("error", err);
      });

      if (response) {
        let tempArray = [];
        response["available_slots"] && response["available_slots"].forEach((slot) => {
          tempArray.push({
            groupId: "availableForMeeting",
            start: moment(slot.startDate).format(),
            end: moment(slot.endDate).format(),
            display: "background",
            // constraint: 'availableForMeeting',
          });
        });
        response["booked_slots"] && response["booked_slots"].forEach((slot) => {
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
    fetchSlots();
  }, []);
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
      <CalendarComponent
        INITIAL_EVENTS={slots}
        renderEventContent={renderEventContent}
      />
    </React.Fragment>
  );
};
export default MyCalendar;
