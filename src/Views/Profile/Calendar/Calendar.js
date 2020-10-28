import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

const CalendarComponent = (props) => {
  const {INITIAL_EVENTS ,renderEventContent } = props;

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        right: "timeGridWeek,dayGridMonth,timeGridDay",
        left: "today,prev,next",
        center: "",
      }}
      dayHeaderFormat={{
        day: "numeric",
        weekday: "short",
        month: "short",
      }}
      firstDay={1}
      // titleFormat = 'dddd, MMMM D, YYYY'
      initialView="dayGridWeek"
      defaultView="dayGridWeek"
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
