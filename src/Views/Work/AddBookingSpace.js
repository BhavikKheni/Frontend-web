import React from "react";
import { Grid } from "@material-ui/core";
import CalendarComponent from "../../Components/Calendar/Calendar";

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
const AddBookingSpace = (props) => {
  const { tempArray } = props;
  return (
    <React.Fragment>
      <h3>Add Booking Space</h3>
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          <CalendarComponent
            INITIAL_EVENTS={tempArray}
            renderEventContent={renderEventContent}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default AddBookingSpace;
