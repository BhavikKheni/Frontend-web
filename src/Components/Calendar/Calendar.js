import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import $ from "jquery";
import "date-fns";
import "./Calendar.css";

const CalendarComponent = (props) => {

  const { INITIAL_EVENTS, renderEventContent } = props;

  const onSelectSlot = (event) => {
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
      // selectConstraint= {{
      //   start: moment().subtract(1, 'days'),
      //  end: moment().startOf('year').add(100, 'year')
      //  }}
      eventContent={renderEventContent}
      events={INITIAL_EVENTS}
      eventClick= {(info) => {
        console.log("aaa", info.event.extendedProps.isBooked);
        if (!info.event.extendedProps.isBooked) {
          onSelectSlot(info.event);
        }
      }}
    />
  );
};
export default CalendarComponent;
