import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import "./Calendar.css";

const CalendarComponent = (props) => {
  const {INITIAL_EVENTS ,renderEventContent } = props;

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

      

      headerToolbar={{
        left: "today prevYear,prev,title,next,nextYear",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
        center: ""
      }}
      dayHeaderFormat={{
        day: "numeric",
        weekday: "short",
        month: "long",
      }}

      titleFormat={{
        month: "long",
        year: "numeric"
      }}

      initialView="timeGridWeek"
      formatDate={{
        month: "long",
        year: "numeric",
        day: "numeric",
      }}
      editable={true}
      selectable={false}
      selectMirror={true}
      dayMaxEvents={true}
      eventContent={renderEventContent && renderEventContent}
      initialEvents={INITIAL_EVENTS}
    />
  );
};
export default CalendarComponent;
