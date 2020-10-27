import React from "react";
import { Grid } from "@material-ui/core";
import CalendarComponent from "../Profile/Calendar/Calendar";

const INITIAL_EVENTS = [
  {
    groupId: "testGroupId",
    start: "2014-11-10T10:00:00",
    end: "2014-11-10T16:00:00",
  },
];
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
const AddBookingSpace = () => {
  return (
    <React.Fragment>
      <h3>Add Booking Space</h3>
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <CalendarComponent
            INITIAL_EVENTS={INITIAL_EVENTS}
            renderEventContent={renderEventContent}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AddBookingSpace;
