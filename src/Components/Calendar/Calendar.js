import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "date-fns";
import "./Calendar.css";

const CalendarComponent = (props) => {

  const { INITIAL_EVENTS, renderEventContent } = props;

  const onSelectSlot = (event) => {
    // alert('Event: ' + JSON.stringify(event));
    // alert('Event: ' + event.extendedProps.slot_id);
    props.onSelectBookingSlot(event);
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "today prevYear,prev,title,next,nextYear",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
        center: "",
      }}
      dayHeaderFormat={{
        day: "numeric",
        weekday: "short",
        month: "long",
      }}
      titleFormat={{
        month: "long",
        year: "numeric",
      }}
      initialView="timeGridWeek"
      formatDate={{
        month: "long",
        year: "numeric",
        day: "numeric",
      }}
      // businessHours={true}
      editable={true}
      eventConstraint={"businessHours"} // disabled drag and drop in whole calendar
      eventContent={renderEventContent}
      events={INITIAL_EVENTS}
      eventClick= {(info) => {
        onSelectSlot(info.event);
      }}
    />
  );
};
export default CalendarComponent;
